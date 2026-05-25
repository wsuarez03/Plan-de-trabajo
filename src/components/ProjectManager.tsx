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
  setAssignments,
  editingProject,
  setEditingProject

}: Props) {

  const [
    information,
    setInformation
  ] = useState('');

  const [
    object,
    setObject
  ] = useState('');

  const [
    startDate,
    setStartDate
  ] = useState('');

  const [
    endDate,
    setEndDate
  ] = useState('');

  // =========================
  // PALETA ORDENADA
  // =========================

  const projectColors = [

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

  // =========================
  // COLOR AUTOMÁTICO
  // =========================

  const getNextColor = () => {

    return projectColors[
      projects.length %
      projectColors.length
    ];
  };

  const [
    color,
    setColor
  ] = useState(getNextColor());

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

      alert(
        'Completa todos los campos'
      );

      return;
    }

    // VALIDAR FECHAS

    if (startDate > endDate) {

      alert(
        'La fecha inicio no puede ser mayor a la fecha fin'
      );

      return;
    }

    // =====================
    // EDITAR
    // =====================

    if (editingProject) {

      // =====================
      // VALIDAR CAMBIO FECHAS
      // =====================

      const oldStart =
        editingProject.startDate;

      const oldEnd =
        editingProject.endDate;

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

      // =====================
      // ACTUALIZAR PROYECTO
      // =====================

      const { error } =
        await supabase

          .from('projects')

          .update(updatedProject)

          .eq(
            'id',
            editingProject.id
          );

      if (error) {

        console.error(error);

        alert(
          'Error actualizando proyecto'
        );

        return;
      }

      // =====================
      // ACTUALIZAR ESTADO LOCAL
      // =====================

      setProjects(prev =>

        prev.map(project =>

          project.id ===
          editingProject.id

            ? {
                ...project,
                ...updatedProject
              }

            : project
        )
      );

      // =====================
      // ACTUALIZAR ASIGNACIONES
      // =====================

      if (datesChanged) {

        const {
          data: existingAssignments
        } = await supabase

          .from('assignments')

          .select('*')

          .eq(
            'projectId',
            editingProject.id
          );

        if (existingAssignments) {

          const validAssignments =

            existingAssignments.filter(
              a =>

                a.date >= startDate &&

                a.date <= endDate
            );

          const invalidAssignments =

            existingAssignments.filter(
              a =>

                a.date < startDate ||

                a.date > endDate
            );

          // ELIMINAR INVALIDAS

          if (
            invalidAssignments.length > 0
          ) {

            const invalidIds =

              invalidAssignments.map(
                a => a.id
              );

            await supabase

              .from('assignments')

              .delete()

              .in(
                'id',
                invalidIds
              );
          }

          // ACTUALIZAR ESTADO

          setAssignments(
            validAssignments
          );
        }
      }

      alert(
        'Proyecto actualizado'
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

      const {
        data,
        error
      } = await supabase

        .from('projects')

        .insert([newProject])

        .select()

        .single();

      if (error) {

        console.error(error);

        alert(
          'Error creando proyecto'
        );

        return;
      }

      if (!data) {
        return;
      }

      setProjects(prev => [

        ...prev,

        data as Project
      ]);

      alert(
        'Proyecto creado'
      );
    }

    // =====================
    // LIMPIAR FORMULARIO
    // =====================

    setInformation('');

    setObject('');

    setStartDate('');

    setEndDate('');

    setColor(
      getNextColor()
    );
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

        {/* BOTÓN */}

        <button onClick={saveProject}>

          {editingProject

            ? 'Actualizar'

            : 'Crear'}

        </button>

      </div>

    </div>
  );
}
