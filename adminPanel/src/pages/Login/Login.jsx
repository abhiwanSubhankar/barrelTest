import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import styles from "./Login.module.css";
import { base_url } from "../../baseUrl/baseUrl";
import logo from "../../assets/logo.png";
import axios from "axios";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = {
      email,
      password
    }

    try {
      const response = await axios.post(`${base_url}/login`, formData);
      sessionStorage.setItem("token", JSON.stringify(response?.data?.data?.token));
      sessionStorage.setItem("adminEmail", JSON.stringify(response?.data?.data?.email));
      toast.success("Login successful!");
      navigate("/userdata");
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContainerInner}>
        <div className={styles.logoWrapper} >
          <img className={styles.logo} src={logo} alt="logo" />
        </div>
        <h2 className={styles.heading}>WELCOME ADMIN</h2>

        <div className={styles.formOuterDiv}>
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
              <div className={styles.setVisiblity} onClick={() => {
                setShowPassword(!showPassword)
              }} >
                {
                  showPassword ?
                    <VisibilityOffIcon />
                    :
                    <VisibilityIcon />
                }
              </div>
            </div>
            <button type="submit" className={styles.button}>
              Sign Up
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;
