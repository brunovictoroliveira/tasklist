import styles from "../styles/TaskList.module.css";

import { useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import PropTypes from "prop-types";

import AddTaskForm from "./AddTaskForm";
import EditTaskForm from "./EditTaskForm";
import ProjectColumn from "./ProjectColumn";

const sortByPosition = (items) =>
  [...items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

const TaskList = ({
  projects,
  tasks,
  expandedProjects,
  isLoading,
  addTask,
  updateTask,
  deleteTask,
  moveTaskUp,
  moveTaskDown,
  reorderTasks,
  toggleProject,
}) => {
  const [taskProject, setTaskProject] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const openAddTaskModal = (project) => {
    setTaskProject(project);
  };

  const closeAddTaskModal = () => {
    setTaskProject(null);
  };

  const closeEditModal = () => {
    setTaskToEdit(null);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    const overTask = tasks.find((task) => task.id === over.id);

    if (!activeTask || !overTask || activeTask.projectId !== overTask.projectId) return;

    reorderTasks(activeTask.projectId, activeTask.id, overTask.id);
  };

  if (isLoading) {
    return <div className={styles.emptyState}>Carregando board...</div>;
  }

  if (projects.length === 0) {
    return <div className={styles.emptyState}>Crie seu primeiro projeto para começar.</div>;
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <section className={styles.board} aria-label="Board de projetos">
          {projects.map((project) => {
            const projectTasks = sortByPosition(
              tasks.filter((task) => task.projectId === project.id)
            );

            return (
              <ProjectColumn
                key={project.id}
                project={project}
                tasks={projectTasks}
                isExpanded={Boolean(expandedProjects[project.id])}
                onToggle={() => toggleProject(project.id)}
                onAddTask={() => openAddTaskModal(project)}
                onEditTask={setTaskToEdit}
                onDeleteTask={deleteTask}
                onMoveTaskUp={(taskId) => moveTaskUp(project.id, taskId)}
                onMoveTaskDown={(taskId) => moveTaskDown(project.id, taskId)}
              />
            );
          })}
        </section>
      </DndContext>

      <AddTaskForm
        isOpen={Boolean(taskProject)}
        onRequestClose={closeAddTaskModal}
        addTask={addTask}
        project={taskProject}
      />

      {taskToEdit && (
        <EditTaskForm
          isOpen={Boolean(taskToEdit)}
          onRequestClose={closeEditModal}
          task={taskToEdit}
          updateTask={updateTask}
        />
      )}
    </>
  );
};

TaskList.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      position: PropTypes.number.isRequired,
      taskCount: PropTypes.number.isRequired,
    })
  ).isRequired,
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
  expandedProjects: PropTypes.objectOf(PropTypes.bool).isRequired,
  isLoading: PropTypes.bool.isRequired,
  addTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  moveTaskUp: PropTypes.func.isRequired,
  moveTaskDown: PropTypes.func.isRequired,
  reorderTasks: PropTypes.func.isRequired,
  toggleProject: PropTypes.func.isRequired,
};

export default TaskList;
