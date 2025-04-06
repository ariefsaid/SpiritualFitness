import { Prayer } from "@shared/schema";
import { useState } from "react";
import { formatTime, getTimeRemaining } from "@/lib/utils";

interface PrayerCardProps {
  prayer: Prayer;
  onMarkPrayed: (id: number, isJamaah: boolean) => void;
  onRemindMe: (id: number) => void;
}

export default function PrayerCard({ prayer, onMarkPrayed, onRemindMe }: PrayerCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [remainingTime, setRemainingTime] = useState(getTimeRemaining(prayer.scheduledTime));
  
  const isPrayed = prayer.status === "completed";
  const isUpcoming = prayer.status === "upcoming";
  const isActive = new Date() >= new Date(prayer.scheduledTime) && !isPrayed;
  
  return (
    <div className="prayer-card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-poppins font-semibold capitalize">{prayer.name}</h3>
        <span 
          className={`prayer-time ${isActive ? 'prayer-time-active' : isPrayed ? 'prayer-time-completed' : 'prayer-time-upcoming'}`}
        >
          {formatTime(prayer.scheduledTime)}
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {isPrayed ? 'Completed' : isActive ? 'Now' : 'Remaining'}
        </span>
        <span className="text-sm font-medium">
          {isPrayed 
            ? prayer.isJamaah ? 'In congregation' : 'On time' 
            : isActive 
              ? 'Active now' 
              : remainingTime}
        </span>
      </div>
      
      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700 flex space-x-2">
        {isPrayed ? (
          <button 
            className="prayer-action-button prayer-action-secondary"
            disabled
          >
            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Completed
          </button>
        ) : isActive ? (
          <button 
            className="prayer-action-button prayer-action-primary"
            onClick={() => onMarkPrayed(prayer.id, false)}
          >
            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Mark Prayed
          </button>
        ) : (
          <button 
            className="prayer-action-button prayer-action-secondary"
            onClick={() => onRemindMe(prayer.id)}
          >
            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Set Reminder
          </button>
        )}
        
        <button 
          className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full px-2 py-1 text-sm"
          onClick={() => setShowOptions(!showOptions)}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H5.01M12 12H12.01M19 12H19.01M6 12C6 12.5523 5.55228 13 5 13C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11C5.55228 11 6 11.4477 6 12ZM13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12ZM20 12C20 12.5523 19.5523 13 19 13C18.4477 13 18 12.5523 18 12C18 11.4477 18.4477 11 19 11C19.5523 11 20 11.4477 20 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      {showOptions && (
        <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg animate-fadeInUp">
          {!isPrayed && (
            <button 
              className="w-full text-left p-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-600 rounded-md"
              onClick={() => {
                onMarkPrayed(prayer.id, true);
                setShowOptions(false);
              }}
            >
              Mark as prayed in congregation
            </button>
          )}
          <button 
            className="w-full text-left p-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-600 rounded-md text-red-500"
            onClick={() => setShowOptions(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
