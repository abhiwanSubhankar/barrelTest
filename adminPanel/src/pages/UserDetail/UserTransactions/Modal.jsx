import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ showModal, closeModal, data }) => {
  if (!showModal) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Details</h2>
        <div className={styles.dataRow}>
          <strong>S.NO.:</strong> <span>{data?.serialNumber}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Wallet Address:</strong> <span>{data?.walletAddress}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Account Balance:</strong> <span>{data?.accountBalance}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Total Race Wins:</strong> <span>{data?.totatalracewin}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Total Race Distance:</strong>{" "}
          <span>{data?.totalracedistance}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Win Price:</strong> <span>{data?.winprice}</span>
        </div>
        <div className={styles.btnOuterDiv}>
          <button className={styles.closeButton} onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
