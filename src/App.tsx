import './index.css';
import { useEffect, useState } from 'react';

import ProjectHistory from './components/ProjectHistory';
import HomeDashboard from './views/HomeDashboard';

import {
  Assignment,
  Project,
  TooltipData,
  Worker
} from './types';

import { supabase } from './lib/supabase';

export default function App() {

  const [workers, setWorkers] =
    useState<Worker[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

  const [view, setView] =
    useState<'home' | 'history'>('home');

  const [tooltip, setTooltip] =
    useState<TooltipData>({
      visible: false,
      x: 0,
      y: 0,
      workerName: '',
      projectName: '',
      date: ''
    });

  useEffect(() => {

    loadWorkers();
    loadProjects();
    loadAssignments();

  }, []);

  // =========================
  // TRABAJADORES
  // =========================

  const loadWorkers = async () => {

    const { data, error } = await supabase
      .from('workers')
      .select('*');

    if (error) {

      console.error(
        'Error cargando trabajadores:',
        error
      );

      return;
    }

    setWorkers(data || []);
  };

  // =========================
  // PROYECTOS
  // =========================

  const loadProjects = async () => {

    const { data, error } = await supabase
      .from('projects')
      .select('*');

    if (error) {

      console.error(
        'Error cargando proyectos:',
        error
      );

      return;
    }

    const projectsData: Project[] =
      (data || []).map(project => ({

        id: project.id,

        information:
          project.information,

        object:
          project.object,

        startDate:
          project.startDate,

        endDate:
          project.endDate,

        color:
          project.color
      }));

    setProjects(projectsData);
  };

  // =========================
  // ASIGNACIONES
  // =========================

  const loadAssignments = async () => {

    const { data, error } = await supabase
      .from('assignments')
      .select('*');

    if (error) {

      console.error(
        'Error cargando asignaciones:',
        error
      );

      return;
    }

    const formattedAssignments:
      Assignment[] =
      (data || []).map(item => ({

        id: item.id,

        workerId:
          item.workerId,

        projectId:
          item.projectId,

        date:
          item.date
      }));

    setAssignments(
      formattedAssignments
    );
  };

  return (

    <div className="container">

      {view === 'home' && (

        <HomeDashboard

          workers={workers}
          setWorkers={setWorkers}

          projects={projects}
          setProjects={setProjects}

          assignments={assignments}
          setAssignments={setAssignments}

          tooltip={tooltip}
          setTooltip={setTooltip}

          setView={setView}
        />
      )}

      {view === 'history' && (

        <ProjectHistory

          workers={workers}
          projects={projects}
          assignments={assignments}

          setView={setView}
        />
      )}
    </div>
  );
}