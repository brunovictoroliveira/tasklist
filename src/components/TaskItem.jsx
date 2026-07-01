import styles from "../styles/TaskItem.module.css";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";

import DeleteConfirmation from "./DeleteConfirmation";

const formatCurrency = (value = 0) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const TaskItem = ({ task, onEdit, onDelete, onMoveUp, onMoveDown }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isHighCost = task.cost >= 1000;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const confirmDelete = () => {
    onDelete();
    setIsDeleteModalOpen(false);
  };

  return (
    <article
      ref={setNodeRef}
      className={`${styles.item} ${isHighCost ? styles.highCost : ""} ${
        isDragging ? styles.dragging : ""
      }`}
      style={itemStyle}
    >
      <button
        className={styles.dragHandle}
        type="button"
        aria-label={`Reordenar ${task.title}`}
        {...attributes}
        {...listeners}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={styles.content}>
        <div className={styles.topLine}>
          <h3>{task.title}</h3>
          <span className={styles.taskId}>#{task.id}</span>
        </div>
        <div className={styles.details}>
          <span>{formatCurrency(task.cost)}</span>
          <span>{formatDate(task.dueDate)}</span>
        </div>
      </div>

      <div className={styles.buttons} aria-label="Ações da task">
        <button className={styles.iconButton} type="button" onClick={onEdit} aria-label="Editar task">
          Editar
        </button>
        <button
          className={`${styles.iconButton} ${styles.dangerButton}`}
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          aria-label="Excluir task"
        >
          Excluir
        </button>
        <button className={styles.orderButton} type="button" onClick={onMoveUp} aria-label="Mover task para cima">
          ↑
        </button>
        <button className={styles.orderButton} type="button" onClick={onMoveDown} aria-label="Mover task para baixo">
          ↓
        </button>
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        onDelete={confirmDelete}
      />
    </article>
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    cost: PropTypes.number,
    dueDate: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
    projectId: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
};

export default TaskItem;
