'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommunityGroup, Challenge, UserGroupMembership } from "@shared/schema";
import { differenceInDays } from "date-fns";

// This will be replaced by a proper API client function
const apiRequest = async <T,>(method: string, url: string, data?: any): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

export default function CommunitySection() {
  const queryClient = useQueryClient();
  
  const { data: challenges, isLoading: isLoadingChallenges } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges'],
    queryFn: async () => {
      return apiRequest<Challenge[]>('GET', '/api/challenges');
    }
  });

  const { data: groups, isLoading: isLoadingGroups } = useQuery<CommunityGroup[]>({
    queryKey: ['/api/community/groups'],
    queryFn: async () => {
      return apiRequest<CommunityGroup[]>('GET', '/api/community/groups');
    }
  });

  const { data: memberships, isLoading: isLoadingMemberships } = useQuery<UserGroupMembership[]>({
    queryKey: ['/api/community/memberships/user'],
    queryFn: async () => {
      return apiRequest<UserGroupMembership[]>('GET', '/api/community/memberships/user');
    }
  });

  // Find user's groups based on memberships
  const userGroups = groups?.filter(group => 
    memberships?.some(membership => membership.groupId === group.id)
  ) || [];

  const activeChallenges = challenges?.filter(challenge => 
    new Date(challenge.endDate) > new Date()
  ).slice(0, 2) || [];

  // Join a challenge
  const joinChallenge = async (challengeId: number) => {
    try {
      await apiRequest('POST', '/api/challenges/join', { challengeId });
      // Refetch challenges
      queryClient.invalidateQueries({ queryKey: ['/api/challenges'] });
    } catch (error) {
      console.error("Error joining challenge:", error);
    }
  };

  if (isLoadingChallenges || isLoadingGroups || isLoadingMemberships) {
    return (
      <div className="mt-8">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md mb-4"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse mr-4"></div>
                  <div className="flex-grow">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md mb-4"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mr-4"></div>
                  <div className="flex-grow">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-poppins font-semibold">Community</h2>
        <Link href="/community" className="text-primary hover:text-primary-dark text-sm font-medium">
          Find Groups 
          <svg className="h-4 w-4 inline-block ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="font-poppins font-semibold text-lg mb-4">Active Challenges</h3>
          
          {activeChallenges.length > 0 ? (
            activeChallenges.map((challenge) => {
              const daysLeft = differenceInDays(new Date(challenge.endDate), new Date());
              const isJoined = false; // This would come from actual user data
              
              return (
                <div key={challenge.id} className="community-group-card">
                  <div className={`community-group-icon ${challenge.challengeType === 'quran' ? 'bg-primary/10' : 'bg-accent/10'}`}>
                    {challenge.challengeType === 'quran' ? (
                      <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5.5C10.8954 5.5 10 6.39543 10 7.5C10 8.60457 9.10457 9.5 8 9.5M12 5.5C13.1046 5.5 14 6.39543 14 7.5C14 8.60457 14.8954 9.5 16 9.5M12 5.5L12 14M12 14C10.8954 14 10 14.8954 10 16M12 14C13.1046 14 14 14.8954 14 16M8 19H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium mb-1">{challenge.name}</h4>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        <svg className="h-3 w-3 inline-block mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M16.6438 16.1429C15.6229 14.5234 13.9187 13.4999 12 13.4999C10.0813 13.4999 8.37708 14.5234 7.35617 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35617 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35617 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {challenge.participants} participants
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        <svg className="h-3 w-3 inline-block mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {daysLeft} days left
                      </span>
                    </div>
                  </div>
                  <button 
                    className={`text-xs rounded-full px-3 py-1 ${isJoined ? 
                      'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 
                      'bg-primary text-white'}`}
                    onClick={() => !isJoined && joinChallenge(challenge.id)}
                    disabled={isJoined}
                  >
                    {isJoined ? 'Joined' : 'Join'}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <p>No active challenges at the moment.</p>
              <Link href="/community" className="text-primary hover:underline mt-2 inline-block">
                Create a new challenge
              </Link>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="font-poppins font-semibold text-lg mb-4">Your Study Groups</h3>
          
          {userGroups.length > 0 ? (
            userGroups.map((group, index) => (
              <div key={group.id} 
                className={`community-group-card ${index < userGroups.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden mr-4 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  {group.type === 'study' ? (
                    <svg className="h-6 w-6 text-slate-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-slate-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M16.6438 16.1429C15.6229 14.5234 13.9187 13.4999 12 13.4999C10.0813 13.4999 8.37708 14.5234 7.35617 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35617 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35617 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium mb-1">{group.name}</h4>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      <svg className="h-3 w-3 inline-block mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M16.6438 16.1429C15.6229 14.5234 13.9187 13.4999 12 13.4999C10.0813 13.4999 8.37708 14.5234 7.35617 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35617 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35617 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {group.memberCount} members
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      <svg className="h-3 w-3 inline-block mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Meets on {group.meetingDay || 'N/A'}
                    </span>
                  </div>
                </div>
                {index === 0 && (
                  <span className="bg-accent/10 text-accent text-xs rounded-full px-2 py-1">
                    New Activity
                  </span>
                )}
                {index > 0 && (
                  <Link href={`/community/groups/${group.id}`} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full px-3 py-1">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <p>You're not a member of any study groups yet.</p>
              <Link href="/community" className="text-primary hover:underline mt-2 inline-block">
                Find a group to join
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}