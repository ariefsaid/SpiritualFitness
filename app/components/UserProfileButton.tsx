'use client';

import { useState, useEffect } from 'react';
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
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data from our API endpoint when the component mounts
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProfile();
    }
  }, [isAuthenticated, user]);

  // Fetch user profile data from the server API
  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/user-profile');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }
      
      const data = await response.json();
      setProfile(data.profile);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a user profile directly using Supabase client
  const createUserProfile = async () => {
    if (!user || !supabase || !isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the user's ID and details from Clerk
      const userId = user.id;
      const email = user.primaryEmailAddress?.emailAddress || '';
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      const avatarUrl = user.imageUrl || '';
      
      // Insert a new profile in Supabase
      const { data, error: supabaseError } = await supabase
        .from('profiles')
        .insert({
          clerk_id: userId,
          email,
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (supabaseError) {
        console.error('Error creating profile:', supabaseError);
        setError(supabaseError.message);
      } else {
        setProfile(data);
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p>Please sign in to manage your profile</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-2">User Profile</h3>
      
      {isLoading ? (
        <div className="animate-pulse flex space-x-4 w-full">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500 mb-3">{error}</div>
      ) : profile ? (
        <div className="w-full">
          <div className="flex items-center mb-3">
            {profile.avatar_url && (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-12 h-12 rounded-full mr-3" 
              />
            )}
            <div>
              <p className="font-medium">{profile.first_name} {profile.last_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
            </div>
          </div>
          <div className="border-t pt-3 mt-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-green-600 dark:text-green-400">
              ✓ Profile synchronized with Supabase
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={createUserProfile}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-4 py-2 text-sm disabled:opacity-50"
        >
          Create Profile in Supabase
        </button>
      )}
      
      <button
        onClick={fetchUserProfile}
        className="mt-3 text-sm text-primary hover:underline disabled:opacity-50"
        disabled={isLoading}
      >
        Refresh Profile Data
      </button>
    </div>
  );
}