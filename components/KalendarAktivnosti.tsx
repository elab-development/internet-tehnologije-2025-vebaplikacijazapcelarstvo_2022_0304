"use client";
import { useState } from 'react';
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
  // Transformiši aktivnosti u format koji FullCalendar razume
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
      // Default akcija - prikaži alert
      const { tip, kosnica, izvrsena } = clickInfo.event.extendedProps;
      alert(
        `📋 ${clickInfo.event.title}\n` +
        `🐝 Košnica: ${kosnica}\n` +
        `📌 Tip: ${tip}\n` +
        `✅ Status: ${izvrsena ? 'Izvršena' : 'Nije izvršena'}`
      );
    }
  };

  return (
    <div className="calendar-wrapper bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <style jsx global>{`
        .fc {
          font-family: inherit;
        }
        
        .fc-toolbar-title {
          font-size: 1.5rem !important;
          font-weight: 700;
          color: rgb(31 41 55);
        }
        
        .dark .fc-toolbar-title {
          color: rgb(243 244 246);
        }
        
        .fc-button {
          background-color: #f59e0b !important;
          border-color: #f59e0b !important;
          text-transform: capitalize !important;
          font-weight: 600 !important;
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
          padding: 2px 4px;
        }
        
        .fc-event:hover {
          opacity: 0.85;
        }
        
        .fc-daygrid-day-number {
          color: rgb(31 41 55);
          font-weight: 600;
        }
        
        .dark .fc-daygrid-day-number {
          color: rgb(243 244 246);
        }
        
        .fc-col-header-cell-cushion {
          color: rgb(31 41 55);
          font-weight: 600;
        }
        
        .dark .fc-col-header-cell-cushion {
          color: rgb(243 244 246);
        }
      `}</style>
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek'
        }}
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
        dayMaxEvents={3}
        weekends={true}
        height="auto"
        locale="sr"
        firstDay={1} // Ponedeljak je prvi dan
      />
      
      {/* Legenda */}
      <div className="mt-6 flex gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Neizrvrešene</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Izvršene</span>
        </div>
      </div>
    </div>
  );
}