import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideMenu from "../components/SideMenu/SideMenu";
import styles from "./Layout.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  const location = useLocation();

  // Determine the heading based on the current path
  const getHeading = () => {
    switch (location.pathname) {
      case "/":
        return "User Data";

      case "/user/:id":
        return "User Details";

      case "/addtoken":
        return "Add Token";

      case "/redeemtoken":
        return "Redeem Token";

      case "/matchhistory":
        return "All Battles";

      case "/creditedTransaction":
        return "Credited Transaction";

      case "/debitedTransaction":
        return "Debited Transaction";

      case "/leaderBoard":
        return "Leader Board";

      case "/shop":
        return "Shop";

      case "/adminledger":
        return "Admin Ledger";
        
      // Add more cases if you have additional routes
      default:
        return "User Data"; // Default heading
    }
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
        </div>
        <div className={styles.contentDiv}>
          <Outlet /> {/* Correct usage of Outlet */}
        </div>
      </div>

    </div>
  );
};

export default Layout;
