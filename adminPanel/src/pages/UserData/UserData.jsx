import styles from "./UserData.module.css";
import { useState, useEffect } from "react";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../../baseUrl/baseUrl.js";

const UserData = () => {

  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const token = JSON.parse(sessionStorage.getItem("token"));


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


  // useEffect(() => {
  //   const dataWithSerialNumbers = initialData.map((item, index) => ({
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
  const currentData = query ? filteredData.slice(firstIndex, lastIndex) : data.slice(firstIndex, lastIndex);

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



  // Function to check if any value in the object matches the search string
  const search = (array, query) => {
    return array.filter(obj => {
      return Object.values(obj).some(value =>
        value.toString().toLowerCase().includes(query.toLowerCase())
      );
    });
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    let searchedData = search(data, searchQuery);
    setFilteredData(searchedData);
    console.log("searched Data", searchedData);

  };

  return (
    <SkeletonTheme baseColor="transparent" highlightColor="#ddd">
      {/* <div className={styles.container}> */}

      <div className={styles.tableContainer}>

        <div className={styles.searchContainer}>
          <img
            src="https://img.icons8.com/ios-glyphs/30/000000/search.png"
            alt="Search Icon"
            className={styles.searchIcon}
          />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>S.NO.</th>
              <th>Wallet Address</th>
              <th>Balance</th>
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
                </tr>
              ))
              : (query ? filteredData : currentData)?.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{truncateAddress(item?.walletAddress)}</td>
                  <td>{item?.balance}</td>

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

      {/* </div> */}
    </SkeletonTheme>

  );
};

export default UserData;
