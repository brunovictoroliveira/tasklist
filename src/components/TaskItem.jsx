import styles from "../styles/TaskItem.module.css";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";

import DeleteConfirmation from "./DeleteConfirmation";
import deleteIcon from "../icons/delete.svg";
import editIcon from "../icons/edit.svg";

const formatCurrency = (value = 0) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return day + "/" + month + "/" + year;
};

const TaskItem = ({ task, onEdit, onDelete, onMoveUp, onMoveDown }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const taskCost = Number(task.cost);
  const hasCost = Number.isFinite(taskCost) && taskCost > 0;
  const hasDueDate = Boolean(task.dueDate);
  const isHighCost = hasCost && taskCost >= 1000;

  const {
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

  const stopDragStart = (event) => {
    event.stopPropagation();
  };

  return (
    <article
      ref={setNodeRef}
      className={styles.item + (isHighCost ? " " + styles.highCost : "") + (isDragging ? " " + styles.dragging : "")}
      style={itemStyle}
      aria-label={"Reordenar " + task.title}
      {...listeners}
    >
      <div className={styles.content}>
        <div className={styles.topLine}>
          <h3>{task.title}</h3>
          <span className={styles.taskId}>#{task.id}</span>
        </div>
        {(hasCost || hasDueDate) && (
          <div className={styles.details}>
            {hasCost && <span>{formatCurrency(taskCost)}</span>}
            {hasDueDate && <span>{formatDate(task.dueDate)}</span>}
          </div>
        )}
      </div>

      <div className={styles.buttons} aria-label="Ações da task" onPointerDown={stopDragStart}>
        <button className={styles.iconButton} type="button" onClick={onEdit} aria-label="Editar task" title="Editar">
          <img src={editIcon} alt="" aria-hidden="true" />
        </button>
        <button
          className={styles.iconButton + " " + styles.dangerButton}
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          aria-label="Excluir task"
          title="Excluir"
        >
          <img src={deleteIcon} alt="" aria-hidden="true" />
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
    dueDate: PropTypes.string,
    position: PropTypes.number.isRequired,
    projectId: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
};

export default TaskItem;
