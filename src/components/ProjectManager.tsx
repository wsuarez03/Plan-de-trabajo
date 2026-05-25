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

  projects,
  setProjects,
  editingProject,
  setEditingProject

}: Props)

 {

  const [information, setInformation] =
    useState('');

  const [object, setObject] =
    useState('');

  const [startDate, setStartDate] =
    useState('');

  const [endDate, setEndDate] =
    useState('');

      
      // =========================
      // PALETA ORDENADA
      // =========================
      
      const projectColors = [
      
        '#2563eb', // azul
        '#dc2626', // rojo
        '#16a34a', // verde
        '#9333ea', // morado
        '#ea580c', // naranja
        '#0891b2', // cyan
        '#be123c', // rosado
        '#65a30d', // lima
        '#7c3aed', // violeta
        '#0f766e', // teal
        '#c2410c', // naranja oscuro
        '#1d4ed8', // azul fuerte
        '#15803d', // verde oscuro
        '#b91c1c', // rojo oscuro
        '#7e22ce', // púrpura
        '#0369a1'  // azul petróleo
      ];
      
      // =========================
      // COLOR AUTOMÁTICO ORDENADO
      // =========================
      
      const getNextColor = () => {
      
        return projectColors[
          projects.length %
          projectColors.length
        ];
      };
      
      const [color, setColor] =
        useState(getNextColor());
      

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
        getNextColor()
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
      const oldStart = editingProject.startDate;

    const oldEnd = editingProject.endDate;
    
    const datesChanged =
    
      oldStart !== startDate ||
    
      oldEnd !== endDate;

      const updatedProject = {

        information,

        object,

        startDate,

        endDate,

        color
      };
      await supabase
      .from('projects')

      if (datesChanged) {

  const { data: existingAssignments } =
    await supabase

      .from('assignments')

      .select('*')

      .eq(
        'projectId',
        editingProject.id
      );

  if (existingAssignments) {

    const validAssignments =
      existingAssignments.filter(a =>

        a.date >= startDate &&

        a.date <= endDate
      );

    const invalidAssignments =
      existingAssignments.filter(a =>

        a.date < startDate ||

        a.date > endDate
      );

    if (invalidAssignments.length > 0) {

      const invalidIds =
        invalidAssignments.map(
          a => a.id
        );

      await supabase

        .from('assignments')

        .delete()

        .in('id', invalidIds);
    }

    setAssignments(validAssignments);
  }
}

      const oldStart = editingProject.startDate;
      const oldEnd = editingProject.endDate;
      
      const datesChanged =
        oldStart !== startDate ||
        oldEnd !== endDate;
      
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

      if (datesChanged) {

  const { data: existingAssignments } =
    await supabase
      .from('assignments')
      .select('*')
      .eq('projectId', editingProject.id);

  if (existingAssignments) {

    const validAssignments =
      existingAssignments.filter(a =>
        a.date >= startDate &&
        a.date <= endDate
      );
    const invalidAssignments =
      existingAssignments.filter(a =>
        a.date < startDate ||
        a.date > endDate
      );

    if (invalidAssignments.length > 0) {

      const invalidIds =
        invalidAssignments.map(a => a.id);

      await supabase
        .from('assignments')
        .delete()
        .in('id', invalidIds);
    }

    setAssignments(validAssignments);
  }
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
    setColor(getNextColor());
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
