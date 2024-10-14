
import { useState } from "react";
import styles from "./connectModal.module.css";


const ConnectWallet = ({ isOpen, onClose, connectWallet }) => {
    const [formData, setFormData] = useState({
        walletAddress: `def${Date.now()}abc`
    });

    console.log("formdata", formData)

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData)
        connectWallet(formData);
    };


    if (!isOpen) return null;


    return <div className={styles.modalOverlay} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalContent}>
            <h2 className={styles.heading}>Connect Wallet</h2>

            <button className={styles.closeButton} onClick={onClose}>
                &times;
            </button>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label htmlFor="name">Enter Wallet Address:</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="name"
                        name="walletAddress"
                        value={formData.walletAddress}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* <div>
                    <label htmlFor="price">Price:</label>
                    <input
                        className={styles.input}
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div> */}

                {/* submit */}

                <div className={styles.btnOuterDivI}>
                    {/* <button className={styles.button} onClick={() => { }}>

                    </button> */}

                    <button className={styles.button} type="submit" >
                        Connect Wallet
                    </button>

                </div>
            </form>

        </div>
    </div>

};

export default ConnectWallet;

