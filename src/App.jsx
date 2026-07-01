import styles from "./App.module.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import api from "./api/api";

import Header from "./components/Header";
import TaskList from "./components/TaskList";
import Button from "./components/Button";
import ProjectForm from "./components/ProjectForm";

const sortByPosition = (items) =>
  [...items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

const getNextId = (items) =>
  String(items.length > 0 ? Math.max(...items.map((item) => Number(item.id))) + 1 : 1);

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, tasksResponse] = await Promise.all([
          api.get("/projects"),
          api.get("/tasks"),
        ]);

        setProjects(sortByPosition(projectsResponse.data));
        setTasks(sortByPosition(tasksResponse.data));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const projectsWithTaskCount = useMemo(
    () =>
      sortByPosition(projects).map((project) => ({
        ...project,
        taskCount: tasks.filter((task) => task.projectId === project.id).length,
      })),
    [projects, tasks]
  );

  const persistTaskOrder = useCallback(async (orderedTasks) => {
    const normalizedTasks = orderedTasks.map((task, index) => ({
      ...task,
      position: index + 1,
    }));

    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        const updatedTask = normalizedTasks.find((item) => item.id === task.id);
        return updatedTask ?? task;
      })
    );

    await Promise.all(
      normalizedTasks.map((task) => api.put(`/tasks/${task.id}`, task))
    );
  }, []);

  const addProject = useCallback(
    async (newProject) => {
      try {
        const isDuplicate = projects.some(
          (project) => project.name.toLowerCase() === newProject.name.toLowerCase()
        );

        if (isDuplicate) {
          alert("Já existe um projeto com este nome.");
          return false;
        }

        const project = {
          ...newProject,
          id: getNextId(projects),
          position:
            projects.length > 0
              ? Math.max(...projects.map((project) => project.position ?? 0)) + 1
              : 1,
        };

        const response = await api.post("/projects", project);
        setProjects((currentProjects) => sortByPosition([...currentProjects, response.data]));
        return true;
      } catch (error) {
        console.error("Erro ao adicionar projeto:", error);
        return false;
      }
    },
    [projects]
  );

  const addTask = useCallback(
    async (newTask) => {
      try {
        const projectTasks = tasks.filter((task) => task.projectId === newTask.projectId);
        const isDuplicate = projectTasks.some(
          (task) => task.title.toLowerCase() === newTask.title.toLowerCase()
        );

        if (isDuplicate) {
          alert("Já existe uma task com este nome neste projeto.");
          return false;
        }

        const task = {
          ...newTask,
          id: getNextId(tasks),
          position:
            projectTasks.length > 0
              ? Math.max(...projectTasks.map((task) => task.position ?? 0)) + 1
              : 1,
        };

        const response = await api.post("/tasks", task);
        setTasks((currentTasks) => sortByPosition([...currentTasks, response.data]));
        return true;
      } catch (error) {
        console.error("Erro ao adicionar task:", error);
        return false;
      }
    },
    [tasks]
  );

  const updateTask = useCallback(
    async (updatedTask) => {
      try {
        const isDuplicate = tasks.some(
          (task) =>
            task.projectId === updatedTask.projectId &&
            task.id !== updatedTask.id &&
            task.title.toLowerCase() === updatedTask.title.toLowerCase()
        );

        if (isDuplicate) {
          alert("Já existe uma task com este nome neste projeto.");
          return false;
        }

        const response = await api.put(`/tasks/${updatedTask.id}`, updatedTask);
        setTasks((currentTasks) =>
          currentTasks.map((task) => (task.id === response.data.id ? response.data : task))
        );
        return true;
      } catch (error) {
        console.error("Erro ao atualizar task:", error);
        return false;
      }
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      try {
        const taskToDelete = tasks.find((task) => task.id === taskId);
        if (!taskToDelete) return;

        await api.delete(`/tasks/${taskId}`);

        const remainingProjectTasks = sortByPosition(
          tasks.filter(
            (task) => task.projectId === taskToDelete.projectId && task.id !== taskId
          )
        );

        const normalizedTasks = remainingProjectTasks.map((task, index) => ({
          ...task,
          position: index + 1,
        }));

        setTasks((currentTasks) =>
          currentTasks
            .filter((task) => task.id !== taskId)
            .map((task) => {
              const updatedTask = normalizedTasks.find((item) => item.id === task.id);
              return updatedTask ?? task;
            })
        );

        await Promise.all(
          normalizedTasks.map((task) => api.put(`/tasks/${task.id}`, task))
        );
      } catch (error) {
        console.error("Erro ao excluir task:", error);
      }
    },
    [tasks]
  );

  const reorderTasks = useCallback(
    async (projectId, activeTaskId, overTaskId) => {
      if (!overTaskId || activeTaskId === overTaskId) return;

      const projectTasks = sortByPosition(tasks.filter((task) => task.projectId === projectId));
      const oldIndex = projectTasks.findIndex((task) => task.id === activeTaskId);
      const newIndex = projectTasks.findIndex((task) => task.id === overTaskId);

      if (oldIndex === -1 || newIndex === -1) return;

      await persistTaskOrder(arrayMove(projectTasks, oldIndex, newIndex));
    },
    [persistTaskOrder, tasks]
  );

  const moveTaskUp = useCallback(
    async (projectId, taskId) => {
      const projectTasks = sortByPosition(tasks.filter((task) => task.projectId === projectId));
      const taskIndex = projectTasks.findIndex((task) => task.id === taskId);
      if (taskIndex <= 0) return;

      await persistTaskOrder(arrayMove(projectTasks, taskIndex, taskIndex - 1));
    },
    [persistTaskOrder, tasks]
  );

  const moveTaskDown = useCallback(
    async (projectId, taskId) => {
      const projectTasks = sortByPosition(tasks.filter((task) => task.projectId === projectId));
      const taskIndex = projectTasks.findIndex((task) => task.id === taskId);
      if (taskIndex === -1 || taskIndex >= projectTasks.length - 1) return;

      await persistTaskOrder(arrayMove(projectTasks, taskIndex, taskIndex + 1));
    },
    [persistTaskOrder, tasks]
  );

  const toggleProject = (projectId) => {
    setExpandedProjects((currentState) => ({
      ...currentState,
      [projectId]: !currentState[projectId],
    }));
  };

  return (
    <main className={styles.container}>
      <Header />

      <section className={styles.toolbar} aria-label="Ações do board">
        <div>
          <p className={styles.kicker}>Projetos ativos</p>
          <span className={styles.counter}>
            {projects.length} projetos · {tasks.length} tasks
          </span>
        </div>
        <Button name="Novo projeto" type="submit" onClick={() => setIsProjectModalOpen(true)} />
      </section>

      <TaskList
        projects={projectsWithTaskCount}
        tasks={tasks}
        expandedProjects={expandedProjects}
        isLoading={isLoading}
        addTask={addTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
        moveTaskUp={moveTaskUp}
        moveTaskDown={moveTaskDown}
        reorderTasks={reorderTasks}
        toggleProject={toggleProject}
      />

      <ProjectForm
        isOpen={isProjectModalOpen}
        onRequestClose={() => setIsProjectModalOpen(false)}
        addProject={addProject}
      />
    </main>
  );
}

export default App;




