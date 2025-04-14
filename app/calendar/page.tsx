import React from 'react';

/**
 * Calendar Page
 */
export default function CalendarPage() {
  return (
    <div className="animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-poppins font-semibold mb-6">Prayer Calendar</h2>
        
        <div className="mb-6">
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={i} className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 30 }, (_, i) => {
              // Mock data - in real app would come from actual tracking
              const date = i + 1;
              const hasCompleted = Math.random() > 0.3; // Randomly determine if prayers were completed
              const isPrayingToday = date === 15; // Highlight today
              const isWeekend = date % 7 === 0 || date % 7 === 6; // Weekend styling
              
              return (
                <div 
                  key={i} 
                  className={`
                    aspect-square rounded-md flex flex-col items-center justify-center relative
                    ${isPrayingToday ? 'bg-primary text-white' : (
                      hasCompleted ? 'bg-primary/10 text-primary dark:bg-primary/20' : (
                        isWeekend ? 'bg-slate-100 dark:bg-slate-700' : 'bg-slate-50 dark:bg-slate-800/80'
                      )
                    )}
                    ${date > 28 ? 'opacity-50' : ''}
                    cursor-pointer hover:shadow-sm transition-all
                    border border-slate-100 dark:border-slate-700
                  `}
                >
                  <span className={`text-sm font-medium ${isPrayingToday ? 'text-white' : ''}`}>
                    {date}
                  </span>
                  {hasCompleted && (
                    <div className="mt-1 flex space-x-0.5">
                      {Array.from({ length: 5 }, (_, j) => (
                        <div 
                          key={j}
                          className={`w-1 h-1 rounded-full ${isPrayingToday ? 'bg-white/70' : 'bg-primary/70'}`}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
          <h3 className="text-lg font-medium mb-3">Prayer Stats</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
              <h4 className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                Days Completed
              </h4>
              <p className="text-2xl font-semibold">21 / 30</p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
              <h4 className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                Current Streak
              </h4>
              <p className="text-2xl font-semibold">7 days</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                Best: 14 days
              </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
              <h4 className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                Most Missed
              </h4>
              <p className="text-2xl font-semibold">Fajr</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                Missed 5 times this month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}