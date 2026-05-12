export interface Worker {
  id: string;
  name: string;
  type: 'Fijo' | 'Temporal';
}

export interface Project {
  id: string;

  information: string;

  object?: string;

  startDate: string;
  endDate: string;

  color?: string;
}

export interface Assignment {
  id?: string;

  workerId: string;
  projectId: string;

  date: string;
}

export interface TooltipData {

  visible: boolean;

  x: number;
  y: number;

  workerName: string;
  projectName: string;

  date: string;
}