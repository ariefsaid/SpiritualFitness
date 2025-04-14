'use client';

import { useState, useEffect } from 'react';

interface CommunityPost {
  id: number;
  userId: number;
  username: string;
  userAvatar?: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  tags?: string[];
}

export default function CommunitySection() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchPosts() {
      try {
        // Simulate API call with a fixed response for now
        setTimeout(() => {
          setPosts([
            {
              id: 1,
              userId: 2,
              username: "Ahmad Hassan",
              userAvatar: "AH",
              content: "Just completed a 30-day Quran challenge! Alhamdulillah for the opportunity to connect with the words of Allah. Anyone else working on their Quran goals this month?",
              likes: 24,
              comments: 8,
              createdAt: "2025-04-12T09:30:00Z",
              tags: ["quran", "challenge"]
            },
            {
              id: 2,
              userId: 3,
              username: "Fatima Zahra",
              userAvatar: "FZ",
              content: "Sisters, anyone joining the virtual Tafsir class this weekend? We'll be discussing Surah Al-Kahf and its lessons for our daily lives. Let me know if you're interested!",
              likes: 15,
              comments: 6,
              createdAt: "2025-04-13T14:15:00Z",
              tags: ["tafsir", "learning"]
            },
            {
              id: 3,
              userId: 4,
              username: "Yusuf Ali",
              userAvatar: "YA",
              content: "Started using this app a month ago and my prayer consistency has improved so much! The reminders and tracking really help keep me accountable. JazakAllah khair to the developers!",
              likes: 31,
              comments: 4,
              createdAt: "2025-04-14T07:45:00Z"
            }
          ]);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching community posts:', error);
        setIsLoading(false);
      }
    }
    
    fetchPosts();
  }, []);
  
  const likePost = (postId: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      )
    );
  };
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
        <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4"></div>
        <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-poppins font-semibold">Community Feed</h2>
        <button className="text-primary hover:text-primary-dark text-sm font-medium flex items-center">
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          New Post
        </button>
      </div>
      
      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="What's on your mind today?" 
          className="border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 w-full bg-white dark:bg-slate-800"
        />
      </div>
      
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="border-b border-slate-100 dark:border-slate-700 pb-6 last:border-0 last:pb-0">
            <div className="flex mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                <span className="font-semibold">{post.userAvatar || post.username.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-medium">{post.username}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            <p className="text-slate-700 dark:text-slate-300 mb-3">
              {post.content}
            </p>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap mb-3">
                {post.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full mr-2 mb-1"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <button 
                className="flex items-center text-slate-500 dark:text-slate-400 hover:text-primary"
                onClick={() => likePost(post.id)}
              >
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 11V19C7 19.5304 6.78929 20.0391 6.41421 20.4142C6.03914 20.7893 5.53043 21 5 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V11C1 10.4696 1.21071 9.96086 1.58579 9.58579C1.96086 9.21071 2.46957 9 3 9H5C5.53043 9 6.03914 9.21071 6.41421 9.58579C6.78929 9.96086 7 10.4696 7 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21.0272 9.5C21.3415 9.75528 21.5886 10.0821 21.7462 10.4507C21.9038 10.8193 21.9667 11.2194 21.9302 11.616L20.9302 19.616C20.8599 20.3659 20.4918 21.0612 19.9088 21.5721C19.3258 22.083 18.5698 22.3725 17.8152 22.388H11.3302C10.9567 22.3878 10.5854 22.3295 10.2302 22.215L7.00018 21M7.00018 11V7C7.00018 5.93913 7.42161 4.92172 8.17175 4.17157C8.9219 3.42143 9.93931 3 11.0002 3C11.5306 3 12.0393 3.21071 12.4144 3.58579C12.7894 3.96086 13.0002 4.46957 13.0002 5V11H21.0272Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {post.likes}
              </button>
              
              <button className="flex items-center text-slate-500 dark:text-slate-400 hover:text-primary">
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {post.comments}
              </button>
              
              <button className="flex items-center text-slate-500 dark:text-slate-400 hover:text-primary ml-auto">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 6L12 2L8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 text-center">
        <button className="text-primary hover:text-primary-dark text-sm font-medium">
          View More Posts
        </button>
      </div>
    </div>
  );
}