import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "./UserDetail.module.css";
import UserTransactions from "./UserTransactions/UserTransactions.jsx";
import { decryptData, encryptData } from "../../crypto/crypto.js";
import { base_url } from "../../baseUrl/baseUrl.js";
// import GameHistoryTransactions from "./GameHistoryTransactions /GameHistoryTransactions.jsx";

const UserDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [data, setUser] = useState(location.state?.user || null);
  console.log("Data received from parent:", data?.walletAddress);
  const [singleProfile, setSingleProfile] = useState([]);
  const [transactions, setTransactions] = useState([]); // Rename the state variable
  const [gameHistorytransactions, setGameHistoryTransactions] = useState([]); // Rename the state variable

  const userData = JSON.parse(sessionStorage.getItem("token"));
  const decryptedData = decryptData(userData?.data);
  console.log("user token data", decryptedData?.token);

  useEffect(() => {
    const fetchActiveUserProfile = async () => {
      const fullUrl = `${base_url}/admin/profiles/player`;
      console.log("Requesting URL:", fullUrl);

      try {
        const reqBody = {
          walletAddress: data?.walletAddress,
        };
        const reqBodyen = encryptData(reqBody);
        const requestBody = {
          data: reqBodyen,
        };
        console.log("Encrypted data sending to get single profile:", reqBody);
        const response = await fetch(fullUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${decryptedData?.token}`,
          },
          body: JSON.stringify(requestBody),
        });

        console.log("Response for active single user:", response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        const decryptedDataUserList = decryptData(responseData?.data);
        setSingleProfile(decryptedDataUserList);
        console.log(
          "Decrypted data listing for active single user:",
          decryptedDataUserList
        );
      } catch (err) {
        console.error("Error fetching active profiles:", err);
      }
    };

    const fetchTransactions = async () => {
      const transactionsUrl = `${base_url}/admin/profiles/transactions`;
      console.log("Requesting URL:", transactionsUrl);

      try {
        const reqBody = {
          walletAddress: data?.walletAddress,
        };
        const reqBodyen = encryptData(reqBody);
        const requestBody = {
          data: reqBodyen,
        };
        console.log("Encrypted data sending to get transactions:", reqBody);
        const response = await fetch(transactionsUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${decryptedData?.token}`,
          },
          body: JSON.stringify(requestBody),
        });

        console.log("Response for transactions:", response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        const decryptedDataTransactions = decryptData(responseData?.data);
        setTransactions(decryptedDataTransactions); // Use the renamed state variable
        console.log(
          "Decrypted data listing for transactions:",
          decryptedDataTransactions
        );
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    const fetchGameHistoryTransactions = async () => {
      const transactionsUrl = `${base_url}/admin/profiles/games`;
      console.log("Requesting URL:", transactionsUrl);

      try {
        const reqBody = {
          walletAddress: data?.walletAddress,
        };
        const reqBodyen = encryptData(reqBody);
        const requestBody = {
          data: reqBodyen,
        };
        console.log("Encrypted data sending to get transactions:", reqBody);
        const response = await fetch(transactionsUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${decryptedData?.token}`,
          },
          body: JSON.stringify(requestBody),
        });

        console.log("Response for transactions:", response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        const decryptedDataTransactions = decryptData(responseData?.data);
        setGameHistoryTransactions(decryptedDataTransactions); // Use the renamed state variable
        console.log(
          "Decrypted data listing for transactions:",
          decryptedDataTransactions
        );
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchActiveUserProfile();
    fetchTransactions();
    fetchGameHistoryTransactions();
  }, [data, decryptedData?.token]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.dataRow}>
          <strong>Back Ada Balance:</strong>{" "}
          <span>{singleProfile?.bankAdaBalance}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Bank Token Balance:</strong>{" "}
          <span>{singleProfile?.bankTokenBalance}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Stake Address:</strong>{" "}
          <span>{singleProfile?.stakeAddress}</span>
        </div>
      </div>
      <div className={styles.transactionSectionOuterDiv}>
        <div className={styles.headingDiv}>
          <h2>Transaction</h2>
        </div>
        <UserTransactions transactions={transactions} />
      </div>
      <div className={styles.transactionSectionOuterDiv}>
        <div className={styles.headingDiv}>
          <h2>Game History</h2>
        </div>
        <GameHistoryTransactions transactions={transactions} />
      </div>
    </div>
  );
};

export default UserDetail;
