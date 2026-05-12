import { useEffect, useState } from 'react';
import { Project, Assignment } from '../types';
import { supabase } from '../lib/supabase';

interface Props {
  projects: Project[];

  setProjects: React.Dispatch<
    React.SetStateAction<Project[]>
  >;

  setAssignments: React.Dispatch<
    React.SetStateAction<Assignment[]>
  >;

  editingProject: Project | null;

  setEditingProject: React.Dispatch<
    React.SetStateAction<Project | null>
  >;
}

export default function ProjectManager({

  setProjects,
  editingProject,
  setEditingProject

}: Props) {

  const [information, setInformation] =
    useState('');

  const [object, setObject] =
    useState('');

  const [startDate, setStartDate] =
    useState('');

  const [endDate, setEndDate] =
    useState('');

  // =========================
  // GENERAR COLOR ALEATORIO
  // =========================

  const generateRandomColor = () => {

    const colors = [

      '#2563eb',
      '#dc2626',
      '#16a34a',
      '#9333ea',
      '#ea580c',
      '#0891b2',
      '#be123c',
      '#65a30d',
      '#7c3aed',
      '#0f766e',
      '#c2410c',
      '#1d4ed8',
      '#15803d',
      '#b91c1c',
      '#7e22ce',
      '#0369a1'
    ];

    return colors[
      Math.floor(
        Math.random() * colors.length
      )
    ];
  };

  const [color, setColor] =
    useState(generateRandomColor());

  // =========================
  // CARGAR DATOS AL EDITAR
  // =========================

  useEffect(() => {

    if (editingProject) {

      setInformation(
        editingProject.information
      );

      setObject(
        editingProject.object || ''
      );

      setStartDate(
        editingProject.startDate
      );

      setEndDate(
        editingProject.endDate
      );

      setColor(
        editingProject.color ||
        generateRandomColor()
      );
    }

  }, [editingProject]);

  // =========================
  // GUARDAR PROYECTO
  // =========================

  const saveProject = async () => {

    if (
      !information ||
      !object ||
      !startDate ||
      !endDate
    ) {
      return;
    }

    // =====================
    // EDITAR
    // =====================

    if (editingProject) {

      const updatedProject = {

        information,

        object,

        startDate,

        endDate,

        color
      };

      const { error } = await supabase

        .from('projects')

        .update(updatedProject)

        .eq('id', editingProject.id);

      if (error) {

        console.error(error);

        return;
      }

      setProjects(prev =>

        prev.map(project =>

          project.id === editingProject.id

            ? {
                ...project,
                ...updatedProject
              }

            : project
        )
      );

      setEditingProject(null);

    }

    // =====================
    // CREAR
    // =====================

    else {

      const newProject = {

        information,

        object,

        startDate,

        endDate,

        color
      };

      const { data, error } = await supabase

        .from('projects')

        .insert([newProject])

        .select()

        .single();

      if (error) {

        console.error(error);

        return;
      }

      if (!data) {
        return;
      }

      setProjects(prev => [

        ...prev,

        data as Project
      ]);
    }

    // =====================
    // LIMPIAR FORMULARIO
    // =====================

    setInformation('');

    setObject('');

    setStartDate('');

    setEndDate('');

    // nuevo color automático
    setColor(generateRandomColor());
  };

  return (

    <div className="card">

      <h2>

        {editingProject

          ? '✏️ Editar Proyecto'

          : '📁 Gestión de Proyectos'}

      </h2>

      <div className="form-grid">

        {/* CLIENTE */}

        <input

          type="text"

          placeholder="Cliente"

          value={information}

          onChange={e =>
            setInformation(
              e.target.value
            )
          }
        />

        {/* OBJETO */}

        <input

          type="text"

          placeholder="Objeto"

          value={object}

          onChange={e =>
            setObject(
              e.target.value
            )
          }
        />

      </div>
      <div className="form-grid">
        {/* FECHA INICIO */}

        <input

          type="date"

          value={startDate}

          onChange={e =>
            setStartDate(
              e.target.value
            )
          }
        />

        {/* FECHA FIN */}

        <input

          type="date"

          value={endDate}

          onChange={e =>
            setEndDate(
              e.target.value
            )
          }
        />

       
        { /* BOTÓN */}

        <button onClick={saveProject}>

          {editingProject

            ? 'Actualizar'

            : 'Crear'}

        </button>

      </div>

    </div>
  );
}