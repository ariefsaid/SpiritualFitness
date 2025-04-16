import React from 'react';
import CommunitySection from '@/components/CommunitySection';
import UserProfileButton from '@/components/UserProfileButton';
import { currentUser } from '@clerk/nextjs/server';

/**
 * Community Page - Protected by Clerk authentication
 */
export default async function CommunityPage() {
  // Get the current user (this is a server component)
  const user = await currentUser();
  return (
    <div className="animate-fade-in">
      {/* Welcome section showing user info */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg shadow-sm p-6 mb-8 border border-emerald-100 dark:border-emerald-800/40">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              Welcome, {user?.firstName || "Friend"}!
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              You're signed in as {user?.emailAddresses[0]?.emailAddress || user?.username || "authenticated user"}
            </p>
            
            {/* Button to check/create Supabase profile - demonstrates Clerk+Supabase integration */}
            <UserProfileButton />
          </div>
          <div className="client-only">
            {/* UserButton is a client component, will be rendered in a client wrapper component */}
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-600">👤</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-poppins font-semibold mb-4">Find Groups</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Connect with other Muslims around the world to strengthen your faith and build a supportive community.
        </p>
        
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Search groups..." 
            className="border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 w-full bg-white dark:bg-slate-800 pr-10"
          />
          <svg className="w-5 h-5 absolute right-3 top-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { 
              name: 'Quran Study Circle', 
              type: 'study', 
              memberCount: 24, 
              description: 'Weekly Quran discussions focusing on Tafsir'
            },
            { 
              name: 'Beginner Muslims', 
              type: 'support', 
              memberCount: 42, 
              description: 'Support group for new Muslims and those learning about Islam'
            },
            { 
              name: 'Daily Dhikr', 
              type: 'study', 
              memberCount: 18, 
              description: 'Regular remembrance of Allah through dhikr practice'
            },
            { 
              name: 'Sisters Circle', 
              type: 'support', 
              memberCount: 35, 
              description: 'Discussion group specifically for Muslim women'
            }
          ].map((group, index) => (
            <div key={index} className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-5 border border-slate-100 dark:border-slate-700">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden mr-4 bg-primary/10 flex items-center justify-center text-primary">
                  {group.type === 'study' ? (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M16.6438 16.1429C15.6229 14.5234 13.9187 13.4999 12 13.4999C10.0813 13.4999 8.37708 14.5234 7.35617 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35617 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35617 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium mb-1">{group.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{group.description}</p>
                  <div className="flex items-center text-xs">
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full">
                      {group.memberCount} members
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Join Group
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button className="border border-primary text-primary hover:bg-primary/5 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Create New Group
          </button>
        </div>
      </div>
      
      <CommunitySection />
    </div>
  );
}