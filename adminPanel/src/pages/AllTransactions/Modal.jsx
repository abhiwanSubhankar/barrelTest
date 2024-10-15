import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ showModal, closeModal, data }) => {
  console.log("data", data);
  if (!showModal) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Details</h2>
        <div className={styles.dataRow}>
          <strong>Ada Amount:</strong> <span>{data?.adaAmount}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Bank Amount:</strong> <span>{data?.bankAmount}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>CreatedAt:</strong> <span>{data?.createdAt}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Hash:</strong> <span>{data?.hash}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Initiated By:</strong> <span>{data?.initiatedBy}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Sender:</strong> <span>{data?.sender}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Status:</strong> <span>{data?.status}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Type:</strong> <span>{data?.type}</span>
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
