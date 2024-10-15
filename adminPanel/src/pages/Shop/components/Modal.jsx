import { useState } from "react";
import styles from "./Modal.module.css";
import axios from "axios";
import { base_url } from "../../../baseUrl/baseUrl.js";
import { toast } from "react-toastify";

const Modal = ({ showModal, closeModal, modalType = "Modaltype", userdata }) => {

  console.log("data", userdata);
  const token = JSON.parse(sessionStorage.getItem("token"));

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

  const updateToken = (data) => {
    console.log("updated token data", data);

    axios.put(`${base_url}/api/admin/shop/${userdata?._id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'// Set the Authorization header with the token
      }
    }).then((data) => {

      console.log("user data", data);
      toast.success("Token Updated successfullly!");
      closeModal();
    }).catch((err) => {
      console.log("update error", err);
    })
  };



  const deleteToken = (data) => {
    axios.delete(`${base_url}/api/admin/shop/${data?._id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // Set the Authorization header with the token
      }
    }).then((data) => {

      console.log("user data", data);
      toast.success("Token Deleted successfullly!");
      closeModal();
    }).catch((err) => {
      console.log("delete error", err);
    })
  }

  const handleCloseModal = () => {
    closeModal();
  };

  const createToken = (data) => {
    axios.post(`${base_url}/api/admin/shop`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}` // Set the Authorization header with the token
      }
    }).then((data) => {
      console.log("user data", data);
      toast.success("Token Added successful!");
      closeModal();
    }).catch((err) => {
      console.log("update error", err);
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('description', formData.description);

    // Append the image file
    if (formData.image) {
      data.append('image', formData.image);
    }

    if (modalType === "create") {
      createToken(data)
    } else {
      updateToken(data)
    }



  };



  if (!showModal) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>{modalType === "create" ? "Create a new Token" : "Update Token"}</h2>

        <button className={styles.closeButton} onClick={handleCloseModal}>
          &times;
        </button>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="name">Name:</label>
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

          <div>
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
          </div>

          <div>
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="troopers">Troopers</option>
              <option value="dice">Dice</option>
            </select>
          </div>

          <div>
            <label htmlFor="stock">Stock:</label>
            <input
              className={styles.input}
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="image">Image:</label>
            <input
              className={styles.input}
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
            // required
            />
          </div>

          {/* submit */}
          {modalType === "create" ?
            <div className={styles.btnOuterDiv}>
              <button className={styles.button} type="submit">
                Create
              </button>
            </div>
            :
            <div className={styles.btnOuterDivI}>
              <button className={styles.button} onClick={() => deleteToken(userdata)}>
                Delete
              </button>

              <button className={styles.button} type="submit" >
                Update
              </button>

            </div>}
        </form>

      </div>
    </div>
  );
};

export default Modal;
