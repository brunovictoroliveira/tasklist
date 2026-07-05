import styles from "../styles/ProjectForm.module.css";

import { useEffect, useState } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

import Button from "./Button";

Modal.setAppElement("#root");

const colorOptions = ["#00e5ff", "#4cff9b", "#ff7f5c", "#ff006e", "#c150ff"];

const ProjectForm = ({ isOpen, onRequestClose, addProject, updateProject, project = null }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState(colorOptions[0]);
  const isEditing = Boolean(project);

  useEffect(() => {
    if (!isOpen) return;

    setName(project?.name ?? "");
    setColor(project?.color ?? colorOptions[0]);
  }, [isOpen, project]);

  const resetForm = () => {
    setName("");
    setColor(colorOptions[0]);
  };

  const handleClose = () => {
    resetForm();
    onRequestClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const projectData = { name: name.trim(), color };
    const wasSaved = isEditing
      ? await updateProject({ ...project, ...projectData })
      : await addProject(projectData);

    if (!wasSaved) return;

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel={isEditing ? "Editar projeto" : "Criar projeto"}
      overlayClassName={styles.overlay}
      className={styles.modal}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <span>{isEditing ? "Editar projeto" : "Novo projeto"}</span>
          <h2>{isEditing ? project.name : "Crie uma coluna"}</h2>
        </div>

        <label htmlFor="project-name">Nome do projeto</label>
        <input
          id="project-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder="Ex: Agenda app"
        />

        <fieldset className={styles.colors}>
          <legend>Cor de destaque</legend>
          <div className={styles.swatches}>
            {colorOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`${styles.swatch} ${color === option ? styles.selected : ""}`}
                style={{ backgroundColor: option }}
                onClick={() => setColor(option)}
                aria-label={`Usar cor ${option}`}
              />
            ))}
          </div>
        </fieldset>

        <div className={styles.buttons}>
          <Button name={isEditing ? "Atualizar projeto" : "Criar projeto"} type="submit" />
          <Button name="Cancelar" type="cancel" onClick={handleClose} />
        </div>
      </form>
    </Modal>
  );
};

ProjectForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  addProject: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
  }),
};


export default ProjectForm;
