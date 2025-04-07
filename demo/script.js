// Global state
let currentPage = 'dashboard';
let fabOpen = false;
let darkMode = false;

// DOM elements
let pageContainers;
let bottomNavButtons;
let fabContainer;
let fabMain;
let fabActions;

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  pageContainers = document.querySelectorAll('.page-container');
  bottomNavButtons = document.querySelectorAll('.bottom-nav-button');
  fabContainer = document.querySelector('.fab-container');
  fabMain = document.querySelector('.fab-main');
  fabActions = document.querySelector('.fab-actions');
  
  // Set up event listeners
  setupNavigation();
  setupFAB();
  setupDarkMode();
  setupPrayerActions();
  setupQuranProgress();
  setupFastingTracker();
  setupAchievements();
  
  // Initialize the app
  showPage('dashboard');
});

// Set up navigation
function setupNavigation() {
  bottomNavButtons.forEach(button => {
    button.addEventListener('click', () => {
      const page = button.getAttribute('data-page');
      showPage(page);
    });
  });
  
  // Handle back button
  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
      showPage(event.state.page, false);
    }
  });
}

// Show a specific page
function showPage(pageName, updateHistory = true) {
  // Hide all pages
  pageContainers.forEach(container => {
    container.style.display = 'none';
  });
  
  // Show the selected page
  const pageToShow = document.getElementById(`${pageName}-page`);
  if (pageToShow) {
    pageToShow.style.display = 'block';
    
    // Update navigation
    bottomNavButtons.forEach(button => {
      const buttonPage = button.getAttribute('data-page');
      if (buttonPage === pageName) {
        button.classList.add('bottom-nav-button-active');
        button.classList.remove('bottom-nav-button-inactive');
      } else {
        button.classList.remove('bottom-nav-button-active');
        button.classList.add('bottom-nav-button-inactive');
      }
    });
    
    // Update state
    currentPage = pageName;
    
    // Close FAB if open
    if (fabOpen) {
      toggleFAB();
    }
    
    // Update browser history
    if (updateHistory) {
      history.pushState({ page: pageName }, `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - Spiritual Fitness`, `#${pageName}`);
    }
  }
}

// Set up Floating Action Button
function setupFAB() {
  fabMain.addEventListener('click', toggleFAB);
  
  // Close FAB when clicking outside
  document.addEventListener('click', (event) => {
    if (fabOpen && !fabContainer.contains(event.target)) {
      toggleFAB();
    }
  });
  
  // Set up FAB action buttons
  const fabActionButtons = document.querySelectorAll('.fab-action-button');
  fabActionButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const action = button.getAttribute('data-action');
      handleFabAction(action);
      toggleFAB();
    });
  });
}

// Toggle FAB open/closed
function toggleFAB() {
  fabOpen = !fabOpen;
  
  if (fabOpen) {
    fabMain.classList.add('fab-main-active');
    fabMain.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    fabActions.style.display = 'flex';
    
    // Animate the action buttons
    const fabActionButtons = document.querySelectorAll('.fab-action-button');
    fabActionButtons.forEach((button, index) => {
      setTimeout(() => {
        button.style.opacity = '1';
        button.style.transform = 'translateY(0)';
      }, 50 * index);
    });
  } else {
    fabMain.classList.remove('fab-main-active');
    fabMain.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
    
    // Animate the action buttons out
    const fabActionButtons = document.querySelectorAll('.fab-action-button');
    fabActionButtons.forEach((button, index) => {
      const delay = (fabActionButtons.length - index - 1) * 50;
      button.style.opacity = '0';
      button.style.transform = 'translateY(10px)';
    });
    
    // Hide the actions container after animation
    setTimeout(() => {
      if (!fabOpen) {
        fabActions.style.display = 'none';
      }
    }, 300);
  }
}

