import styles from "./shopcard.module.css";


const ShopCard = ({ cardData, openModal, image}) => {

    const handleEdit = () => {
        openModal("update", cardData)
    }


    return <div className={styles.card}>

        <div style={{
            display: "flex",
            justifyContent: "center",
        }}>

            {/* <img src={cardData?.image || "/dice0.png"} alt="img" style={{
                width: "100px",
                margin: "auto"
            }} /> */}
            <img src={image} alt="img" style={{
                width: "100px",
                margin: "auto"
            }} />
        </div>

        {/* <img src="https://images.unsplash.com/photo-1613355398841-4d956786806f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGZyb2d8ZW58MHx8MHx8fDA%3D" alt="img" /> */}

        <div>
            <div className={styles.infoDiv}>
                <div>
                    <h3>{cardData?.name}</h3>
                    <p>${cardData?.price}</p>
                </div>
                <p> {cardData?.description}.</p>
            </div>
            <button className={styles.button} onClick={handleEdit}>Edit</button>
        </div>

    </div>
};

export default ShopCard;