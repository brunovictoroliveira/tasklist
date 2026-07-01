import styles from "../styles/AddTaskForm.module.css";

import { useEffect, useState } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

import Button from "./Button";

Modal.setAppElement("#root");

const AddTaskForm = ({ isOpen, onRequestClose, addTask, project }) => {
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setCost("");
      setDueDate("");
    }
  }, [isOpen]);

  const handleCostChange = (event) => {
    const value = event.target.value.replace(",", ".");

    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      setCost(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!project) return;

    const floatCost = Math.round(parseFloat(cost) * 100) / 100;
    const wasCreated = await addTask({
      title: title.trim(),
      cost: floatCost,
      dueDate,
      projectId: project.id,
    });

    if (wasCreated) onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Adicionar task"
      overlayClassName={styles.overlay}
      className={styles.modal}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <span>Nova task</span>
          <h2>{project ? project.name : "Projeto"}</h2>
        </div>

        <label htmlFor="task-title">Task</label>
        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          placeholder="Digite a task"
        />

        <label htmlFor="task-cost">Custo (R$)</label>
        <input
          id="task-cost"
          type="text"
          value={cost}
          onChange={handleCostChange}
          required
          placeholder="Digite apenas o valor"
        />

        <label htmlFor="task-due-date">Data limite</label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          required
        />

        <div className={styles.buttons}>
          <Button name="Adicionar" type="submit" />
          <Button name="Cancelar" type="cancel" onClick={onRequestClose} />
        </div>
      </form>
    </Modal>
  );
};

AddTaskForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  addTask: PropTypes.func.isRequired,
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default AddTaskForm;
