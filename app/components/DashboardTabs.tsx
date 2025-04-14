'use client';

import { useState } from 'react';

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState('prayers');
  
  const tabs = [
    { id: 'prayers', label: 'Prayers' },
    { id: 'fasting', label: 'Fasting' },
    { id: 'workout', label: 'Physical' }
  ];
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`pb-3 px-4 font-medium text-sm ${
              activeTab === tab.id 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {activeTab === 'prayers' && (
        <div>
          <h3 className="text-lg font-medium mb-5">Today's Prayers</h3>
          <div className="space-y-4">
            {[
              { name: 'Fajr', time: '5:17 AM', completed: true },
              { name: 'Dhuhr', time: '12:30 PM', completed: true },
              { name: 'Asr', time: '3:45 PM', completed: false },
              { name: 'Maghrib', time: '6:23 PM', completed: false },
              { name: 'Isha', time: '7:45 PM', completed: false }
            ].map((prayer, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  prayer.completed 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-100 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    prayer.completed 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {prayer.completed ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{prayer.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {prayer.time}
                    </p>
                  </div>
                </div>
                
                <button 
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium ${
                    prayer.completed 
                      ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {prayer.completed ? 'Completed' : 'Track'}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Today's Progress</h4>
              <span className="text-slate-500 dark:text-slate-400 text-sm">2/5 completed</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full">
              <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'fasting' && (
        <div>
          <h3 className="text-lg font-medium mb-5">Fasting Tracker</h3>
          
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 rounded-lg p-5 mb-6">
            <div className="flex justify-between mb-4">
              <div>
                <h4 className="font-medium mb-1">Monday, April 14</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Non-obligatory fasting day
                </p>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg px-3 py-1 text-sm font-medium">
                In Progress
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Start</p>
                <p className="font-medium">5:15 AM</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">End</p>
                <p className="font-medium">7:23 PM</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Duration</p>
                <p className="font-medium">14h 8m</p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Edit
              </button>
              
              <button className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Complete Fast
              </button>
            </div>
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
            <h4 className="font-medium mb-3">Monthly Stats</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Days Fasted
                </p>
                <p className="text-2xl font-semibold">8</p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Average Duration
                </p>
                <p className="text-2xl font-semibold">13h 45m</p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Longest Fast
                </p>
                <p className="text-2xl font-semibold">16h 12m</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'workout' && (
        <div>
          <h3 className="text-lg font-medium mb-5">Physical Activities</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { title: 'Morning Run', category: 'Cardio', time: '28 minutes', completed: true },
              { title: 'Prayer Movement', category: 'Strength', time: '15 minutes', completed: false }
            ].map((workout, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{workout.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {workout.category} • {workout.time}
                    </p>
                  </div>
                  
                  <div className={`rounded-full h-6 px-2 text-xs flex items-center font-medium ${
                    workout.completed 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {workout.completed ? 'Completed' : 'Planned'}
                  </div>
                </div>
                
                <div className="flex">
                  <button className={`text-sm font-medium mr-3 ${
                    workout.completed
                      ? 'text-slate-500 dark:text-slate-400'
                      : 'text-primary'
                  }`}>
                    {workout.completed ? 'View Details' : 'Start Workout'}
                  </button>
                  
                  {!workout.completed && (
                    <button className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Reschedule
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700 mb-6">
            <h4 className="font-medium mb-3">Weekly Summary</h4>
            <div className="grid grid-cols-7 gap-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-center">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{day}</div>
                  <div className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    i < 3 
                      ? 'bg-primary text-white' 
                      : i === 3 
                        ? 'bg-primary/10 text-primary border border-primary/30' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {i < 3 && (
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full">
            Add New Workout
          </button>
        </div>
      )}
    </div>
  );
}