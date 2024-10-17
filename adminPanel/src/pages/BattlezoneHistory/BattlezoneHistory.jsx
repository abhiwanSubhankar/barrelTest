import { useState, useEffect } from "react";
import styles from "./BattlezoneHistory.module.css";
import sampleData from "./leaders.js";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Modal from "./Modal";
import { base_url } from "../../baseUrl/baseUrl.js";
import axios from "axios";

const BattlezoneHistory = () => {
  const initialData = sampleData;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [allGames, setAllGames] = useState([]);
  const token = JSON.parse(sessionStorage.getItem("token"));

  useEffect(() => {
    setLoading(true);
    axios.get(`${base_url}/allMatches`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((data) => {
      console.log("all games data", data.data);
      // setAllGames(data?.data.data);
      let reversedData = data?.data.data.reverse();
      setData(reversedData);
      setLoading(false);

    }).catch((er) => {
      console.log(er);
    })

  }, [token]);

  // useEffect(() => {
  //   const dataWithSerialNumbers = allGames?.map((item, index) => ({
  //     ...item,
  //     serialNumber: (index + 1).toString().padStart(2, "0"),
  //   }));
  //   // Set a delay before setting the data and loading state
  //   setTimeout(() => {
  //     setData(dataWithSerialNumbers);
  //     setLoading(false);
  //   }, 1000);
  // }, [initialData, currentPage, rowsPerPage]);

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
    setSelectedData(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const truncateAddress = (address) => {
    if (!address) return "";
    const start = address.slice(0, 6);
    const end = address.slice(-6);
    return `${start}...${end}`;
  };

  return (
    <SkeletonTheme baseColor="transparent" highlightColor="#ddd">
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>S.NO.</th>
              <th>User ID</th>
              <th>Bet Amount</th>
              <th>Score</th>
              <th>Level played</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {loading
              ? Array.from({ length: rowsPerPage }).map((_, index) => (
                <tr key={index}>
                  <td>
                    <Skeleton height={20} className={styles.rowSkeleton} />
                  </td>
                </tr>
              ))
              : currentData?.map((item, idx) => (
                <tr key={item._id}>
                  <td>{idx + 1}</td>
                  <td>{truncateAddress(item?.userId)}</td>
                  <td>{item?.betAmount}</td>
                  <td>{item?.score.toFixed(2)}</td>
                  <td>{item?.level}</td>
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
              setRowsPerPage(parseInt(e.target.value))
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
            {firstIndex + 1}-{Math.min(lastIndex, data.length)} of {data.length}
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
      <Modal
        showModal={showModal}
        closeModal={closeModal}
        data={selectedData}
      />
    </SkeletonTheme>
  );
};

export default BattlezoneHistory;
