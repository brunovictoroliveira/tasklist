import styles from "../styles/EditTaskForm.module.css";

import { useEffect, useState } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

import Button from "./Button";

Modal.setAppElement("#root");

const EditTaskForm = ({ isOpen, onRequestClose, updateTask, task }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [cost, setCost] = useState(task?.cost ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setCost(task.cost ?? "");
      setDueDate(task.dueDate ?? "");
    }
  }, [task]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const parsedCost = cost === "" ? null : Math.round(parseFloat(cost) * 100) / 100;
    const wasUpdated = await updateTask({
      ...task,
      title: title.trim(),
      cost: parsedCost,
      dueDate: dueDate || "",
    });

    if (wasUpdated) onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Editar task"
      overlayClassName={styles.overlay}
      className={styles.modal}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <span>Editar task</span>
          <h2>{task.title}</h2>
        </div>

        <label htmlFor="edit-task-title">Task</label>
        <input
          id="edit-task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <label htmlFor="edit-task-cost">Custo (R$)</label>
        <input
          id="edit-task-cost"
          type="number"
          step="0.01"
          min="0"
          value={cost}
          onChange={(event) => setCost(event.target.value)}
        />

        <label htmlFor="edit-task-due-date">Data limite</label>
        <input
          id="edit-task-due-date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />

        <div className={styles.buttons}>
          <Button name="Atualizar" type="submit" />
          <Button name="Cancelar" type="cancel" onClick={onRequestClose} />
        </div>
      </form>
    </Modal>
  );
};

EditTaskForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
    projectId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    cost: PropTypes.number,
    dueDate: PropTypes.string,
  }).isRequired,
};

export default EditTaskForm;
