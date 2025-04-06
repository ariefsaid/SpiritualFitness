import { useEffect, useState } from "react";

export default function OfflineIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="offline-indicator p-2 w-full flex items-center justify-center text-slate-900 mb-2 animate-fadeInUp">
      <svg className="mr-2 h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.17163 16.1716C10.7337 14.6095 13.2664 14.6095 14.8285 16.1716M18.5 12.5C15.4624 9.46243 8.53757 9.46243 5.5 12.5M3 8.5C7.5 4 16.5 4 21 8.5M7.5 19.5H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke-dasharray="0.5 4"/>
      </svg>
      <span>You're offline. Data will sync when you're back online.</span>
    </div>
  );
}
