import { useMemo, useState } from 'react';
import { Assignment, Project, Worker } from '../types';

interface Props {
  workers: Worker[];
  projects: Project[];
  assignments: Assignment[];
  setView: React.Dispatch<React.SetStateAction<'home' | 'history'>>;
}

export default function ProjectHistory({
  workers,
  projects,
  assignments,
  setView
}: Props) {
  const [search, setSearch] = useState('');
  const [workerFilter, setWorkerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch =
        project.information.toLowerCase().includes(search.toLowerCase()) ||
        project.object?.toLowerCase().includes(search.toLowerCase());

      const workerIds = assignments
        .filter(a => a.projectId === project.id)
        .map(a => a.workerId);

      const matchesWorker = workerFilter
        ? workerIds.includes(workerFilter)
        : true;

      const matchesStatus =
        statusFilter === 'active'
          ? project.endDate >= today
          : statusFilter === 'finished'
          ? project.endDate < today
          : true;

      return matchesSearch && matchesWorker && matchesStatus;
    });
  }, [projects, assignments, search, workerFilter, statusFilter]);

  const getWorkersByProject = (projectId: string) => {
    const ids = assignments
      .filter(a => a.projectId === projectId)
      .map(a => a.workerId);

    const uniqueIds = [...new Set(ids)];

    return uniqueIds
      .map(id => workers.find(w => w.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };



  return (
    <div>
      <h1>📚 Historial General de Proyectos</h1>

      <div className="card">
        <div className="form-row">
          <input
            type="text"
            placeholder="🔎 Buscar por nombre u objeto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select value={workerFilter} onChange={e => setWorkerFilter(e.target.value)}>
            <option value="">Todos los trabajadores</option>
            {workers.map(worker => (
              <option key={worker.id} value={worker.id}>
                {worker.name}
              </option>
            ))}
          </select>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Todos</option>
            <option value="active">Activos</option>
            <option value="finished">Finalizados</option>
          </select>

          <button onClick={() => setView('home')}>
            ← Volver al Panel
          </button>
        </div>
      </div>
        <p style={{ margin: '15px 0', fontWeight: 'bold' }}>
        Total proyectos: {filteredProjects.length}
        </p>
      <div className="card history-scroll">
        <div className="history-table">
          <div className="history-header">
            <span>Proyecto</span>
            <span>Objeto</span>
            <span>Inicio</span>
            <span>Fin</span>
            <span>Personal Asignado</span>
          </div>

          {filteredProjects.map(project => (
            <div key={project.id} className="history-row">
              <span>{project.information}</span>
              <span>{project.object}</span>
              <span>{project.startDate}</span>
              <span>{project.endDate}</span>
              <span>{getWorkersByProject(project.id)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}