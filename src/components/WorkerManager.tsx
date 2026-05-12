import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Assignment, Worker } from '../types';

interface Props {
  workers: Worker[];
  setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

export default function WorkerManager({
  setWorkers
}: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'Fijo' | 'Temporal'>('Fijo');

  const addWorker = async () => {
    if (!name.trim()) return;

    const newWorker = {
      name,
      type
    };

    const { data, error } = await supabase
      .from('workers')
      .insert([newWorker])
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (!data) return;

    setWorkers(prev => [...prev, data as Worker]);

    setName('');
    setType('Fijo');
  };

  return (
    <div className="card">
      <h2>👷 Gestión de Trabajadores</h2>

      <div className="form-grid">
        <input
          type="text"
          placeholder="Nombre trabajador"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <select
          value={type}
          onChange={e =>
            setType(e.target.value as 'Fijo' | 'Temporal')
          }
        >
          <option value="Fijo">Fijo</option>
          <option value="Temporal">Temporal</option>
        </select>
      </div>
      <div className="form-grid">
        <button onClick={addWorker}>
          Agregar
        </button>
      </div>
    </div>
  );
}