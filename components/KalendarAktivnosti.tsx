"use client";
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

type Activity = {
  id: number;
  naslov: string;
  datumPocetka: string;
  izvrsena: boolean;
  tip: string;
  kosnica?: {
    naziv: string;
  };
};

type ActivityCalendarProps = {
  activities: Activity[];
  onEventClick?: (activityId: number) => void;
};

export default function ActivityCalendar({ 
  activities, 
  onEventClick 
}: ActivityCalendarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const events = activities.map(activity => ({
    id: activity.id.toString(),
    title: activity.naslov,
    start: activity.datumPocetka,
    backgroundColor: activity.izvrsena ? '#10b981' : '#f59e0b',
    borderColor: activity.izvrsena ? '#059669' : '#d97706',
    extendedProps: {
      tip: activity.tip,
      kosnica: activity.kosnica?.naziv || 'N/A',
      izvrsena: activity.izvrsena
    }
  }));

  const handleEventClick = (clickInfo: any) => {
    const activityId = parseInt(clickInfo.event.id);
    if (onEventClick) {
      onEventClick(activityId);
    } else {
      const { tip, kosnica, izvrsena } = clickInfo.event.extendedProps;
      alert(
        `${clickInfo.event.title}\n` +
        `Kosnica: ${kosnica}\n` +
        `Tip: ${tip}\n` +
        `Status: ${izvrsena ? 'Izvrsena' : 'Nije izvrsena'}`
      );
    }
  };

  return (
    <div className="calendar-wrapper bg-white dark:bg-gray-800 p-3 md:p-6 rounded-xl shadow-lg">
      <style jsx global>{`
        .fc {
          font-family: inherit;
        }
        
        .fc-toolbar-title {
          font-size: 1rem !important;
          font-weight: 700;
          color: rgb(31 41 55);
        }

        @media (min-width: 768px) {
          .fc-toolbar-title {
            font-size: 1.5rem !important;
          }
        }
        
        .dark .fc-toolbar-title {
          color: rgb(243 244 246);
        }
        
        .fc-button {
          background-color: #f59e0b !important;
          border-color: #f59e0b !important;
          text-transform: capitalize !important;
          font-weight: 600 !important;
          padding: 4px 8px !important;
          font-size: 0.8rem !important;
        }

        @media (min-width: 768px) {
          .fc-button {
            padding: 6px 12px !important;
            font-size: 0.9rem !important;
          }
        }
        
        .fc-button:hover {
          background-color: #d97706 !important;
          border-color: #d97706 !important;
        }
        
        .fc-button-active {
          background-color: #d97706 !important;
          border-color: #d97706 !important;
        }
        
        .fc-event {
          cursor: pointer;
          border-radius: 4px;
          padding: 1px 2px;
          font-size: 0.75rem !important;
        }

        @media (min-width: 768px) {
          .fc-event {
            padding: 2px 4px;
            font-size: 0.85rem !important;
          }
        }
        
        .fc-event:hover {
          opacity: 0.85;
        }
        
        .fc-daygrid-day-number {
          color: rgb(31 41 55);
          font-weight: 600;
          font-size: 0.8rem;
        }

        @media (min-width: 768px) {
          .fc-daygrid-day-number {
            font-size: 1rem;
          }
        }
        
        .dark .fc-daygrid-day-number {
          color: rgb(243 244 246);
        }
        
        .fc-col-header-cell-cushion {
          color: rgb(31 41 55);
          font-weight: 600;
          font-size: 0.75rem;
        }

        @media (min-width: 768px) {
          .fc-col-header-cell-cushion {
            font-size: 0.9rem;
          }
        }
        
        .dark .fc-col-header-cell-cushion {
          color: rgb(243 244 246);
        }

        .fc-toolbar {
          flex-wrap: wrap;
          gap: 8px;
        }

        @media (max-width: 480px) {
          .fc-toolbar {
            flex-direction: column;
            align-items: center;
          }
        }

        .fc-list-event-title {
          font-size: 0.85rem;
        }
        .fc-icon-chevron-left:before {
          content: '‹' !important;
          font-size: 1.4rem;
          line-height: 1;
        }

        .fc-icon-chevron-right:before {
          content: '›' !important;
          font-size: 1.4rem;
          line-height: 1;
        }
      `}</style>
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={isMobile ? "listWeek" : "dayGridMonth"}
        headerToolbar={
          isMobile
            ? {
                left: 'prev,next',
                center: 'title',
                right: 'listWeek,dayGridMonth'
              }
            : {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
              }
        }
        buttonText={{
          today: 'Danas',
          month: 'Mesec',
          week: 'Nedelja',
          list: 'Lista'
        }}
        events={events}
        eventClick={handleEventClick}
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={isMobile ? 2 : 3}
        weekends={true}
        height="auto"
        locale="sr"
        firstDay={1}
      />
      
      {/* Legenda */}
      <div className="mt-4 md:mt-6 flex gap-4 md:gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
          <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Neizvršene</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
          <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Izvršene</span>
        </div>
      </div>
    </div>
  );
}