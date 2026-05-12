import { useState } from 'react';

import WorkerManager from '../components/WorkerManager';
import ProjectManager from '../components/ProjectManager';
import AssignmentPanel from '../components/AssignmentPanel';
import CalendarView from '../components/CalendarView';
import DashboardStats from '../components/DashboardStats';

import { Assignment, Project, TooltipData, Worker } from '../types';

interface Props {
  workers: Worker[];
  setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;

  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;

  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;

  tooltip: TooltipData;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipData>>;

  setView: React.Dispatch<React.SetStateAction<'home' | 'history'>>;
}

export default function HomeDashboard({
  workers,
  setWorkers,
  projects,
  setProjects,
  assignments,
  setAssignments,
  tooltip,
  setTooltip,
  setView
}: Props) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  return (
    <>
      <h1>Plan de Trabajo</h1>

      <DashboardStats
        workers={workers}
        setWorkers={setWorkers}
        projects={projects}
        setProjects={setProjects}
        assignments={assignments}
        setAssignments={setAssignments}
        setEditingProject={setEditingProject}
        setView={setView}
      />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              alignItems: 'start',
              marginBottom: '20px'
            }}
          >
            <WorkerManager
              workers={workers}
              setWorkers={setWorkers}
              setAssignments={setAssignments}
            />

     
          <ProjectManager
              projects={projects}
              setProjects={setProjects}
              setAssignments={setAssignments}
              editingProject={editingProject}
              setEditingProject={setEditingProject}
            />
          
          </div>
          <AssignmentPanel
            workers={workers}
            projects={projects}
            assignments={assignments}
            setAssignments={setAssignments}
          />
        

      <CalendarView
        workers={workers}
        projects={projects}
        assignments={assignments}
        setAssignments={setAssignments}
        tooltip={tooltip}
        setTooltip={setTooltip}
      />

      {tooltip.visible && (
        <div
          className="tooltip-box"
          style={{
            left: tooltip.x,
            top: tooltip.y
          }}
        >
          <strong>Proyecto:</strong> {tooltip.projectName}
          <br />

          <strong>Fecha:</strong> {tooltip.date}
          <br />

          <strong>Trabajadores:</strong> {tooltip.workerName}
        </div>
      )}
    </>
  );
}