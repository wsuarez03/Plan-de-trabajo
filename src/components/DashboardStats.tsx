import { useState } from 'react';

import {
  Assignment,
  Project,
  Worker
} from '../types';

import {
  getWorkerStatus
} from '../utils/workerStatus';

import StatsModal from './StatsModal';
import AssignmentSummary from './AssignmentSummary';

import { supabase } from '../lib/supabase';

interface Props {

  workers: Worker[];

  setWorkers:
    React.Dispatch<
      React.SetStateAction<Worker[]>
    >;

  projects: Project[];

  setProjects:
    React.Dispatch<
      React.SetStateAction<Project[]>
    >;

  assignments: Assignment[];

  setAssignments:
    React.Dispatch<
      React.SetStateAction<Assignment[]>
    >;

  setEditingProject:
    React.Dispatch<
      React.SetStateAction<Project | null>
    >;

  setView:
    React.Dispatch<
      React.SetStateAction<
        'home' | 'history'
      >
    >;
}

export default function DashboardStats({

  workers,
  setWorkers,

  projects,
  setProjects,

  assignments,
  setAssignments,

  setEditingProject,
  setView

}: Props) {

  const [showWorkers,
    setShowWorkers] =
    useState(false);

  const [showProjects,
    setShowProjects] =
    useState(false);

  // =========================
  // FECHA ACTUAL
  // =========================

  const today =
    new Date()
      .toISOString()
      .split('T')[0];

  // =========================
  // PROYECTOS ACTIVOS
  // =========================

  const activeProjects =
    projects.filter(
      project =>
        project.endDate >= today
    );

  // =========================
  // TRABAJADORES
  // =========================

  const fixedWorkers =
    workers.filter(
      worker =>
        worker.type === 'Fijo'
    ).length;

  const temporaryWorkers =
    workers.filter(
      worker =>
        worker.type === 'Temporal'
    ).length;

  // =========================
  // PERSONAL HOY
  // =========================

  const availableToday =
    workers.map(worker => {

      const status =
        getWorkerStatus(
          worker.id,
          assignments
        );

      return `${status} ${worker.name}`;
    });

  // =========================
  // ELIMINAR TRABAJADOR
  // =========================

  const deleteWorker =
    async (
      workerId: string
    ) => {

      if (
        !confirm(
          '¿Eliminar este trabajador y todas sus asignaciones?'
        )
      ) {
        return;
      }

      await supabase
        .from('assignments')
        .delete()
        .eq(
          'workerId',
          workerId
        );

      await supabase
        .from('workers')
        .delete()
        .eq(
          'id',
          workerId
        );

      setWorkers(prev =>
        prev.filter(
          worker =>
            worker.id !== workerId
        )
      );

      setAssignments(prev =>
        prev.filter(
          assign =>
            assign.workerId !== workerId
        )
      );
    };

  // =========================
  // ELIMINAR PROYECTO
  // =========================

  const deleteProject =
    async (
      projectId: string
    ) => {

      if (
        !confirm(
          '¿Eliminar este proyecto y todas sus asignaciones?'
        )
      ) {
        return;
      }

      await supabase
        .from('assignments')
        .delete()
        .eq(
          'projectId',
          projectId
        );

      await supabase
        .from('projects')
        .delete()
        .eq(
          'id',
          projectId
        );

      setProjects(prev =>
        prev.filter(
          project =>
            project.id !== projectId
        )
      );

      setAssignments(prev =>
        prev.filter(
          assign =>
            assign.projectId !== projectId
        )
      );
    };

  return (
    <>
      <div className="stats-grid">

        {/* TRABAJADORES */}

        <div className="stat-card">

          <h3>
            {workers.length}
          </h3>

          <p>
            Trabajadores
          </p>

          <button
            onClick={() =>
              setShowWorkers(true)
            }
          >
            Ver más
          </button>

          <div
            style={{
              display: 'grid',

              gridTemplateColumns:
                '1fr 1fr',

              gap: '8px',

              marginTop: '12px'
            }}
          >

            <div
              style={{
                background: '#f4f4f4',
                padding: '8px',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <strong>
                Fijos
              </strong>

              <div>
                {fixedWorkers}
              </div>
            </div>

            <div
              style={{
                background: '#f4f4f4',
                padding: '8px',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <strong>
                Temporales
              </strong>

              <div>
                {temporaryWorkers}
              </div>
            </div>
          </div>
        </div>

        {/* PROYECTOS ACTIVOS */}

        <div className="stat-card">

          <h3>
            {activeProjects.length}
          </h3>

          <p>
            Proyectos Vigentes
          </p>

          <button
            onClick={() =>
              setShowProjects(true)
            }
          >
            Ver más
          </button>

          <div
            style={{
              marginTop: '12px',
              fontSize: '13px'
            }}
          >
            Activos hoy:
            {' '}
            <strong>
              {activeProjects.length}
            </strong>
          </div>
        </div>

        {/* RESUMEN */}

        <div className="stat-card">

          <AssignmentSummary
            projects={projects}
            setView={setView}
          />
        </div>

        {/* PERSONAL HOY */}

        <div className="stat-card">

          <h3
            style={{
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}
          >
            {availableToday.join(' | ')}
          </h3>

          <p>
            Personal Hoy
          </p>
        </div>
      </div>

      {/* MODAL TRABAJADORES */}

      {showWorkers && (

        <StatsModal

          title="👷 Trabajadores"

          onClose={() =>
            setShowWorkers(false)
          }
        >

          <h2>
            👷 Trabajadores Registrados
          </h2>

          <div className="list-container">

            {workers.map(worker => (

              <div
                key={worker.id}
                className="list-item"
              >

                <span>
                  {worker.name}
                  {' '}
                  ({worker.type})
                </span>

                <button
                  onClick={() =>
                    deleteWorker(worker.id)
                  }
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </StatsModal>
      )}

      {/* MODAL PROYECTOS */}

      {showProjects && (

        <StatsModal

          title="📁 Proyectos"

          onClose={() =>
            setShowProjects(false)
          }
        >

          <h2>
            📁 Todos los Proyectos
          </h2>

          <div className="list-container">

            {projects.map(project => {

              const isActive =
                project.endDate >= today;

              return (

                <div
                  key={project.id}
                  className="list-item"
                >

                  <span>

                    {isActive
                      ? '🟢'
                      : '⚫'}

                    {' '}

                    {project.information}

                    {' | '}

                    {project.startDate}

                    {' → '}

                    {project.endDate}

                  </span>

                  <div
                    style={{
                      display: 'flex',
                      gap: '8px'
                    }}
                  >

                    <button
                      onClick={() =>
                        deleteProject(
                          project.id
                        )
                      }
                    >
                      Eliminar
                    </button>

                    <button
                      onClick={() => {

                        setShowProjects(false);

                        setEditingProject(
                          project
                        );

                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth'
                        });
                      }}
                    >
                      Editar
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        </StatsModal>
      )}
    </>
  );
}