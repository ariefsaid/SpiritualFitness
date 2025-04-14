import React from 'react';
import Achievements from '@/components/Achievements';

/**
 * User Profile Page
 */
export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-poppins font-bold mb-8">My Profile</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
            <span className="text-primary text-2xl font-semibold">AB</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-1">Abdullah</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-2">
              Joined April 2023
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                25 day streak
              </span>
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-full">
                Level 3
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <Achievements />
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-poppins font-semibold mb-4">Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Toggle between light and dark mode
              </p>
            </div>
            <div>
              <button className="bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg text-sm">
                Dark Mode
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h3 className="font-medium">Notifications</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Prayer time reminders
              </p>
            </div>
            <div>
              <button className="bg-primary px-3 py-2 rounded-lg text-white text-sm">
                Enabled
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}