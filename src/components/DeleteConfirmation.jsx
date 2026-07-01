import styles from "../styles/DeleteConfirmation.module.css";

import Modal from "react-modal";
import PropTypes from "prop-types";

import Button from "./Button";

Modal.setAppElement("#root");

const DeleteConfirmation = ({ isOpen, onRequestClose, onDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirmação de exclusão"
      overlayClassName={styles.overlay}
      className={styles.modal}
    >
      <div className={styles.container}>
        <span>Excluir task</span>
        <h2>Confirma a exclusão?</h2>
        <p>Esta ação não pode ser desfeita.</p>
        <div className={styles.buttons}>
          <Button name="Confirmar" type="submit" onClick={onDelete} />
          <Button name="Cancelar" type="cancel" onClick={onRequestClose} />
        </div>
      </div>
    </Modal>
  );
};

DeleteConfirmation.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteConfirmation;
