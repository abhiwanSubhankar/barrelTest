import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminHouseCut.module.css"; // Import CSS module
import { base_url } from "../../baseUrl/baseUrl";
import { toast } from "react-toastify";

const AdminHouseCut = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [houseCut, setHouseCut] = useState(0);

  const [editData, setEditData] = useState({
    cutPercentage: houseCut,
    defaultRoomFee: 0.25,
    defaultMinBalance: 10
  })
  const token = JSON.parse(sessionStorage.getItem("token"));


  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    console.log("edit Data", editData);

    axios.post(`${base_url}/api/admin/house-cut`, editData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // Set the Authorization header with the token
      }
    }).then((data) => {

      let response = data.data.data.data;
      console.log("houseCut", data.data.data.data);
      setHouseCut(response.houseCut);
      toast.success("Percentage Saved!");
      handleCloseModal();
      // setEditData({ ...editData, cutPercentage: data.data.data.houseCut })
    }).catch((err) => {
      console.log("delete error", err);
    })

  };

  const handleChangeEditData = (e) => {
    let { name, value } = e.target;
    setEditData({ ...editData, [name]: +value });
  }

  useEffect(() => {

    function getCutPercentage() {
      axios.get(`${base_url}/api/admin/house-cut`, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header with the token
        }
      }).then((data) => {

        console.log("user data", data);
        setHouseCut(data.data.data.houseCut);
        setEditData({ ...editData, cutPercentage: data.data.data.houseCut })
      }).catch((err) => {
        console.log("delete error", err);
      })
    }
    getCutPercentage();

  }, []);

  return (
    <div className={styles.container}>

      <div className={styles.displaySection}>
        <p className={styles.walletAddress}>Current House Cut: {houseCut}</p>
        <button className={styles.editButton} onClick={handleEditClick}>
          Edit House Cut & Default Min Balance
        </button>
      </div>

      {/* edit */}
      {isEditing && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              &times;
            </button>
            <form className={styles.form}>

              <div className={styles.heading}>
                Change Percentage
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Set Cut Percentage</label>
                <input
                  className={styles.input}
                  type="number"
                  name="cutPercentage"
                  value={editData.cutPercentage}
                  onChange={(e) => handleChangeEditData(e)
                  }

                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Set Default Room Fee</label>
                <input
                  className={styles.input}
                  type="number"
                  name="defaultRoomFee"
                  value={editData.defaultRoomFee}
                  onChange={(e) => handleChangeEditData(e)
                  }
                />
              </div>
              {/* <div className={styles.formGroup}>
                <label className={styles.label}>Set Default Min Balance:</label>
                <input
                  className={styles.input}
                  type="number"
                  name="defaultMinBalance"
                  value={editData.defaultMinBalance}
                  onChange={(e) => handleChangeEditData(e)
                  }
                />
              </div> */}

              <button
                type="button"
                className={styles.button}
                onClick={handleSaveClick}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminHouseCut;
