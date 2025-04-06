import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { User } from '@shared/schema';
import { useAchievements } from '@/hooks/use-achievements';
import DashboardTabs from '@/components/DashboardTabs';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements'>('profile');
  
  const { data: currentUser, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['/api/user/current'],
    queryFn: async () => {
      return apiRequest('GET', '/api/user/current');
    }
  });
  
  const { 
    achievements,
    prayerAchievements,
    quranAchievements,
    fastingAchievements,
    communityAchievements,
    isLoading: isLoadingAchievements
  } = useAchievements();

  const isLoading = isLoadingUser || isLoadingAchievements;

  const totalXp = achievements.reduce((sum, achievement) => sum + achievement.xpValue, 0);
  const level = Math.floor(totalXp / 100) + 1;
  const xpToNextLevel = 100 - (totalXp % 100);
  const progressPercentage = ((totalXp % 100) / 100) * 100;
  
  return (
    <>
      <DashboardTabs />
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-poppins font-semibold">Profile</h2>
          <div className="flex space-x-2 bg-white dark:bg-slate-800 rounded-md overflow-hidden shadow-sm">
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'profile' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'achievements' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300'}`}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 animate-pulse">
              <div className="flex items-center mb-6">
                <div className="rounded-full bg-slate-200 dark:bg-slate-700 w-20 h-20 mr-4"></div>
                <div>
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center py-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded mr-2"></div>
                    <div className="flex-grow h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'profile' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              {currentUser && (
                <>
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl font-semibold text-primary">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-1">{currentUser.name}</h3>
                      <p className="text-slate-500 dark:text-slate-400">@{currentUser.username}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <div className="text-sm">Level {level}</div>
                      <div className="text-sm">{totalXp} XP</div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
                      {xpToNextLevel} XP to next level
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">Email</span>
                      <span>{currentUser.email}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">Joined</span>
                      <span>{new Date(currentUser.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">Achievements</span>
                      <span>{achievements.length}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">Last active</span>
                      <span>{new Date(currentUser.lastLoginAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-poppins font-semibold text-lg mb-4">Stats Overview</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {prayerAchievements.length}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Prayer achievements
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {quranAchievements.length}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Quran achievements
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {fastingAchievements.length}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Fasting achievements
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {communityAchievements.length}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Community achievements
                  </div>
                </div>
              </div>
              
              <h4 className="font-medium text-md mb-3">Recent Activity</h4>
              
              <div className="space-y-3">
                {achievements.slice(0, 5).map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className="flex items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.9083 18.3665C14.5057 18.4358 14.0783 18.2739 13.829 17.9397L12.161 15.7013C12.0936 15.6118 11.9083 15.6118 11.841 15.7013L10.1849 17.9397C9.93567 18.2739 9.50827 18.4358 9.10564 18.3665C8.69358 18.2972 8.35788 18.0086 8.21472 17.6078L7.7542 16.0965C7.73097 16.0253 7.65677 15.9866 7.59133 16.0082L5.30137 16.7824C4.73151 16.9665 4.10332 16.7541 3.76763 16.2549C3.423 15.7491 3.46945 15.0922 3.87207 14.6318L8.64086 9.03181C10.0783 7.33442 12.9217 7.33442 14.3708 9.03181L19.1279 14.6318C19.5306 15.0922 19.577 15.7491 19.2324 16.2549C18.8967 16.7541 18.2685 16.9665 17.6986 16.7824L15.4087 16.0082C15.3432 15.9866 15.269 16.0253 15.2458 16.0965L14.7853 17.6078C14.6421 18.0086 14.3064 18.2972 13.8944 18.3665H14.9083Z" fill="currentColor"/>
                        <path d="M9.10564 18.3665C8.69358 18.2972 8.35788 18.0086 8.21472 17.6078L7.7542 16.0965C7.73097 16.0253 7.65677 15.9866 7.59133 16.0082L5.30137 16.7824C4.73151 16.9665 4.10332 16.7541 3.76763 16.2549C3.423 15.7491 3.46945 15.0922 3.87207 14.6318L8.64086 9.03181C10.0783 7.33442 12.9217 7.33442 14.3708 9.03181L19.1279 14.6318C19.5306 15.0922 19.577 15.7491 19.2324 16.2549C18.8967 16.7541 18.2685 16.9665 17.6986 16.7824L15.4087 16.0082C15.3432 15.9866 15.269 16.0253 15.2458 16.0965L14.7853 17.6078C14.6421 18.0086 14.3064 18.2972 13.8944 18.3665" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">{achievement.title}</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {achievement.description} • +{achievement.xpValue} XP
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                
                {achievements.length === 0 && (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p>You haven't earned any achievements yet.</p>
                    <p className="mt-2">Complete prayers, read Quran, and fast to earn achievements!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 md:col-span-3">
              <h3 className="font-poppins font-semibold text-lg mb-6">All Achievements</h3>
              
              <div className="mb-6">
                <h4 className="font-medium text-md mb-4 flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Prayer Achievements
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prayerAchievements.length > 0 ? (
                    prayerAchievements.map((achievement) => (
                      <div key={achievement.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm">{achievement.title}</h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            +{achievement.xpValue} XP
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="sm:col-span-2 lg:col-span-3 text-center py-6 text-slate-500 dark:text-slate-400">
                      <p>No prayer achievements yet.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-md mb-4 flex items-center">
                  <svg className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Quran Achievements
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quranAchievements.length > 0 ? (
                    quranAchievements.map((achievement) => (
                      <div key={achievement.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                          <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm">{achievement.title}</h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            +{achievement.xpValue} XP
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="sm:col-span-2 lg:col-span-3 text-center py-6 text-slate-500 dark:text-slate-400">
                      <p>No Quran achievements yet.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-md mb-4 flex items-center">
                  <svg className="h-5 w-5 text-amber-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5.5C10.8954 5.5 10 6.39543 10 7.5C10 8.60457 9.10457 9.5 8 9.5M12 5.5C13.1046 5.5 14 6.39543 14 7.5C14 8.60457 14.8954 9.5 16 9.5M12 5.5L12 14M12 14C10.8954 14 10 14.8954 10 16M12 14C13.1046 14 14 14.8954 14 16M8 19H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Fasting Achievements
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fastingAchievements.length > 0 ? (
                    fastingAchievements.map((achievement) => (
                      <div key={achievement.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mr-3">
                          <svg className="h-5 w-5 text-amber-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5.5C10.8954 5.5 10 6.39543 10 7.5C10 8.60457 9.10457 9.5 8 9.5M12 5.5C13.1046 5.5 14 6.39543 14 7.5C14 8.60457 14.8954 9.5 16 9.5M12 5.5L12 14M12 14C10.8954 14 10 14.8954 10 16M12 14C13.1046 14 14 14.8954 14 16M8 19H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm">{achievement.title}</h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            +{achievement.xpValue} XP
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="sm:col-span-2 lg:col-span-3 text-center py-6 text-slate-500 dark:text-slate-400">
                      <p>No fasting achievements yet.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-md mb-4 flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M16.6438 16.1429C15.6229 14.5234 13.9187 13.4999 12 13.4999C10.0813 13.4999 8.37708 14.5234 7.35617 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35617 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35617 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Community Achievements
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {communityAchievements.length > 0 ? (
                    communityAchievements.map((achievement) => (
                      <div key={achievement.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                          <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M16.6438 16.1429C15.6229 14.5234 13.9187 13.4999 12 13.4999C10.0813 13.4999 8.37708 14.5234 7.35617 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35617 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35617 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm">{achievement.title}</h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            +{achievement.xpValue} XP
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="sm:col-span-2 lg:col-span-3 text-center py-6 text-slate-500 dark:text-slate-400">
                      <p>No community achievements yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}