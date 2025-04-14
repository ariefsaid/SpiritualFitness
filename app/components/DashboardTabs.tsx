'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState('prayers');
  
  // Placeholder data - would come from API in real implementation
  const prayers = [
    { id: 1, name: 'Fajr', time: '05:30 AM', completed: true },
    { id: 2, name: 'Dhuhr', time: '12:30 PM', completed: true },
    { id: 3, name: 'Asr', time: '03:45 PM', completed: false },
    { id: 4, name: 'Maghrib', time: '06:15 PM', completed: false },
    { id: 5, name: 'Isha', time: '07:45 PM', completed: false }
  ];
  
  const fastingDays = [
    { day: 'Monday', status: 'completed' },
    { day: 'Thursday', status: 'upcoming' }
  ];
  
  const prayersCompleted = prayers.filter(prayer => prayer.completed).length;
  const todayProgress = Math.round((prayersCompleted / prayers.length) * 100);
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-5">
        <button
          className={`pb-3 px-4 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'prayers'
              ? 'border-primary text-primary dark:border-primary'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('prayers')}
        >
          Daily Prayers
        </button>
        <button
          className={`pb-3 px-4 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'fasting'
              ? 'border-primary text-primary dark:border-primary'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('fasting')}
        >
          Fasting
        </button>
      </div>
      
      {activeTab === 'prayers' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold mb-1">Today's Prayers</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {prayersCompleted} of {prayers.length} completed
              </p>
            </div>
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 text-primary border-4 border-primary/20">
              <span className="text-lg font-bold">{todayProgress}%</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {prayers.map(prayer => (
              <div key={prayer.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${prayer.completed ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                  <span className="font-medium">{prayer.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400 mr-4">{prayer.time}</span>
                  <button 
                    className={`px-3 py-1 text-xs rounded-full ${
                      prayer.completed 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {prayer.completed ? 'Completed' : 'Mark Done'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-5 flex justify-end">
            <Link 
              href="/calendar" 
              className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
            >
              View Prayer History
              <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      )}
      
      {activeTab === 'fasting' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold mb-1">Optional Fasting</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Track your voluntary fasting days
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {fastingDays.map((day, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${day.status === 'completed' ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                  <span className="font-medium">{day.day}</span>
                </div>
                <div className="flex items-center">
                  <button 
                    className={`px-3 py-1 text-xs rounded-full ${
                      day.status === 'completed' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {day.status === 'completed' ? 'Completed' : 'Upcoming'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Add Fasting Day
            </button>
          </div>
        </div>
      )}
    </div>
  );
}