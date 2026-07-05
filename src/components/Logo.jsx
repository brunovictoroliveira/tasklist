import styles from "../styles/Logo.module.css";
import logoTasklist from "../icons/logo-tasklist.svg";

const Logo = () => {
  return <img className={styles.logo} src={logoTasklist} alt="Tasklist" />;
};

export default Logo;
