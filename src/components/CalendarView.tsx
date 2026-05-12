import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useMemo } from 'react';

import {
  Assignment,
  Project,
  TooltipData,
  Worker
} from '../types';

interface Props {
  workers: Worker[];
  projects: Project[];
  assignments: Assignment[];

  setAssignments: React.Dispatch<
    React.SetStateAction<Assignment[]>
  >;

  tooltip: TooltipData;

  setTooltip: React.Dispatch<
    React.SetStateAction<TooltipData>
  >;
}

export default function CalendarView({
  workers,
  projects,
  assignments,
  setTooltip
}: Props) {

  const getWorkersForProjectDate = (
    projectId: string,
    date: string
  ) => {

    const workerIds = assignments
      .filter(
        a =>
          a.projectId === projectId &&
          a.date === date
      )
      .map(a => a.workerId);

    const uniqueIds = [...new Set(workerIds)];

    return uniqueIds
      .map(
        id =>
          workers.find(w => w.id === id)?.name
      )
      .filter(Boolean)
      .join(', ');
  };

  // =========================
  // EVENTOS CALENDARIO
  // =========================
  const events = useMemo(() => {

    const grouped = new Map<
      string,
      Assignment
    >();

    assignments.forEach(assign => {

      const key =
        `${assign.projectId}_${assign.date}`;

      if (!grouped.has(key)) {
        grouped.set(key, assign);
      }

    });

    return Array.from(
      grouped.values()
    ).map(assign => {

      const project = projects.find(
        p => p.id === assign.projectId
      );

      return {

        id:
          `${assign.projectId}_${assign.date}`,

        title:
          `${project?.information || 'N/A'}`,

        start: assign.date,

        backgroundColor:
          project?.color || '#999',

        borderColor:
          project?.color || '#999',

        textColor: '#fff',

        extendedProps: {

          workerName:
            getWorkersForProjectDate(
              assign.projectId,
              assign.date
            ),

          projectName:
            project?.information || '',

          date: assign.date
        }
      };

    });

  }, [assignments, workers, projects]);

  return (
    <div className="card">

      <h2>
        📅 Calendario General de Asignaciones
      </h2>

      <FullCalendar
        plugins={[
          dayGridPlugin,
          interactionPlugin
        ]}

        initialView="dayGridMonth"

        locale="es"

        events={events}

        height={700}

        eventDisplay="block"

        dayMaxEvents={3}

        eventMouseEnter={(info) => {

          setTooltip({
            visible: true,

            x:
              info.jsEvent.pageX + 10,

            y:
              info.jsEvent.pageY - 20,

            workerName:
              info.event.extendedProps
                .workerName,

            projectName:
              info.event.extendedProps
                .projectName,

            date:
              info.event.extendedProps
                .date
          });

        }}

        eventMouseLeave={() => {

          setTooltip(prev => ({
            ...prev,
            visible: false
          }));

        }}
      />

    </div>
  );
}