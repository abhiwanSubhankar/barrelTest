import { useState, useEffect, useCallback } from "react";
import styles from "./AllTransaction.module.css";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Modal from "./Modal.jsx";
import { base_url } from "../../baseUrl/baseUrl.js";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CreditedTransactions = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  let searchQuery = useOutletContext();


  const truncateAddress = (address) => {
    if (!address) return "";
    const start = address.slice(0, 6);
    const end = address.slice(-6);
    return `${start}...${end}`;
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`${base_url}/payments/credit`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((data) => {

      console.log("transaction data", data);
      // setAllTransaction(data?.data.data);

      let reversedData = data?.data.data.reverse();
      setData(reversedData)
      setLoading(false);

    }).catch((er) => {
      console.log(er);

    })
  }, [token]);

  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;
  const currentData = query ? filteredData.slice(firstIndex, lastIndex) : data.slice(firstIndex, lastIndex);

  console.log("current Data", currentData);
  console.log("current data Data", data);

  const nextPage = () => {
    if (query) {
      if (lastIndex < filteredData.length) {
        setCurrentPage(currentPage + 1);
      }
    } else {

      if (lastIndex < data.length) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModal = (item) => {
    setSelectedData(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Function to check if any value in the object matches the search string
  const search = (array, query) => {
    return array.filter(obj => {
      return Object.values(obj).some(value =>
        value.toString().toLowerCase().includes(query.toLowerCase())
      );
    });
  };

  const handleSearch = useCallback((query) => {
    setQuery(query);
    let searchedData = search(data, query);
    setFilteredData(searchedData);
    // console.log("searched Data", searchedData);
  }, [data]);

  useEffect(() => {
    handleSearch(searchQuery);
    setCurrentPage(1);
  }, [searchQuery, handleSearch]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("copied to clipboard!.");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  function capitalizeWords(str) {
    return str.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }

  return (
    <SkeletonTheme baseColor="transparent" highlightColor="#ddd">
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>S.NO.</th>
              <th>Payment ID</th>
              <th>Sender ID</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {loading
              ? Array.from({ length: rowsPerPage }).map((_, index) => (
                <tr key={index}>
                  <td>
                    <Skeleton height={15} className={styles.rowSkeleton} />
                  </td>
                </tr>
              ))
              : currentData?.map((item, idx) => (
                <tr key={item?._id}>
                  <td>{idx + 1}</td>
                  <td>{truncateAddress(item?._id)}</td>
                  <td>{truncateAddress(item?.userId)}
                    <button
                      className={styles.copyButton}
                      onClick={() => handleCopy(item?.userId)}
                    >
                      <ContentCopyIcon />
                    </button>
                  </td>
                  <td>{item?.amount}</td>
                  <td>{capitalizeWords(item?.reason)}</td>
                  <td>{(item?.createdAt ? item.createdAt : item.updatedAt).split("T")[0]}</td>

                  {/* <td>
                    <button
                      className={styles.button}
                      onClick={() => openModal(item)}
                    >
                      VIEW
                    </button>
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.footer}>
        <div className={styles.rowsPerPage}>
          <label htmlFor="rowsPerPage">Rows per page:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="35">35</option>
          </select>
        </div>

        <div className={styles.nextPrevBtnsDiv}>
          <div className={styles.prevBtn} onClick={prevPage}>
            <SkipPreviousIcon />
          </div>
          <div>
            {firstIndex + 1}-{Math.min(lastIndex, query ? filteredData.length : data.length)} of {query ? filteredData.length : data.length}
          </div>
          <div className={styles.nextBtn} onClick={nextPage}>
            <SkipNextIcon />
          </div>
        </div>

        <div className={styles.pageNo}>
          page:{currentPage}
        </div>

      </div>

      {/* Render the modal and pass the selected data */}
      {/* <Modal
        showModal={showModal}
        closeModal={closeModal}
        data={selectedData}
      /> */}
    </SkeletonTheme>
  );
};

export default CreditedTransactions;
