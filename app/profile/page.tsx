import React from 'react';
import Achievements from '@/components/Achievements';

/**
 * User Profile Page
 */
export default function ProfilePage() {
  return (
    <div className="animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row">
          <div className="mb-6 md:mb-0 md:mr-6 flex flex-col items-center md:items-start">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-semibold mb-4">
              AB
            </div>
            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Edit Profile
            </button>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-poppins font-semibold mb-2">Abdullah Bakir</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Muslim since birth, focusing on improving my prayers and Quran recitation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
                <h4 className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Days Active
                </h4>
                <p className="text-2xl font-semibold">95</p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
                <h4 className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Prayer Streak
                </h4>
                <p className="text-2xl font-semibold">7 days</p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
                <h4 className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Quran Progress
                </h4>
                <p className="text-2xl font-semibold">32%</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-slate-700 dark:text-slate-300">
                  abdullah@example.com
                </span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.9999 16.9999V19.9999C21.0011 20.1135 20.9772 20.2262 20.9293 20.3312C20.8814 20.4362 20.8103 20.5308 20.7209 20.6088C20.6315 20.6869 20.5259 20.7464 20.4112 20.7838C20.2966 20.8212 20.1755 20.8356 20.0555 20.8259C16.9553 20.4784 14.0207 19.348 11.5243 17.5479C9.22054 15.9274 7.31978 13.8278 5.88973 11.3399C4.5758 8.57384 3.63402 5.48825 3.42486 2.3078C3.41624 2.18301 3.43094 2.05736 3.46867 1.93949C3.5064 1.82162 3.56626 1.71326 3.64436 1.62165C3.72246 1.53004 3.8178 1.45743 3.92377 1.4084C4.02974 1.35938 4.14375 1.33493 4.2591 1.33592H7.1591C7.36199 1.33381 7.55975 1.40163 7.72064 1.52623C7.88153 1.65084 7.99492 1.82366 8.0395 2.01592C8.12744 2.41004 8.24568 2.79738 8.39281 3.17372C8.4577 3.33686 8.47829 3.51295 8.45263 3.6848C8.42698 3.85664 8.35607 4.01732 8.24888 4.14992L7.0489 5.79992C8.37378 8.59376 10.4067 10.908 12.8845 12.4999L14.4743 11.1999C14.5978 11.0791 14.7478 10.9995 14.909 10.9695C15.0702 10.9396 15.2368 10.9605 15.3912 11.0299C15.7496 11.1997 16.1184 11.3361 16.4947 11.4379C16.6757 11.4879 16.8382 11.6006 16.958 11.7576C17.0778 11.9147 17.1479 12.1076 17.1479 12.3059V16.9999H20.9999Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-slate-700 dark:text-slate-300">
                  +1 (555) 123-4567
                </span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.6569 16.6569C16.7202 17.5935 14.7616 19.5521 13.4138 20.8999C12.6327 21.681 11.3677 21.6814 10.5866 20.9003C9.26234 19.5761 7.34159 17.6553 6.34315 16.6569C3.21895 13.5327 3.21895 8.46734 6.34315 5.34315C9.46734 2.21895 14.5327 2.21895 17.6569 5.34315C20.781 8.46734 20.781 13.5327 17.6569 16.6569Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-slate-700 dark:text-slate-300">
                  San Francisco, CA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Achievements />
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-poppins font-semibold mb-6">Settings</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h3 className="font-medium mb-1">Dark Mode</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Switch between light and dark theme
              </p>
            </div>
            <div className="w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 px-0.5 flex items-center cursor-pointer relative">
              <div className="w-5 h-5 rounded-full bg-white dark:bg-primary absolute right-0.5"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h3 className="font-medium mb-1">Prayer Notifications</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Get reminded when it's time to pray
              </p>
            </div>
            <div className="w-12 h-6 rounded-full bg-primary px-0.5 flex items-center cursor-pointer relative">
              <div className="w-5 h-5 rounded-full bg-white absolute right-0.5"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h3 className="font-medium mb-1">Quran Reading Goal</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Set your daily reading target
              </p>
            </div>
            <button className="text-primary hover:text-primary-dark font-medium text-sm">
              Edit
            </button>
          </div>
          
          <div className="flex justify-between items-center py-3">
            <div>
              <h3 className="font-medium mb-1">Data Syncing</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Sync your data across devices
              </p>
            </div>
            <div className="w-12 h-6 rounded-full bg-primary px-0.5 flex items-center cursor-pointer relative">
              <div className="w-5 h-5 rounded-full bg-white absolute right-0.5"></div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}