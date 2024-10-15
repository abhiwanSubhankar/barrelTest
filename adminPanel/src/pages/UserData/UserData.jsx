import styles from "./UserData.module.css";
import { useState, useEffect } from "react";
import sampleData from "./leaders.js";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../../baseUrl/baseUrl.js";

const UserData = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const [userData, setUserData] = useState([])

  useEffect(() => {
    setLoading(true);
    axios.get(`${base_url}/allUser`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((data) => {
      console.log("user data", data);
      setUserData(data?.data.data)
      setLoading(false);
    }).catch((er) => {
      console.log(er);
    })
  }, [token]);

  const truncateAddress = (address) => {
    if (!address) return "";
    const start = address.slice(0, 6);
    const end = address.slice(-6);
    return `${start}...${end}`;
  };

  const initialData = sampleData;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [loading, setLoading] = useState(true);

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
  const navigate = useNavigate();

  const handleViewClick = (item) => {
    const id = item?._id;
    navigate(`/user/${id}`, { state: { user: item } });
  };


  return (
    <SkeletonTheme baseColor="transparent" highlightColor="#ddd">
      {/* <div className={styles.container}> */}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>S.NO.</th>
              <th>Wallet Address</th>
              <th>Balance</th>
              {/* <th>WinStreaks</th> */}
              {/* <th>ACTION</th> */}
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {loading
              ? Array.from({ length: rowsPerPage }).map((_, index) => (
                <tr key={index}>
                  <td>
                    <Skeleton height={10} className={styles.rowSkeleton} />
                  </td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                </tr>
              ))
              : userData?.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{truncateAddress(item?.walletAddress)}</td>
                  <td>{item?.balance}</td>
                  {/* <td>{item?.winStreaks}</td> */}
                  {/* <td>
                    <Button
                      className={styles.button}
                      onClick={() => handleViewClick(item)}
                      text={"View"}
                    >
                    </Button>
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

      {/* </div> */}
    </SkeletonTheme>

  );
};

export default UserData;
