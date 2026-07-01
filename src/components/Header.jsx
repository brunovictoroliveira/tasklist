import styles from "../styles/Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo} aria-hidden="true">
        TL
      </div>
      <div>
        <p>TaskList</p>
        <h1>Board de projetos</h1>
      </div>
    </header>
  );
};

export default Header;
