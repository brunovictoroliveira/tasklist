import styles from "../styles/ProjectColumn.module.css";

import { useState } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import PropTypes from "prop-types";

import DeleteConfirmation from "./DeleteConfirmation";
import TaskItem from "./TaskItem";
import deleteIcon from "../icons/delete.svg";
import editIcon from "../icons/edit.svg";

const ProjectColumn = ({
  project,
  tasks,
  isExpanded,
  onToggle,
  onAddTask,
  onDeleteProject,
  onEditProject,
  onEditTask,
  onDeleteTask,
  onMoveTaskUp,
  onMoveTaskDown,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const hasTasks = tasks.length > 0;
  const taskLabel = tasks.length === 1 ? "task vinculada" : "tasks vinculadas";
  const deleteMessage = hasTasks
    ? "Isto removerá o projeto e " + tasks.length + " " + taskLabel + ". Esta ação não pode ser desfeita."
    : "Isto removerá o projeto vazio. Esta ação não pode ser desfeita.";

  const confirmDeleteProject = () => {
    onDeleteProject(project.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <article
      className={styles.column + (!isExpanded ? " " + styles.collapsed : "")}
      style={{ "--project-color": project.color }}
    >
      <header className={styles.header}>
        <div>
          <span className={styles.projectLabel}>Projeto</span>
          <h2>{project.name}</h2>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.count}>{project.taskCount}</span>
          <button
            className={styles.editButton}
            type="button"
            onClick={onEditProject}
            aria-label={"Editar projeto " + project.name}
            title="Editar projeto"
          >
            <img src={editIcon} alt="" aria-hidden="true" />
          </button>
          <button
            className={styles.deleteButton}
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            aria-label={"Excluir projeto " + project.name}
            title="Excluir projeto"
          >
            <img src={deleteIcon} alt="" aria-hidden="true" />
          </button>
        </div>
      </header>

      {!isExpanded && (
        <div className={styles.summary} aria-label={hasTasks ? tasks.length + " tasks recolhidas" : "Projeto sem tasks"}>
          <span className={styles.statusDot} />
          <span>{hasTasks ? tasks.length + " " + taskLabel : "Sem tasks"}</span>
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.addButton} type="button" onClick={onAddTask}>
          + Task
        </button>
        {hasTasks && (
          <button
            className={styles.toggleButton}
            type="button"
            onClick={onToggle}
            aria-label={isExpanded ? "Recolher tasks" : "Expandir tasks"}
            title={isExpanded ? "Recolher tasks" : "Expandir tasks"}
          >
            {isExpanded ? "↑" : "↓"}
          </button>
        )}
      </div>

      {isExpanded && (
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          <div className={styles.stack}>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
                onMoveUp={() => onMoveTaskUp(task.id)}
                onMoveDown={() => onMoveTaskDown(task.id)}
              />
            ))}
          </div>
        </SortableContext>
      )}

      {isExpanded && !hasTasks && <p className={styles.empty}>Nenhuma task neste projeto.</p>}

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        onDelete={confirmDeleteProject}
        eyebrow="Excluir projeto"
        title={"Excluir " + project.name + "?"}
        message={deleteMessage}
      />
    </article>
  );
};

ProjectColumn.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
    taskCount: PropTypes.number.isRequired,
  }).isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      cost: PropTypes.number,
      dueDate: PropTypes.string.isRequired,
      position: PropTypes.number.isRequired,
      projectId: PropTypes.string.isRequired,
    })
  ).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired,
  onDeleteProject: PropTypes.func.isRequired,
  onEditProject: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onMoveTaskUp: PropTypes.func.isRequired,
  onMoveTaskDown: PropTypes.func.isRequired,
};

export default ProjectColumn;