// Handle FAB action button clicks
function handleFabAction(action) {
  switch (action) {
    case 'prayer':
      showPage('dashboard');
      // Scroll to prayer section
      const prayerSection = document.querySelector('.prayer-section');
      if (prayerSection) {
        prayerSection.scrollIntoView({ behavior: 'smooth' });
      }
      break;
    case 'quran':
      showPage('quran');
      break;
    case 'fasting':
      showPage('dashboard');
      // Scroll to fasting section
      const fastingSection = document.querySelector('.fasting-section');
      if (fastingSection) {
        fastingSection.scrollIntoView({ behavior: 'smooth' });
      }
      break;
    case 'workout':
      showPage('dashboard');
      // Scroll to workout section
      const workoutSection = document.querySelector('.workout-section');
      if (workoutSection) {
        workoutSection.scrollIntoView({ behavior: 'smooth' });
      }
      break;
  }
}

// Set up dark mode toggle
function setupDarkMode() {
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      darkMode = !darkMode;
      if (darkMode) {
        document.body.classList.add('dark');
        darkModeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
      } else {
        document.body.classList.remove('dark');
        darkModeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
      }
    });
  }
}

// Set up prayer action buttons
function setupPrayerActions() {
  const prayerActionButtons = document.querySelectorAll('.prayer-action-button');
  prayerActionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const prayerCard = button.closest('.prayer-card');
      const prayerName = prayerCard.getAttribute('data-prayer');
      const action = button.getAttribute('data-action');
      
      if (action === 'mark-prayed') {
        // Mark prayer as completed
        prayerCard.classList.add('prayer-completed');
        button.textContent = 'Completed';
        button.classList.remove('prayer-action-primary');
        button.classList.add('prayer-action-secondary');
        button.setAttribute('data-action', 'undo');
        
        // Update prayer time status
        const prayerTime = prayerCard.querySelector('.prayer-time');
        if (prayerTime) {
          prayerTime.classList.remove('prayer-time-upcoming', 'prayer-time-active');
          prayerTime.classList.add('prayer-time-completed');
        }
        
        // Update workout progress
        updateWorkoutProgress('prayer');
      } else if (action === 'undo') {
        // Undo completed prayer
        prayerCard.classList.remove('prayer-completed');
        button.textContent = 'Mark as Prayed';
        button.classList.remove('prayer-action-secondary');
        button.classList.add('prayer-action-primary');
        button.setAttribute('data-action', 'mark-prayed');
        
        // Update prayer time status
        const prayerTime = prayerCard.querySelector('.prayer-time');
        if (prayerTime) {
          const currentTime = new Date();
          const prayerTimeValue = prayerCard.getAttribute('data-time');
          if (prayerTimeValue) {
            const [hours, minutes] = prayerTimeValue.split(':').map(Number);
            const prayerDateTime = new Date();
            prayerDateTime.setHours(hours, minutes, 0);
            
            if (prayerDateTime > currentTime) {
              prayerTime.classList.add('prayer-time-upcoming');
              prayerTime.classList.remove('prayer-time-completed', 'prayer-time-active');
            } else {
              prayerTime.classList.add('prayer-time-active');
              prayerTime.classList.remove('prayer-time-completed', 'prayer-time-upcoming');
            }
          }
        }
        
        // Update workout progress
        updateWorkoutProgress('prayer', false);
      }
    });
  });
}

// Set up Quran progress
function setupQuranProgress() {
  const quranProgressItems = document.querySelectorAll('.quran-progress-item');
  quranProgressItems.forEach(item => {
    item.addEventListener('click', () => {
      const isCompleted = item.classList.contains('completed');
      
      if (isCompleted) {
        item.classList.remove('completed');
        item.querySelector('.quran-progress-check').style.display = 'none';
        // Update workout progress
        updateWorkoutProgress('quran', false);
      } else {
        item.classList.add('completed');
        item.querySelector('.quran-progress-check').style.display = 'flex';
        // Update workout progress
        updateWorkoutProgress('quran');
      }
      
      // Update overall Quran progress
      updateQuranOverallProgress();
    });
  });
}

