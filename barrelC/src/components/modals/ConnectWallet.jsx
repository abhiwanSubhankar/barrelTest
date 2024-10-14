
import { useState } from "react";
import styles from "./connectModal.module.css";


const ConnectWallet = ({ isOpen, onClose, userdata }) => {
    const [formData, setFormData] = useState({
        name: userdata?.name || '',
        price: userdata?.price || '',
        category: userdata?.category || 'troopers',
        stock: userdata?.stock || 0,
        description: userdata?.description || '',
        image: userdata?.image || null,
    });

    console.log("formdata", formData)

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value,
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('stock', formData.stock);
        data.append('description', formData.description);

        // // Append the image file
        // if (formData.image) {
        //     data.append('image', formData.image);
        // }
    };


    if (!isOpen) return null;


    return <div className={styles.modalOverlay}>
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
                        name="name"
                        value={formData.name}
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
                    <button className={styles.button} onClick={() => { }}>
                        Connect Wallet
                    </button>

                    <button className={styles.button} type="submit" >
                        Create
                    </button>

                </div>
            </form>

        </div>
    </div>

};

export default ConnectWallet;

