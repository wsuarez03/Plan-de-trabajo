import { Assignment } from '../types';

export type DayStatus =
  | 'green'
  | 'yellow'
  | 'red';

export const getDayStatus = (
  workerId: string,
  date: string,
  assignments: Assignment[],
  currentProjectId?: string
): DayStatus => {

  if (!workerId) {
    return 'green';
  }

  const currentDate =
    new Date(date);

  // =========================
  // ASIGNACIONES DEL TRABAJADOR
  // =========================

  const workerAssignments =
    assignments.filter(
      a =>
        a.workerId === workerId
    );

  // =========================
  // ROJO → MISMO DÍA OCUPADO
  // =========================

  const occupied =
    workerAssignments.some(a => {

      // ignorar mismo proyecto
      if (
        currentProjectId &&
        a.projectId === currentProjectId
      ) {
        return false;
      }

      return a.date === date;
    });

  if (occupied) {
    return 'red';
  }

  // =========================
  // AMARILLO → VIAJE
  // 1 día antes o después
  // =========================

  const travel =
    workerAssignments.some(a => {

      // ignorar mismo proyecto
      if (
        currentProjectId &&
        a.projectId === currentProjectId
      ) {
        return false;
      }

      const assignmentDate =
        new Date(a.date);

      const diff =
        Math.abs(
          currentDate.getTime() -
          assignmentDate.getTime()
        );

      const days =
        diff /
        (1000 * 60 * 60 * 24);

      return days === 1;
    });

  if (travel) {
    return 'yellow';
  }

  // =========================
  // VERDE
  // =========================

  return 'green';
};