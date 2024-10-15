import styles from "./Modal.module.css";

const Modal = ({ showModal, closeModal, data }) => {
  if (!showModal) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Details</h2>
        <div className={styles.dataRow}>
          <strong>Bet Ada:</strong> <span>{data?.bet?.ada}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Bet Bank:</strong> <span>{data?.bet?.bank}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Game Id:</strong> <span>{data?.gameId}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Total Race Wins:</strong> <span>{data?.result}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Reward Ada:</strong> <span>{data?.reward?.ada}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Reward Bank:</strong> <span>{data?.reward?.bank}</span>
        </div>
        <div className={styles.dataRow}>
          <strong>Created At:</strong>{" "}
          <span>{data?.createdAt}</span>
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
