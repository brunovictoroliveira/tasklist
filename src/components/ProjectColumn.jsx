import styles from "../styles/ProjectColumn.module.css";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import PropTypes from "prop-types";

import TaskItem from "./TaskItem";

const COLLAPSED_TASK_LIMIT = 3;

const ProjectColumn = ({
  project,
  tasks,
  isExpanded,
  onToggle,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTaskUp,
  onMoveTaskDown,
}) => {
  const visibleTasks = isExpanded ? tasks : tasks.slice(0, COLLAPSED_TASK_LIMIT);
  const hiddenTaskCount = Math.max(tasks.length - COLLAPSED_TASK_LIMIT, 0);
  const shouldShowToggle = tasks.length > COLLAPSED_TASK_LIMIT;

  return (
    <article className={styles.column} style={{ "--project-color": project.color }}>
      <header className={styles.header}>
        <div>
          <span className={styles.projectLabel}>Projeto</span>
          <h2>{project.name}</h2>
        </div>
        <span className={styles.count}>{project.taskCount}</span>
      </header>

      <div className={styles.actions}>
        <button className={styles.addButton} type="button" onClick={onAddTask}>
          + Task
        </button>
        {shouldShowToggle && (
          <button className={styles.toggleButton} type="button" onClick={onToggle}>
            {isExpanded ? "Recolher" : `Expandir +${hiddenTaskCount}`}
          </button>
        )}
      </div>

      <SortableContext items={visibleTasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className={styles.stack}>
          {visibleTasks.length > 0 ? (
            visibleTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
                onMoveUp={() => onMoveTaskUp(task.id)}
                onMoveDown={() => onMoveTaskDown(task.id)}
              />
            ))
          ) : (
            <p className={styles.empty}>Nenhuma task neste projeto.</p>
          )}
        </div>
      </SortableContext>
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
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onMoveTaskUp: PropTypes.func.isRequired,
  onMoveTaskDown: PropTypes.func.isRequired,
};

export default ProjectColumn;
