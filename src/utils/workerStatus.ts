import { Assignment } from '../types';

export function getWorkerStatus(
  workerId: string,
  assignments: Assignment[]
) {

  const today =
    new Date()
      .toISOString()
      .split('T')[0];

  const assignment =
    assignments.find(
      a =>
        a.workerId === workerId &&
        a.date === today
    );

  if (assignment) {
    return '🔴';
  }

  return '🟢';
}