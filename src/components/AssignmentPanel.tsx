import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import {
  Assignment,
  Project,
  Worker
} from '../types';

import { getDayStatus } from '../utils/validators';

interface Props {

  workers: Worker[];

  projects: Project[];

  assignments: Assignment[];

  setAssignments:
    React.Dispatch<
      React.SetStateAction<Assignment[]>
    >;
}

export default function AssignmentPanel({

  workers,
  projects,

  assignments,
  setAssignments

}: Props) {

  const [
    selectedWorker,
    setSelectedWorker
  ] = useState('');

  // CLIENTE
  const [
    selectedClient,
    setSelectedClient
  ] = useState('');

  // OBJETO / PROYECTO
  const [
    selectedProject,
    setSelectedProject
  ] = useState('');

  const [
    selectedDates,
    setSelectedDates
  ] = useState<string[]>([]);

  // =========================
  // CLIENTES ÚNICOS
  // =========================

  const uniqueClients = [

    ...new Set(

      projects.map(
        project => project.information
      )
    )
  ];

  // =========================
  // PROYECTOS DEL CLIENTE
  // =========================

  const clientProjects =
    projects.filter(
      project =>
        project.information ===
        selectedClient
    );

  // =========================
  // PROYECTOS VISIBLES
  // =========================

  const visibleProjects =
    selectedProject

      ? clientProjects.filter(
          p => p.id === selectedProject
        )

      : clientProjects;

  // =========================
  // GENERAR FECHAS
  // =========================

  const projectDates: {
    date: string;
    projectId: string;
    object: string;
  }[] = [];

  visibleProjects.forEach(project => {

    const start =
      new Date(project.startDate);

    const end =
      new Date(project.endDate);

    const current =
      new Date(start);

    while (current <= end) {

      projectDates.push({

        date:
          current
            .toISOString()
            .split('T')[0],

        projectId:
          project.id,

        object: 
          project.object ?? ''
      });

      current.setDate(
        current.getDate() + 1
      );
    }
  });

  // =========================
  // CARGAR FECHAS EXISTENTES
  // =========================

  useEffect(() => {

    if (
      !selectedWorker ||
      !selectedProject
    ) {

      setSelectedDates([]);

      return;
    }

    const existingAssignments =
      assignments.filter(
        a =>
          a.workerId ===
            selectedWorker &&
          a.projectId ===
            selectedProject
      );

    if (
      existingAssignments.length > 0
    ) {

      setSelectedDates(
        existingAssignments.map(
          a => a.date
        )
      );

      return;
    }

    const project =
      projects.find(
        p =>
          p.id ===
          selectedProject
      );

    if (!project) {
      return;
    }

    const dates: string[] = [];

    const start =
      new Date(project.startDate);

    const end =
      new Date(project.endDate);

    const current =
      new Date(start);

    while (current <= end) {

      dates.push(
        current
          .toISOString()
          .split('T')[0]
      );

      current.setDate(
        current.getDate() + 1
      );
    }

    setSelectedDates(dates);

  }, [

    selectedProject,
    selectedWorker,
    projects,
    assignments
  ]);

  // =========================
  // TOGGLE FECHA
  // =========================

  const toggleDate = (
    date: string
  ) => {

    if (!selectedProject) {
      return;
    }

    const status =
      getDayStatus(

        selectedWorker,

        date,

        assignments,

        selectedProject
      );

    if (status === 'red') {
      return;
    }

    if (
      selectedDates.includes(date)
    ) {

      setSelectedDates(prev =>

        prev.filter(
          d => d !== date
        )
      );

    } else {

      setSelectedDates(prev => [

        ...prev,

        date
      ]);
    }
  };
  // =========================
  // Quitar asignación
  // =========================


  const removeAssignment = async (
  workerId: string,
  projectId: string,
  date: string
) => {

  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('workerId', workerId)
    .eq('projectId', projectId)
    .eq('date', date);

  if (error) {
    console.error(error);
    return;
  }
      setAssignments(prev =>
    prev.filter(a => !(
      a.workerId === workerId &&
      a.projectId === projectId &&
      a.date === date
    ))
  );

  alert('Asignación eliminada');
};
  // =========================
  // GUARDAR
  // =========================

  const saveAssignments =
    async () => {

      if (
        !selectedWorker ||
        !selectedProject ||
        selectedDates.length === 0
      ) {
        return;
      }

      // borrar anteriores

      const {
        error: deleteError
      } = await supabase

        .from('assignments')

        .delete()

        .eq(
          'workerId',
          selectedWorker
        )

        .eq(
          'projectId',
          selectedProject
        );

      if (deleteError) {

        console.error(deleteError);

        return;
      }

      // insertar nuevas

      const orderedDates =
        [...selectedDates].sort();

      const newAssignments =
        orderedDates.map(date => ({

          workerId:
            selectedWorker,

          projectId:
            selectedProject,

          date
        }));

      const { data, error } =
        await supabase

          .from('assignments')

          .insert(newAssignments)

          .select();

      if (error) {

        console.error(error);

        return;
      }

      setAssignments(prev => {

        const filtered =
          prev.filter(
            a => !(

              a.workerId ===
                selectedWorker &&

              a.projectId ===
                selectedProject
            )
          );

        return [

          ...filtered,

          ...(data as Assignment[])
        ];
      });

      alert(
        'Asignaciones actualizadas'
      );
                
          // =========================
          // LIMPIAR FORMULARIO
          // =========================
          
          setSelectedWorker('');
          
          setSelectedClient('');
          
          setSelectedProject('');
          
          setSelectedDates([]);
        

    };

  return (

    <div className="card">

      <h2>
        📅 Asignaciones
      </h2>

      <div className="form-grid">

        {/* TRABAJADOR */}

        <select

          value={selectedWorker}

          onChange={e =>
            setSelectedWorker(
              e.target.value
            )
          }
        >

          <option value="">
            Seleccionar trabajador
          </option>

          {workers.map(worker => (

            <option
              key={worker.id}
              value={worker.id}
            >

              {worker.name}

            </option>
          ))}
        </select>

        {/* CLIENTE */}

        <select

          value={selectedClient}

          onChange={e => {

            setSelectedClient(
              e.target.value
            );

            setSelectedProject('');
          }}
        >

          <option value="">
            Seleccionar cliente
          </option>

          {uniqueClients.map(client => (

            <option
              key={client}
              value={client}
            >

              {client}

            </option>
          ))}
        </select>

        {/* OBJETO */}

        <select

          value={selectedProject}

          onChange={e =>
            setSelectedProject(
              e.target.value
            )
          }

          disabled={!selectedClient}
        >

          <option value="">
            Todos los objetos
          </option>

          {clientProjects.map(project => (

            <option
              key={project.id}
              value={project.id}
            >

              {project.object}

            </option>
          ))}
        </select>
      </div>

      {/* FECHAS */}

      {projectDates.length > 0 && (

        <div
          style={{

            marginTop: '20px',

            display: 'grid',

            gridTemplateColumns:
              'repeat(auto-fill,minmax(160px,1fr))',

            gap: '10px'
          }}
        >

          {projectDates.map(item => {

            const status =
              getDayStatus(

                selectedWorker,

                item.date,

                assignments,

                item.projectId
              );

            const isChecked =
              selectedDates.includes(
                item.date
              );

            const isBlocked =
              status === 'red';

            return (

              <label

                key={
                  item.projectId +
                  item.date
                }

                style={{


                border: (() => {

                  const today =
                    new Date()
                      .toISOString()
                      .split('T')[0];

                  const isExpired =
                    item.date < today;

                  if (isExpired) {
                    return '2px solid #999';
                  }

                  if (status === 'red') {
                    return '2px solid red';
                  }

                  if (status === 'yellow') {
                    return '2px solid orange';
                  }

                  return '2px solid green';

                })(),


                  borderRadius: '10px',

                  padding: '10px',

                  opacity:
                    isBlocked
                      ? 0.6
                      : 1,

                  cursor:
                    isBlocked
                      ? 'not-allowed'
                      : 'pointer',

                background: (() => {

                  // proyecto vencido
                  const today =
                    new Date()
                      .toISOString()
                      .split('T')[0];

                  const isExpired =
                    item.date < today;

                  if (isExpired) {
                    return '#e0e0e0';
                  }

                  if (status === 'red') {
                    return '#ffe5e5';
                  }

                  if (status === 'yellow') {
                    return '#fff6d8';
                  }

                  return '#e9ffe9';

                })()


                }}
              >

              
              <input

                type="checkbox"

                checked={isChecked}

                disabled={
                  isBlocked ||
                  !selectedProject
                }

                onChange={() =>
                  toggleDate(item.date)
                }
              />

              {/* OBJETO */}

              <div
                style={{
                  fontWeight: 700,
                  marginBottom: '6px',
                  fontSize: '13px'
                }}
              >
                {item.object}
              </div>

              {/* FECHA */}

              <div
                style={{
                  marginTop: '6px',
                  fontWeight: 600
                }}
              >
                {item.date}
              </div>

              {/* ESTADO */}

              <div
                style={{
                  marginTop: '4px',
                  fontSize: '12px'
                }}
              >

                {status === 'green' &&
                  '🟢 Disponible'}

                {status === 'yellow' &&
                  '🟡 Viaje'}

                {status === 'red' &&
                  '🔴 Ocupado'}

              </div>



              </label>
            );
          })}
        </div>
      )}

      <button

        onClick={saveAssignments}

        style={{
          marginTop: '20px'
        }}
      >

        Guardar asignaciones

      </button>
    </div>
  );
}
