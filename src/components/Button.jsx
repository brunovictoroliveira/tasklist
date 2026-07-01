import styles from "../styles/Button.module.css";
import PropTypes from "prop-types";

const Button = ({ name, type, onClick }) => {
  const variantClass = type === "submit" ? styles.submit : styles.cancel;

  return (
    <button
      className={`${styles.button} ${variantClass}`}
      type={type === "submit" ? "submit" : "button"}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

Button.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["submit", "cancel"]).isRequired,
  onClick: PropTypes.func,
};

export default Button;
