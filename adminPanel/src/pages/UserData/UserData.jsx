import styles from "./UserData.module.css";
import { useState, useEffect, useCallback } from "react";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import { base_url } from "../../baseUrl/baseUrl.js";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import toast from "react-hot-toast";

const UserData = () => {

  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const token = JSON.parse(sessionStorage.getItem("token"));
  let searchQuery = useOutletContext();

  // console.log("quarry from outlet", searchQuery)


  useEffect(() => {
    setLoading(true);
    axios.get(`${base_url}/allUser`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((data) => {
      console.log("user data", data);
      // setUserData(data?.data.data);
      let reversedData = data?.data.data.reverse();
      setData(reversedData);
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

  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;
  const currentData = query ? filteredData.slice(firstIndex, lastIndex) : data.slice(firstIndex, lastIndex);

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

  const handleViewClick = (item) => {
    const id = item?._id;
    navigate(`/user/${id}`, { state: { user: item } });
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
  }, [searchQuery, handleSearch])

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("copied to clipboard!.");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <SkeletonTheme baseColor="transparent" highlightColor="#ddd">
      {/* <div className={styles.container}> */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>S.NO.</th>
              <th>User ID</th>
              <th>Wallet Address</th>
              <th>Balance</th>
              <th>Date</th>
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
                </tr>
              ))
              : (query ? filteredData : currentData)?.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{truncateAddress(item?._id)}</td>
                  <td className={styles.walletAddress}>{truncateAddress(item?.walletAddress)}
                    <button
                      style={{ background: "local", border: "none" }}
                      onClick={() => handleCopy(item?.walletAddress)}
                    >
                      <ContentCopyIcon />
                    </button>
                  </td>
                  <td>{item?.balance}</td>
                  <td>{(item?.createdAt ? item.createdAt : item.updatedAt).split("T")[0]}</td>

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


      <div className={styles.divider}></div>

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
      {/* </div> */}
    </SkeletonTheme>
  );
};

export default UserData;
