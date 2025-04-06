interface PwaInstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export default function PwaInstallPrompt({
  onInstall,
  onDismiss
}: PwaInstallPromptProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 shadow-lg rounded-t-xl p-4 z-50 animate-fadeInUp">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <svg className="text-white text-xl w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V9L12 14L22 9V7L12 2Z" fill="currentColor" />
              <path d="M5 10.5V15.5L12 19.5L19 15.5V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 14V19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="flex-grow">
          <h3 className="font-poppins font-semibold mb-1">Install SpiritualFit</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Add this app to your home screen for a better experience</p>
          <div className="flex space-x-2">
            <button 
              onClick={onInstall}
              className="bg-primary text-white text-sm px-3 py-2 rounded-lg font-medium"
            >
              Install App
            </button>
            <button 
              onClick={onDismiss}
              className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm px-3 py-2 rounded-lg"
            >
              Not Now
            </button>
          </div>
        </div>
        <button 
          className="text-slate-400 hover:text-slate-500"
          onClick={onDismiss}
          aria-label="Close"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
