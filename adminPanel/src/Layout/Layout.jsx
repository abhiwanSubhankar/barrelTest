import { Outlet, useLocation } from "react-router-dom";
import SideMenu from "../components/SideMenu/SideMenu";
import styles from "./Layout.module.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const Layout = () => {
  const location = useLocation();
  const [query, setQuery] = useState("");

  // Determine the heading based on the current path
  const getHeading = () => {
    switch (location.pathname) {
      case "/":
        return "User Data";

      case "/matchhistory":
        return "All Matches";

      case "/creditedTransaction":
        return "Credited Transaction";

      case "/debitedTransaction":
        return "Debited Transaction";

      case "/statistics":
        return "Statistics";

      // Add more cases if you have additional routes
      default:
        return "User Data"; // Default heading
    }
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
  };


  return (
    <div className={styles.LayoutOuterDiv}>
      <ToastContainer></ToastContainer>

      <div className={styles.sideMenuDiv}>
        <SideMenu />
      </div>

      <div className={styles.headingAndContentDivOuter}>
        <div className={styles.headingDiv}>
          <h2>{getHeading()}</h2> {/* Dynamic heading */}
          {/* general search bar  */}
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
        </div>
        <div className={styles.contentDiv}>
          <Outlet context={query} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
