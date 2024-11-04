import styles from "./connectModal.module.css";

const Confirm = ({ isOpen, onClose, confirm }) => {

    if (!isOpen) return null;

    return <div className={styles.modalOverlay} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.heading}>Disconnect Wallet</h2>

            <button className={styles.closeButton} onClick={onClose}>
                &times;
            </button>

            <h3 className={styles.contactinfo}>
                Are You Sure You Want To Disconnect the Current Wallet ?
            </h3>

            <div className={styles.btnOuterDiv}>
                <button className={styles.button} onClick={onClose} >
                    No
                </button>
                <button className={styles.button} onClick={confirm} >
                    Yes
                </button>
            </div>
        </div>
    </div>

};

export default Confirm;