// Update overall Quran progress
function updateQuranOverallProgress() {
  const totalItems = document.querySelectorAll('.quran-progress-item').length;
  const completedItems = document.querySelectorAll('.quran-progress-item.completed').length;
  const progressPercentage = Math.round((completedItems / totalItems) * 100);
  
  // Update progress bar
  const progressBar = document.querySelector('.quran-progress-bar-inner');
  if (progressBar) {
    progressBar.style.width = `${progressPercentage}%`;
  }
  
  // Update progress text
  const progressText = document.querySelector('.quran-progress-text');
  if (progressText) {
    progressText.textContent = `${completedItems}/${totalItems} pages`;
  }
}

// Set up fasting tracker
function setupFastingTracker() {
  const fastingToggle = document.querySelector('.fasting-toggle');
  if (fastingToggle) {
    fastingToggle.addEventListener('click', () => {
      const isFasting = fastingToggle.classList.contains('fasting-active');
      
      if (isFasting) {
        fastingToggle.classList.remove('fasting-active');
        fastingToggle.textContent = 'Start Fasting';
        // Update workout progress
        updateWorkoutProgress('fasting', false);
      } else {
        fastingToggle.classList.add('fasting-active');
        fastingToggle.textContent = 'End Fasting';
        // Update workout progress
        updateWorkoutProgress('fasting');
      }
    });
  }
}

// Set up achievements
function setupAchievements() {
  const achievementItems = document.querySelectorAll('.achievement-item');
  achievementItems.forEach(item => {
    item.addEventListener('click', () => {
      // Toggle achievement details
      const details = item.querySelector('.achievement-details');
      if (details) {
        const isVisible = details.style.display === 'block';
        details.style.display = isVisible ? 'none' : 'block';
      }
    });
  });
}

// Update workout progress
function updateWorkoutProgress(type, completed = true) {
  // Get the workout card for the specified type
  const workoutCard = document.querySelector(`.workout-card[data-type="${type}"]`);
  if (!workoutCard) return;
  
  // Get the progress element
  const progressElement = workoutCard.querySelector('.circular-progress');
  if (!progressElement) return;
  
  // Get current progress value
  let value = parseInt(progressElement.style.getPropertyValue('--value') || '0');
  
  // Update value based on completion status
  if (type === 'prayer') {
    // For prayers, each prayer is worth 20% (5 daily prayers)
    value = completed ? value + 20 : value - 20;
  } else if (type === 'quran') {
    // For Quran, calculate based on completed pages
    const totalItems = document.querySelectorAll('.quran-progress-item').length;
    const completedItems = document.querySelectorAll('.quran-progress-item.completed').length;
    value = Math.round((completedItems / totalItems) * 100);
  } else if (type === 'fasting') {
    // For fasting, it's either 0% or 100%
    value = completed ? 100 : 0;
  }
  
  // Ensure value is within bounds
  value = Math.max(0, Math.min(100, value));
  
  // Update the progress element
  progressElement.style.setProperty('--value', value);
  
  // Update the inner text
  const innerElement = progressElement.querySelector('.circular-progress-inner');
  if (innerElement) {
    innerElement.textContent = `${value}%`;
  }
  
  // Update the overall workout progress
  updateOverallWorkoutProgress();
}

// Update overall workout progress
function updateOverallWorkoutProgress() {
  // Get all workout cards
  const workoutCards = document.querySelectorAll('.workout-card');
  
  // Calculate average progress
  let totalProgress = 0;
  workoutCards.forEach(card => {
    const progressElement = card.querySelector('.circular-progress');
    if (progressElement) {
      const value = parseInt(progressElement.style.getPropertyValue('--value') || '0');
      totalProgress += value;
    }
  });
  
  const averageProgress = Math.round(totalProgress / workoutCards.length);
  
  // Update the overall progress
  const overallProgress = document.querySelector('.overall-progress .circular-progress');
  if (overallProgress) {
    overallProgress.style.setProperty('--value', averageProgress);
    
    // Update the inner text
    const innerElement = overallProgress.querySelector('.circular-progress-inner');
    if (innerElement) {
      innerElement.textContent = `${averageProgress}%`;
    }
  }
}
