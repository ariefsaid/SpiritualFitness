import { useAchievements } from "@/hooks/use-achievements";
import { Link } from "wouter";

export default function Achievements() {
  const { achievements, isLoading } = useAchievements();

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-poppins font-semibold">Your Achievements</h2>
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 text-center border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-3 animate-pulse"></div>
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded mb-1 animate-pulse"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse"></div>
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Group achievements by type
  const achievementGroups = {
    prayer: achievements.filter(a => a.type.startsWith('prayer')),
    quran: achievements.filter(a => a.type.startsWith('quran')),
    fasting: achievements.filter(a => a.type.startsWith('fasting')),
    community: achievements.filter(a => a.type.startsWith('community'))
  };

  // Get icon based on achievement type
  const getAchievementIcon = (type: string) => {
    if (type.startsWith('prayer')) {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7V9L12 14L22 9V7L12 2Z" fill="currentColor" />
          <path d="M5 10.5V15.5L12 19.5L19 15.5V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 14V19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    } else if (type.startsWith('quran')) {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (type.startsWith('fasting')) {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5.5C10.8954 5.5 10 6.39543 10 7.5C10 8.60457 9.10457 9.5 8 9.5M12 5.5C13.1046 5.5 14 6.39543 14 7.5C14 8.60457 14.8954 9.5 16 9.5M12 5.5L12 14M12 14C10.8954 14 10 14.8954 10 16M12 14C13.1046 14 14 14.8954 14 16M8 19H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M16.6438 16.1429C15.6229 14.5234 13.9187 13.4999 12 13.4999C10.0813 13.4999 8.37708 14.5234 7.35617 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35617 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35617 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-poppins font-semibold">Your Achievements</h2>
        <Link href="/profile">
          <a className="text-primary hover:text-primary-dark text-sm font-medium">
            View All 
            <svg className="h-4 w-4 inline-block ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.slice(0, 4).map((achievement) => {
          const isCompleted = achievement.isCompleted;
          const inProgress = !isCompleted && achievement.progress > 0;
          const isLocked = !isCompleted && achievement.progress === 0;
          
          return (
            <div key={achievement.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 text-center border border-slate-200 dark:border-slate-700">
              <div className={`achievement-icon ${
                isCompleted ? 'achievement-icon-completed' : 
                inProgress ? 'achievement-icon-progress' : 
                'achievement-icon-locked'
              }`}>
                <span className={isCompleted ? 'text-primary' : inProgress ? 'text-accent' : 'text-slate-400'}>
                  {getAchievementIcon(achievement.type)}
                </span>
              </div>
              <h3 className="font-medium mb-1">{achievement.description.split(':')[0]}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {achievement.description.split(':')[1] || `Goal: ${achievement.goalThreshold}`}
              </p>
              <span className={`inline-block ${
                isCompleted ? 'achievement-badge-completed' : 
                inProgress ? 'achievement-badge-progress' : 
                'achievement-badge-locked'
              }`}>
                {isCompleted ? `Level ${achievement.level}` : 
                 inProgress ? `${Math.round((achievement.progress / achievement.goalThreshold) * 100)}%` : 
                 'Locked'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
