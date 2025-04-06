import { useState } from 'react';
import DashboardTabs from '@/components/DashboardTabs';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { CommunityGroup, Challenge, UserGroupMembership } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';
import { format, differenceInDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function Community() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'groups' | 'challenges'>('groups');
  
  const { data: groups = [], isLoading: isLoadingGroups } = useQuery<CommunityGroup[]>({
    queryKey: ['/api/community/groups'],
  });

  const { data: memberships = [], isLoading: isLoadingMemberships } = useQuery<UserGroupMembership[]>({
    queryKey: ['/api/community/memberships/user'],
  });

  const { data: challenges = [], isLoading: isLoadingChallenges } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges'],
  });

  // Join a group mutation
  const joinGroupMutation = useMutation({
    mutationFn: async (groupId: number) => {
      return apiRequest('POST', '/api/community/join', { groupId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/memberships/user'] });
      toast({
        title: 'Success',
        description: 'You have joined the group!',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to join the group.',
        variant: 'destructive',
      });
    }
  });

  // Join a challenge mutation
  const joinChallengeMutation = useMutation({
    mutationFn: async (challengeId: number) => {
      return apiRequest('POST', '/api/challenges/join', { challengeId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/challenges'] });
      toast({
        title: 'Success',
        description: 'You have joined the challenge!',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to join the challenge.',
        variant: 'destructive',
      });
    }
  });

  // Get joined groups
  const joinedGroupIds = memberships.map(m => m.groupId);
  const userGroups = groups.filter(group => joinedGroupIds.includes(group.id));
  const availableGroups = groups.filter(group => !joinedGroupIds.includes(group.id));

  // Filter active challenges
  const activeChallenges = challenges.filter(challenge => 
    new Date(challenge.endDate) > new Date()
  );

  // Handle join group
  const handleJoinGroup = (groupId: number) => {
    joinGroupMutation.mutate(groupId);
  };

  // Handle join challenge
  const handleJoinChallenge = (challengeId: number) => {
    joinChallengeMutation.mutate(challengeId);
  };

  const isLoading = isLoadingGroups || isLoadingMemberships || isLoadingChallenges;

  return (
    <>
      <DashboardTabs />
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-poppins font-semibold">Community</h2>
          <div className="flex space-x-2 bg-white dark:bg-slate-800 rounded-md overflow-hidden shadow-sm">
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'groups' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300'}`}
              onClick={() => setActiveTab('groups')}
            >
              Groups
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'challenges' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300'}`}
              onClick={() => setActiveTab('challenges')}
            >
              Challenges
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 animate-pulse">
                <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg mr-4"></div>
                      <div className="flex-grow">
                        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'groups' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-poppins font-semibold text-lg mb-4">Your Groups</h3>
              
              {userGroups.length > 0 ? (
                <div className="space-y-4">
                  {userGroups.map((group) => (
                    <div key={group.id} className="community-group-card">
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
                            {group.meetingDay || 'No schedule'}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="bg-primary/10 text-primary text-xs rounded-full px-3 py-1"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <p>You haven't joined any groups yet.</p>
                  <p className="mt-2">Join a group from the list below.</p>
                </div>
              )}
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-poppins font-semibold text-lg mb-4">Available Groups</h3>
              
              {availableGroups.length > 0 ? (
                <div className="space-y-4">
                  {availableGroups.map((group) => (
                    <div key={group.id} className="community-group-card">
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
                          {group.description && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="truncate max-w-[120px]">{group.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button 
                        className="bg-primary text-white text-xs rounded-full px-3 py-1"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <p>No available groups to join.</p>
                  <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm">
                    Create a Group
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-poppins font-semibold text-lg mb-4">Active Challenges</h3>
              
              {activeChallenges.length > 0 ? (
                <div className="space-y-4">
                  {activeChallenges.map((challenge) => {
                    const daysLeft = differenceInDays(new Date(challenge.endDate), new Date());
                    const isJoined = false; // This would be based on actual user data
                    
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
                          onClick={() => !isJoined && handleJoinChallenge(challenge.id)}
                          disabled={isJoined}
                        >
                          {isJoined ? 'Joined' : 'Join'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <p>No active challenges at the moment.</p>
                  <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm">
                    Create a Challenge
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-poppins font-semibold text-lg mb-4">Past Challenges</h3>
              
              <div className="space-y-4">
                <div className="community-group-card">
                  <div className="community-group-icon bg-primary/10">
                    <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium mb-1">Complete One Juz in a Week</h4>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <span>42 participants</span>
                      <span className="mx-2">•</span>
                      <span>Completed March 2023</span>
                    </div>
                  </div>
                  <span className="bg-green-500/10 text-green-500 text-xs rounded-full px-3 py-1">
                    Completed
                  </span>
                </div>
                
                <div className="community-group-card">
                  <div className="community-group-icon bg-accent/10">
                    <svg className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5.5C10.8954 5.5 10 6.39543 10 7.5C10 8.60457 9.10457 9.5 8 9.5M12 5.5C13.1046 5.5 14 6.39543 14 7.5C14 8.60457 14.8954 9.5 16 9.5M12 5.5L12 14M12 14C10.8954 14 10 14.8954 10 16M12 14C13.1046 14 14 14.8954 14 16M8 19H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium mb-1">Ramadan Fasting Challenge</h4>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <span>127 participants</span>
                      <span className="mx-2">•</span>
                      <span>Completed April 2023</span>
                    </div>
                  </div>
                  <span className="bg-green-500/10 text-green-500 text-xs rounded-full px-3 py-1">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}