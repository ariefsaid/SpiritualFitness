import { useState, useEffect } from "react";
import DashboardTabs from "@/components/DashboardTabs";
import DailyQuote from "@/components/DailyQuote";
import PrayerCard from "@/components/PrayerCard";
import FastingTracker from "@/components/FastingTracker";
import QuranProgress from "@/components/QuranProgress";
import Achievements from "@/components/Achievements";
import CommunitySection from "@/components/CommunitySection";
import { format } from "date-fns";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { prayers, createPrayer, updatePrayer, isLoading } = usePrayerTimes(currentDate);

  const handlePreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setCurrentDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const handleMarkPrayed = async (id: number, isJamaah: boolean) => {
    try {
      await updatePrayer(id, {
        status: "completed",
        completedTime: new Date(),
        isJamaah,
      });
      
      toast({
        title: "Prayer completed",
        description: isJamaah ? "Marked as prayed in congregation" : "Marked as prayed on time",
      });
      
      // Refresh prayers
      queryClient.invalidateQueries({ queryKey: ['/api/prayers/daily'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update prayer status.",
        variant: "destructive"
      });
    }
  };

  const handleSetReminder = (id: number) => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          const prayer = prayers.find(p => p.id === id);
          
          if (prayer) {
            // Schedule a notification
            const prayerTime = new Date(prayer.scheduledTime);
            const notificationTime = new Date(prayerTime.getTime() - 10 * 60000); // 10 minutes before
            
            if (notificationTime > new Date()) {
              const timeDiff = notificationTime.getTime() - new Date().getTime();
              
              setTimeout(() => {
                new Notification(`Time for ${prayer.name} prayer`, {
                  body: `It's almost time for ${prayer.name} prayer. Prepare yourself.`,
                  icon: '/icons/icon-192.png'
                });
              }, timeDiff);
              
              toast({
                title: "Reminder set",
                description: `You'll be notified 10 minutes before ${prayer.name} prayer.`
              });
            } else {
              toast({
                title: "Cannot set reminder",
                description: "The prayer time has already passed.",
                variant: "destructive"
              });
            }
          }
        } else {
          toast({
            title: "Permission denied",
            description: "Please enable notifications to receive prayer reminders.",
            variant: "destructive"
          });
        }
      });
    } else {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <DashboardTabs />
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-poppins font-semibold">Daily Overview</h2>
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-sm">
            <button 
              className="text-slate-400 hover:text-slate-500 mr-2"
              onClick={handlePreviousDay}
              aria-label="Previous day"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="font-medium">
              {format(currentDate, "MMMM d, yyyy")}
            </span>
            <button 
              className="text-slate-400 hover:text-slate-500 ml-2"
              onClick={handleNextDay}
              aria-label="Next day"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <DailyQuote />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {isLoading ? (
            // Loading skeleton
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="prayer-card animate-pulse">
                <div className="flex justify-between items-center mb-3">
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700 flex space-x-2">
                  <div className="h-8 flex-grow bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                </div>
              </div>
            ))
          ) : prayers.length > 0 ? (
            prayers.map((prayer) => (
              <PrayerCard 
                key={prayer.id} 
                prayer={prayer} 
                onMarkPrayed={handleMarkPrayed} 
                onRemindMe={handleSetReminder} 
              />
            ))
          ) : (
            <div className="prayer-card col-span-full">
              <div className="text-center py-6">
                <svg className="w-12 h-12 mx-auto text-slate-400 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 9.00024L10.75 11.7502C10.7502 11.7505 10.7498 11.7505 10.75 11.7502L16 6.50024M9 16.0002H15M3 12.0002C3 16.9707 7.02944 21.0002 12 21.0002C16.9706 21.0002 21 16.9707 21 12.0002C21 7.02969 16.9706 3.00024 12 3.00024C7.02944 3.00024 3 7.02969 3 12.0002Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-slate-600 dark:text-slate-300">No prayers scheduled for this day.</p>
                <button 
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-lg"
                  onClick={() => {
                    // Reset to today
                    setCurrentDate(new Date());
                  }}
                >
                  View Today's Prayers
                </button>
              </div>
            </div>
          )}
        </div>
        
        <FastingTracker />
      </div>
      
      <QuranProgress />
      
      <Achievements />
      
      <CommunitySection />
    </>
  );
}
