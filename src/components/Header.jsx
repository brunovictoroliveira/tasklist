import styles from "../styles/Header.module.css";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Logo />
        <h1>Projetos</h1>
      </div>
    </header>
  );
};

export default Header;
