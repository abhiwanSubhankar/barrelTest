import React, { useState, useEffect } from "react";
import styles from "./UserTransactions.module.css";
import sampleData from "./leaders.js";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Modal from "./Modal"; // Import the Modal component

const UserTransactions = () => {
  const initialData = sampleData;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedData, setSelectedData] = useState(null); // Data for the selected row

  useEffect(() => {
    const dataWithSerialNumbers = initialData.map((item, index) => ({
      ...item,
      serialNumber: (index + 1).toString().padStart(2, "0"),
    }));
    // Set a delay before setting the data and loading state
    setTimeout(() => {
      setData(dataWithSerialNumbers);
      setLoading(false);
    }, 1000);
  }, [initialData, currentPage, rowsPerPage]);

  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;
  const currentData = data.slice(firstIndex, lastIndex);

  const nextPage = () => {
    if (lastIndex < data.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModal = (item) => {
    setSelectedData(item); // Set the selected item data
    setShowModal(true); // Show the modal
  };

  const closeModal = () => {
    setShowModal(false); // Hide the modal
  };

  console.log("loading state", loading);
  return (
    <SkeletonTheme baseColor="transparent" highlightColor="#d70d0d">
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>S.NO.</th>
              <th>Wallet Address</th>
              <th>Account Balance</th>
              <th>TOTAL RACE WIN</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {loading
              ? Array.from({ length: rowsPerPage }).map((_, index) => (
                  <tr key={index}>
                    <td>
                      <Skeleton height={40} className={styles.rowSkeleton} />
                    </td>
                  </tr>
                ))
              : currentData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.serialNumber}</td>
                    <td>{item.walletAddress}</td>
                    <td>{item.accountBalance}</td>
                    <td>{item.totatalracewin}</td>
                    <td>
                      <button
                        className={styles.button}
                        onClick={() => openModal(item)}
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* <div className={styles.divider}></div> */}

      <div className={styles.footer}>
        <div className={styles.rowsPerPage}>
          <label htmlFor="rowsPerPage">Rows per page:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <div>
          {firstIndex + 1}-{Math.min(lastIndex, data.length)} of {data.length}
        </div>
        <div className={styles.nextPrevBtnsDiv}>
          <div className={styles.prevBtn} onClick={prevPage}>
            <SkipPreviousIcon />
          </div>
          <div>
            <ArrowBackIosIcon className={styles.arrowbtn} />
            <ArrowForwardIosIcon className={styles.arrowbtn} />
          </div>
          <div className={styles.nextBtn} onClick={nextPage}>
            <SkipNextIcon />
          </div>
        </div>
      </div>

      {/* Render the modal and pass the selected data */}
      <Modal
        showModal={showModal}
        closeModal={closeModal}
        data={selectedData}
      />
    </SkeletonTheme>
  );
};

export default UserTransactions;
