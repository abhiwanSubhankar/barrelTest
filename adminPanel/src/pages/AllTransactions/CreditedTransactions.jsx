import { useState, useEffect } from "react";
import styles from "./AllTransaction.module.css";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Modal from "./Modal.jsx";
import { base_url } from "../../baseUrl/baseUrl.js";
import axios from "axios";

const CreditedTransactions = () => {

  const [AllTransaction, setAllTransaction] = useState([]);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const token = JSON.parse(sessionStorage.getItem("token"));


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
      setAllTransaction(data?.data.data)
      setLoading(false);

    }).catch((er) => {
      console.log(er);

    })
  }, [token]);

  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;
  const currentData = data.slice(firstIndex, lastIndex);

  console.log("current Data", currentData);
  console.log("current data Data", data);

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
    setSelectedData(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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
              <th>Type</th>
              <th>Reason</th>
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
              : AllTransaction?.map((item, idx) => (
                <tr key={item?._id}>
                  <td>{idx + 1}</td>
                  <td>{truncateAddress(item?._id)}</td>
                  <td>{truncateAddress(item?.userId)}</td>
                  <td>{item?.amount}</td>
                  <td>{item?.type}</td>
                  <td>{item?.reason}</td>

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

      {/* <div className={styles.divider}></div> */}

      {/* <div className={styles.footer}>
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
      </div> */}

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
