import { Project } from '../types';

interface Props {
  projects: Project[];
  setView: React.Dispatch<React.SetStateAction<'home' | 'history'>>;
}

export default function AssignmentSummary({
    setView
}: Props) {
  return (
    <div className="card">
      <h2>📋 Historial de Proyectos</h2>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        
        <button onClick={() => setView('history')}>
          👁 Ver Historial Completo
        </button>
      </div>
    </div>
  );
}