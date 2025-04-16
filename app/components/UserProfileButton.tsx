'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSupabase } from '@/hooks/use-supabase';

/**
 * Example component that shows how to use the useSupabase hook
 * to fetch user profile data from Supabase with Clerk authentication
 */
export default function UserProfileButton() {
  const { user } = useUser();
  const { supabase, loading, isAuthenticated } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [profileExists, setProfileExists] = useState<boolean | null>(null);

  const checkUserProfile = async () => {
    if (!user || !supabase || !isAuthenticated) return;
    
    setIsLoading(true);
    try {
      // Get the user's ID from Clerk
      const userId = user.id;
      
      // Query the profiles table in Supabase to check if a profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error checking profile:', error);
        setProfileExists(false);
      } else {
        setProfileExists(!!data);
      }
    } catch (error) {
      console.error('Error:', error);
      setProfileExists(false);
    } finally {
      setIsLoading(false);
    }
  };

  const createUserProfile = async () => {
    if (!user || !supabase || !isAuthenticated) return;
    
    setIsLoading(true);
    try {
      // Get the user's ID and details from Clerk
      const userId = user.id;
      const displayName = user.fullName || user.username || 'New User';
      const avatarUrl = user.imageUrl || '';
      
      // Insert a new profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          display_name: displayName,
          avatar_url: avatarUrl,
          bio: ''
        });
      
      if (error) {
        console.error('Error creating profile:', error);
      } else {
        setProfileExists(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        onClick={profileExists === null ? checkUserProfile : createUserProfile}
        disabled={isLoading || loading}
        className="bg-primary hover:bg-primary-dark text-white font-medium rounded-lg px-4 py-2 text-sm disabled:opacity-50"
      >
        {isLoading || loading
          ? 'Loading...'
          : profileExists === null
          ? 'Check Profile'
          : profileExists
          ? 'Profile Exists'
          : 'Create Profile'}
      </button>
      
      {profileExists && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Your profile is synced with Supabase
        </p>
      )}
    </div>
  );
}