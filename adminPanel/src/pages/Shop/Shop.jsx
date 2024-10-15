import { useState, useEffect } from "react";
import styles from "./shop.module.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { base_url } from "../../baseUrl/baseUrl.js";
import axios from "axios";
import ShopCard from "./components/ShopCard.jsx";
import Modal from "./components/Modal.jsx";

const Shop = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [modalType, setModalType] = useState("");
    const [selectedData, setSelectedData] = useState(null); // Data for the selected row
    const token = JSON.parse(sessionStorage.getItem("token"));


    useEffect(() => {

        setLoading(true);
        axios.get(`${base_url}/api/admin/shop`, {
            headers: {
                Authorization: `Bearer ${token}` // Set the Authorization header with the token
            }
        }).then((data) => {

            console.log("transaction data", data);
            setData(data?.data.products)
            setLoading(false);

        }).catch((er) => {
            console.log(er);

        })
    }, [token]);

    const openModal = (type, item) => {
        if (item) setSelectedData(item); // Set the selected item data
        setShowModal(true); // Show the modal
        setModalType(type);
    };

    const closeModal = () => {
        setShowModal(false); // Hide the modal
    };

    return (
        <SkeletonTheme baseColor="transparent" highlightColor="#ddd" >
            <div className={styles.tableContainer}>

                <button className={styles.createTokenButton} onClick={() => openModal("create")}>Create Shop Tokens</button>

                <div className={styles.categorySection}>
                    <div className={styles.categoryName}>
                        Troopers
                    </div>

                    {
                        loading ? <div className={styles.categoryCardsWrapper}>
                            <Skeleton height={255} width={220} className={styles.rowSkeleton} />
                            <Skeleton height={255} width={220} className={styles.rowSkeleton} />
                            <Skeleton height={255} width={220} className={styles.rowSkeleton} />
                        </div> : <div className={styles.categoryCardsWrapper}>
                            {
                                data.length > 0 && data?.filter((e) => e.category === "troopers").map((e,i) => {
                                    return <ShopCard key={e._id} cardData={e} openModal={openModal} image={`/dice${i%5}.png`}></ShopCard>
                                })
                            }
                        </div>
                    }
                </div>
                {/* dice */}
                <div className={styles.categorySection}>
                    <div className={styles.categoryName}>
                        Dice
                    </div>

                    {
                        loading ? <div className={styles.categoryCardsWrapper}>
                            <Skeleton height={255} width={220} className={styles.rowSkeleton} />
                            <Skeleton height={255} width={220} className={styles.rowSkeleton} />
                            <Skeleton height={255} width={220} className={styles.rowSkeleton} />
                        </div> : <div className={styles.categoryCardsWrapper}>
                            {
                                data.length > 0 && data?.filter((e) => e.category === "dice").map((e,i) => {
                                    return <ShopCard key={e._id} cardData={e} openModal={openModal} image={`/dice${i%5}.png`}></ShopCard>
                                })
                            }
                        </div>
                    }
                </div>

                {/* Render the modal and pass the selected data */}
                {
                    showModal && <Modal
                        showModal={showModal}
                        closeModal={closeModal}
                        modalType={modalType}
                        userdata={selectedData}
                    />
                }

            </div>
        </SkeletonTheme>
    );
};

export default Shop;
