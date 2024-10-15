import styles from "./button.module.css";

function Button({ type="button", text, handleClick = () => {} ,className ="" }) {
  return (
    <button type={type} onClick={handleClick} className={styles.base}>
       <span>{text}</span>
    </button>
  );
}

export default Button;
