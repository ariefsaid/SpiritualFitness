import { useState } from "react";
import { useFasting } from "@/hooks/use-fasting";
import { Fasting } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { format, isSameDay } from "date-fns";

function calculateProgress(fastings: Fasting[], goal: number): number {
  if (!fastings.length || !goal) return 0;
  const completedFastings = fastings.filter(f => f.isCompleted).length;
  return Math.round((completedFastings / goal) * 100);
}

export default function FastingTracker() {
  const { fastings, createFasting, updateFasting, isLoading } = useFasting();
  const [newFasting, setNewFasting] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    type: "voluntary"
  });
  
  // Monthly goal is 6 days (common voluntary fasting goal)
  const monthlyGoal = 6;
  const progress = calculateProgress(fastings, monthlyGoal);
  const completedFastings = fastings.filter(f => f.isCompleted);
  
  const handleTrackFasting = () => {
    createFasting({
      date: new Date(newFasting.date),
      type: newFasting.type,
      isCompleted: true,
      notes: ""
    });
  };
  
  const fastingTypes = [
    { value: "voluntary", label: "Voluntary Fast" },
    { value: "monday", label: "Monday Fast" },
    { value: "thursday", label: "Thursday Fast" },
    { value: "ayyamBeed", label: "Ayyam al-Beed (White Days)" },
    { value: "ashura", label: "Ashura" },
    { value: "arafah", label: "Day of Arafah" }
  ];

  const isFastingToday = fastings.some(f => 
    isSameDay(new Date(f.date), new Date()) && f.isCompleted
  );
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-6 border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-poppins font-semibold text-lg">Fasting</h3>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-primary text-white rounded-full px-4 py-1 text-sm font-medium">
                <svg className="h-4 w-4 inline-block mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V12M12 12V18M12 12H18M12 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Track
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Track Fasting</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={newFasting.date}
                    onChange={(e) => setNewFasting({ ...newFasting, date: e.target.value })}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={newFasting.type}
                    onChange={(e) => setNewFasting({ ...newFasting, type: e.target.value })}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md"
                  >
                    {fastingTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <button className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-md">
                    Cancel
                  </button>
                </DialogClose>
                <DialogClose asChild>
                  <button 
                    className="bg-primary text-white px-4 py-2 rounded-md"
                    onClick={handleTrackFasting}
                  >
                    Save
                  </button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <div className="w-1/4 pr-4">
          <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24">
              <circle cx="48" cy="48" r="36" fill="none" stroke="#E2E8F0" strokeWidth="8"></circle>
              <circle 
                cx="48" 
                cy="48" 
                r="36" 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="8" 
                strokeDasharray="226.1" 
                strokeDashoffset={226.1 - (226.1 * progress / 100)} 
                transform="rotate(-90 48 48)"
              ></circle>
            </svg>
            <div className="absolute text-center">
              <span className="block text-2xl font-semibold">{progress}%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Progress</span>
            </div>
          </div>
        </div>
        <div className="w-3/4">
          <h4 className="font-medium mb-2">{format(new Date(), "MMMM")} Fasting Goal</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
            You've fasted {completedFastings.length} days out of your goal of {monthlyGoal} days this month.
          </p>
          <div className="flex flex-wrap gap-2">
            {completedFastings.some(f => f.type === "monday") && (
              <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full">Monday Fast ✓</span>
            )}
            {completedFastings.some(f => f.type === "thursday") && (
              <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full">Thursday Fast ✓</span>
            )}
            {completedFastings.some(f => f.type === "ayyamBeed") ? (
              <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full">Ayyam al-Beed ✓</span>
            ) : (
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-full">Ayyam al-Beed</span>
            )}
          </div>
          
          {isFastingToday && (
            <div className="mt-4 bg-primary/10 p-2 rounded-md text-sm text-primary animate-fadeInUp">
              You're fasting today! MashaAllah, keep it up.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
