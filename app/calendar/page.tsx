import React from 'react';

/**
 * Calendar Page
 */
export default function CalendarPage() {
  return (
    <div>
      <h1 className="text-3xl font-poppins font-bold mb-8">Prayer Calendar</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-poppins font-semibold mb-4">Prayer Tracking Calendar</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Prayer calendar view and tracking features will be implemented here.
        </p>
        
        {/* Placeholder for calendar component */}
        <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Calendar component will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
}