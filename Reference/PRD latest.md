# **Product Requirements Document: Faithful Steps (Comprehensive & Revised)**

## 1\. Introduction / Overview

### 1.1 Purpose

This document outlines the requirements for **Faithful Steps**, a web-based Progressive Web App (PWA) built with **Next.js**, designed to support Muslims globally in maintaining consistent and enhanced spiritual practices. The application aims to serve as a comprehensive digital companion, integrating essential Islamic activities such as prayer management, fasting observation, Quran engagement, and community interaction within a modern, engaging, and accessible user experience, leveraging **Supabase** for backend data services and **Clerk** for authentication.

### 1.2 Vision & Goals

* **Vision:** To create **Faithful Steps**, a supportive, privacy-respecting digital companion that enhances daily spiritual practice through personalized tracking, reliable information, encouraging gamification focused on personal growth, and supportive community features, all while maintaining religious sensitivity and humility.  
* **Goals:**  
  * Create an engaging, accessible PWA (**Faithful Steps**) using **Next.js** for Muslims to track and maintain daily spiritual practices (prayers, fasting, Quran reading) in a calendar format.  
  * Provide accurate, reliable prayer times with customizable calculation methods, location-based accuracy, and offline calculation capabilities.  
  * Offer a clean, distraction-free Quran reading experience with multiple translations, optional transliteration, bookmarking, progress tracking, and robust offline access.  
  * Implement thoughtfully designed motivation systems (streaks, achievements, personal dashboard) that encourage consistency without fostering pride or public competition.  
  * Build community features for mutual accountability and support within private groups.  
  * Ensure user privacy and ethical data handling, especially regarding location data, learning from past industry issues, managed securely via **Clerk** and **Supabase**.  
  * Deliver a robust, accessible experience on any device (mobile, tablet, desktop) with full offline capabilities and push notifications.  
  * Establish a technical foundation that is efficient for development by a solo developer leveraging Replit and AI coding assistants (e.g., Replit Ghostwriter), utilizing **Supabase** for backend data/storage and **Clerk** for authentication within the **Next.js** framework.

## 2\. Project Objectives & Success Metrics

### 2.1 Primary Goals

*(Covered in Section 1.2 Goals)*

### 2.2 Success Metrics

* **User Retention:** 50%+ of registered users return to **Faithful Steps** at least 3 times per week.  
* **Prayer Tracking:** 75%+ of active users track at least 3 prayers daily using the app.  
* **Quran Engagement:** 40%+ of active users read Quran through the app at least weekly.  
* **Feature Utilization:** 30%+ of registered users engage with community features (groups).  
* **Prayer Time Accuracy:** User feedback indicates high satisfaction (\>95%) with the accuracy of prayer times across various locations and calculation methods.  
* **Offline Reliability:** Core features (prayer tracking, cached Quran, offline prayer times) function reliably without network connectivity.  
* **Privacy Satisfaction:** 90%+ of users report feeling their data (especially location) is handled respectfully and transparently, based on optional surveys.  
* **PWA Performance:** Initial load time under 3 seconds, time to interactive under 5 seconds on average 4G connection (leveraging Next.js optimization). High Lighthouse PWA scores.  
* **Maintainability:** The **Next.js** codebase remains manageable and extensible by a solo developer using **Supabase** and **Clerk**.

## 3\. User Personas

### 3.1 Consistent Practitioner

**Fatima, 28, Marketing Professional**

* Regularly performs five daily prayers but sometimes misses due to work schedule.  
* Wants to increase consistency and track progress using **Faithful Steps**.  
* Comfortable with technology and uses fitness apps.  
* Seeks subtle reminders and motivation without public sharing.

### 3.2 Religious Knowledge Seeker

**Ahmed, 35, Engineer**

* Regularly reads Quran but wants to be more structured using **Faithful Steps**.  
* Interested in learning more about proper prayer times and different calculation methods available in the app.  
* Uses technology extensively for productivity.  
* Appreciates data-driven insights about personal habits provided by the app.

### 3.3 Community-Oriented User

**Aisha, 22, University Student**

* Practices consistently but misses the community aspect of her hometown mosque.  
* Wants accountability partners for religious goals through **Faithful Steps**' group features.  
* Heavy smartphone user who prefers apps over browsers.  
* Values privacy but enjoys appropriate social features.

### 3.4 Beginner/Returning Practitioner

**Omar, 40, Healthcare Worker**

* Seeking to establish/return to regular prayer routine using **Faithful Steps**.  
* Needs guidance on prayer times and proper practice.  
* Variable work schedule makes consistency challenging.  
* Appreciates gentle encouragement and simple interfaces.

## 4\. Functional Requirements

### 4.1 User Account and Authentication

* **User Registration & Login:**  
  * Enable registration via email/password, handled securely by **Clerk**.  
  * Support OAuth/social login providers configured through **Clerk** (e.g., Google, Apple), clearly stating privacy implications.  
  * Utilize **Clerk** for secure session management (e.g., JWT handling via **Clerk**'s Next.js SDK).  
  * Provide user-friendly error messages surfaced from **Clerk**'s authentication flows.  
  * Password reset functionality managed via **Clerk**.  
  * Account deletion process allowing users to remove their data, coordinated between **Clerk** and **Supabase**.  
* **Anonymous/Offline Mode:**  
  * Offer an option to use core features (like prayer time viewing, local tracking) without creating an account.  
  * In anonymous mode, progress data is stored locally on the device (e.g., using IndexedDB).  
* **User Profile Management:**  
  * Allow logged-in users to view and update profile information stored in **Supabase**, linked via the **Clerk** User ID.  
  * Profile Fields: **Clerk** User ID (internal), Username (required, stored in **Supabase**, no real names needed), Optional Display Name (**Supabase**), Optional Profile Image/Avatar (stored in **Supabase Storage**).  
  * Profile Settings (stored in **Supabase**): Location settings (manual entry or device GPS for prayer times), preferred prayer time calculation method, Asr preference, high-latitude adjustment method, preferred Quran translation(s), notification preferences, theme preference (light/dark), language selection, time format (12/24hr).  
  * Users can view their private progress data (prayer logs, fasting records, Quran reading position/progress, earned badges/achievements, current streaks) retrieved from **Supabase**.

### 4.2 Core Tracking Features

#### 4.2.1 Prayer Tracking System

* **Prayer Time Display:**  
  * Display accurate prayer times for the current day (Fajr, Dhuhr, Asr, Maghrib, Isha) based on user's location and selected settings (stored in **Supabase**).  
  * Optionally display supplementary times like Sunrise and time remaining until the next prayer.  
  * Provide a monthly calendar view of prayer times.  
* **Prayer Time Calculation:**  
  * Location Input: Automatically determine user's location via device Geolocation API (with explicit permission and clear explanation of use) or allow manual input (city/coordinates), preference stored in **Supabase**.  
  * Calculation Source: Primarily use a reliable online API like Al Adhan API (`aladhan.com`) for dynamic, accurate times.  
  * Offline Calculation: Implement client-side calculation using a library like Adhan.js (MIT license) as a fallback when offline.  
  * Calculation Methods: Support multiple widely recognized methods (e.g., MWL, ISNA, Egypt, Makkah, Karachi, Tehran, Jafari, Umm al-Qura, France, Custom Angles, etc.). Allow users to select their preferred method (stored in **Supabase**).  
  * Parameter Adjustments: Allow adjustment of Fajr/Isha angles where applicable.  
  * Asr Calculation: Support different juristic methods (Standard/Shafi'i vs. Hanafi) selectable by the user (stored in **Supabase**).  
  * High Latitude Adjustments: Incorporate appropriate methods (e.g., Angle Based, One Seventh, Middle of the Night) for users in regions near the poles (stored in **Supabase**).  
  * Manual Adjustment: Allow users to manually offset calculated times slightly to match local mosque schedules.  
* **Prayer Logging & Tracking:**  
  * Daily Checklist/Interface: Provide a simple tap/click interface to mark each of the five daily prayers as completed.  
  * Prayer Status: Allow users to specify the status of completion: "On Time," "Delayed/Late," or "Missed." Optionally specify if performed in "Congregation (Jamaah)" vs. "Individually."  
  * Default Status: Option to set a default status (e.g., "On Time") for faster logging.  
  * Calendar Interface: Display prayer completion data in monthly, weekly, and daily calendar views.  
  * Visual Indicators: Use distinct visual cues (colors, icons, checkmarks) on the calendar to represent different prayer statuses (completed on time, delayed, missed, jamaah).  
  * Navigation: Allow users to navigate the calendar to view past and future records.  
  * Notes Field: Optional field for users to add personal notes to each prayer entry.  
  * Data Storage: Securely store all recorded prayer data in the **Supabase** database, associated with the user account (**Clerk** User ID).  
  * Historical Review: Allow users to review their historical prayer data retrieved from **Supabase**.  
  * Offline Logging: Entries made offline should be stored locally (IndexedDB) and synced to **Supabase** when connectivity resumes.

#### 4.2.2 Fasting Tracker

* **Calendar-based Logging:** Provide a calendar interface to mark days with completed fasts.  
* **Ramadan Tracking:** Automatically track and indicate Ramadan days based on the Islamic calendar.  
* **Missed Fasts (Ramadan):** Allow users to mark missed fasts during Ramadan, optionally specifying a reason (e.g., travel, illness).  
* **Make-up Fasts:** Allow users to record make-up fasts (Qada).  
* **Voluntary Fasts:** Support logging of optional/voluntary fasts (e.g., Mondays/Thursdays, White Days/Ayyam al-Beedh, Ashura, Arafah, etc.). Allow specifying the type.  
* **Visual Indicators:** Use distinct visual cues on the calendar for Ramadan fasts, voluntary fasts, missed fasts, and make-up fasts.  
* **Non-Fasting Days:** Automatically handle or allow manual marking of non-fasting days like Eid.  
* **Notes Field:** Optional field for users to add notes to each fasting day entry.  
* **Summaries:** Potentially include summaries of fasting performance (e.g., total days fasted this month/year) generated from **Supabase** data. Data stored in **Supabase**.

#### 4.2.3 Quran Reading Tracker and Reader

* **Quran Reader Interface:**  
  * Display the full Arabic Quranic text (Uthmani script recommended) in a clean, readable, distraction-free format.  
  * Provide adjustable text size and optional night mode/theme.  
  * Offer multiple translations (prioritize high-quality English like Sahih International, Yusuf Ali, Pickthall, Asad; consider others based on target audience). Users should be able to select preferred translations to view alongside/below the Arabic text (preference stored in **Supabase**).  
  * Offer optional transliteration (Latin script representation of Arabic) for those learning to read (visibility preference stored in **Supabase**).  
  * Navigation: Allow easy navigation by Surah, Ayah, Juz', or page number. Verse-by-verse navigation.  
  * Search Functionality: Allow searching for specific words or phrases within the Quranic text and selected translations.  
  * Bookmarking: Allow users to bookmark specific Ayahs or pages for easy return (data stored in **Supabase**).  
  * Resume Reading: Automatically save the user's last read position (in **Supabase**) and allow resuming from there.  
  * Notes: Allow users to add personal notes to specific verses (stored in **Supabase**).  
  * Data Source: Utilize reliable Quran APIs (e.g., Quran.com API v4, Al-Quran Cloud, Fawazahmed0 static JSON) with proper attribution displayed.  
* **Offline Access:**  
  * Cache frequently accessed/recently viewed Surahs, Juz', or the entire Quran text and selected translations for offline reading.  
  * Leverage Service Workers and potentially IndexedDB for robust offline content availability.  
* **Reading Progress Tracking:**  
  * Log reading progress by Surah and last Ayah read, or optionally by Juz' or page number (data stored in **Supabase**).  
  * Display Quran reading activity in a calendar view, showing days when Quran was read and potentially the amount.  
  * Track overall progress through the entire Quran (e.g., percentage complete, Juz' completed) based on **Supabase** data.  
  * Display metrics like pages/verses/surahs/juz read.  
  * Optionally track Quran memorization progress separately (stored in **Supabase**).  
  * Goal Setting: Allow users to set personal daily/weekly reading goals (e.g., pages per day, surah per week) (stored in **Supabase**).  
  * Goal Reminders: Provide gentle reminders for set reading goals.

### 4.3 Progress Dashboard & Motivational Features

* **Visual Statistics Dashboard:**  
  * Provide a central dashboard aggregating daily, weekly, and monthly progress across tracked features, data queried from **Supabase**.  
  * Display daily summaries: prayers completed (on time/delayed/jamaah ratio), Quran read (pages/time), fasting status.  
  * Visualize progress using charts (bar, line), progress bars/rings, calendar heatmaps, rendered client-side from **Supabase** data.  
  * Include monthly summaries showing broader activity and consistency trends.  
  * Display current streaks prominently for different activities (e.g., prayer consistency, daily Quran reading), calculated based on **Supabase** logs.  
  * Prayer Metrics: Completion rate (daily/weekly/monthly), Jamaah vs. individual prayer ratio.  
  * Fasting Metrics: Consistency metrics (e.g., optional fasts completed this month).  
  * Quran Metrics: Progress towards completion (pages, surahs, juz completed), reading frequency.  
* **Motivational Elements:**  
  * Integrate motivational quotes/content throughout the interface, especially the dashboard.  
  * Display a daily motivational quote, primarily sourced from reliable Hadith or relevant Quranic verses.  
  * Use reputable Hadith APIs (e.g., Sunnah.com, HadithAPI.com, Fawazahmed0) with clear attribution and focus on authenticity.  
  * Potentially categorize quotes by themes (e.g., perseverance, gratitude).  
  * Display respectful congratulatory messages for achieving streaks or milestones.  
  * Feature personalized motivational insights based on user's tracking data (potentially processed via **Supabase** Functions or client-side logic).  
* **Gamified Reward System (Personal Focus):**  
  * **Streaks:** Automatically track and display consecutive days where core targets are met, based on logs in **Supabase**.  
  * **Achievements/Badges:** Award badges for reaching specific milestones. Badge criteria and earned badges stored in **Supabase**.  
    * Badge criteria must be clearly defined.  
    * Potential for different tiers of badges.  
    * Award badges/rewards upon achieving goals (logic might reside in **Supabase** Functions or client-side checks).  
    * Display earned badges privately on the user's profile/dashboard.  
  * **Points System (Optional & Private):** Assign points per activity. Points stored in **Supabase**, visible *only* to the user.  
  * **Challenges:** Offer pre-set or customizable personal challenges. Challenge definitions and progress stored in **Supabase**. Track user progress towards these goals.  
  * **Emphasis:** Design all gamification elements to foster internal motivation, consistency, and humility. **Strictly avoid public leaderboards or competitive rankings** to prevent fostering pride (Riya).

### 4.4 Notification and Reminder System

* **Prayer Time Notifications:**  
  * Implement push notifications to remind users of upcoming prayer times.  
  * Use Web Push API via Service Workers, potentially leveraging Firebase Cloud Messaging (FCM) triggered by **Supabase** Functions or another scheduler for reliable delivery across platforms (including iOS 16.4+ PWAs added to home screen).  
  * Allow users to customize notification timing.  
  * Allow users to enable/disable notifications globally and for specific prayers.  
  * Option to enable Adhan sound notifications with customizable settings.  
  * Ensure respectful notification language.  
  * Notifications should deep-link to the relevant section of the app when tapped.  
  * Implement client-side reminders when the app is active, in addition to server push.  
* **Additional Reminders:**  
  * Provide optional, configurable reminders for daily Quran reading goals.  
  * Provide optional reminders for upcoming recommended fasting days.  
  * Optionally deliver daily motivational messages (Hadith/Quran quotes) via notification at configurable times (potentially triggered via **Supabase** scheduled functions).

### 4.5 Community Features (Private Groups)

* **Group Creation & Management:**  
  * Allow users to create private groups (data managed in **Supabase**).  
  * Generate unique invite codes/links for joining groups.  
  * Users can join existing groups using codes/links (**Supabase** manages memberships).  
  * Group creator can manage membership.  
  * Users can leave groups they are part of.  
  * Implement group size limits.  
* **Group Accountability & Support:**  
  * Define group challenges or common goals (stored in **Supabase**).  
  * Track and display collective progress towards group goals (aggregated from **Supabase** data).  
  * Display discreet indicators of member participation on a group dashboard using **Supabase** data.  
  * Focus on shared accountability and mutual encouragement.  
* **Group Communication:**  
  * Implement a simple, focused group feed or messaging area using **Supabase** for storage.  
  * Offer preset encouraging messages.  
  * Optional feature for members to share their intention to pray/fast/read within the group.  
  * No direct one-to-one messaging initially.  
* **Community Guidelines & Moderation:**  
  * Establish clear community guidelines.  
  * Implement basic moderation tools (group creator role).  
* **Privacy Controls:**  
  * Provide users with granular control over what aspects of their profile and progress data are visible within their groups (managed via **Supabase** row-level security or application logic).  
  * Ensure group data is private and accessible only to members using **Supabase**'s security rules.

### 4.6 Settings and Configuration

* **App Configuration:**  
  * Prayer calculation method selection.  
  * Asr calculation preference.  
  * High latitude method selection.  
  * Location settings.  
  * Notification preferences.  
  * Theme settings.  
  * Language selection (support multilingual UI, plan for RTL layouts like Arabic).  
  * Display preferences.  
  * Quran reader preferences. (All preferences stored in **Supabase** user settings table).  
* **Privacy Controls:**  
  * Granular data sharing options for group features.  
  * Clear explanation of data usage, especially location data (link to Privacy Policy).  
  * Data export functionality for users to retrieve their tracked data from **Supabase**.  
  * Account deletion option triggering data removal from **Supabase** and **Clerk**.

## 5\. Non-functional Requirements

### 5.1 Performance and Scalability

* **Speed and Responsiveness:**  
  * Initial load time under 3 seconds on average 4G connection (leveraging **Next.js** pre-rendering/optimization).  
  * Time to interactive under 5 seconds.  
  * Smooth animations and UI transitions (target 60fps).  
  * Optimize for low-bandwidth situations via efficient caching and minimal data transfer.  
  * Efficient data fetching from **Supabase** (use appropriate indexing, select only needed columns) and rendering client-side or via **Next.js** rendering strategies.  
* **Offline Capability:**  
  * Core functionalities must be fully available offline.  
  * Graceful handling of offline state.  
  * Use Service Workers (e.g., via Workbox) for robust caching.  
  * Use IndexedDB for storing user logs and cached content generated/needed offline.  
  * Implement reliable background synchronization for offline data to **Supabase** when connectivity resumes.  
* **Resource Usage:**  
  * Efficient battery usage.  
  * Minimize memory footprint.  
* **Scalability:**  
  * **Supabase** provides a scalable backend infrastructure (database, functions, storage), allowing the application to handle growth. **Clerk** also scales authentication needs.

### 5.2 Security and Privacy

* **Data Protection:**  
  * Use HTTPS for all communication (provided by deployment platform like Replit/Vercel, **Supabase**, **Clerk**).  
  * Secure handling of authentication tokens provided by **Clerk**.  
  * Secure password handling managed by **Clerk**.  
  * Encryption at rest for data stored in **Supabase** (standard feature).  
  * Input validation on all user inputs (client and server-side, potentially using **Supabase** Functions or **Next.js** API routes for complex validation).  
  * Secure handling of API keys (e.g., Aladhan, Quran APIs) potentially proxied through **Supabase** Edge Functions or **Next.js** API routes if needed, or stored securely as environment variables.  
* **Privacy by Design:**  
  * Data Minimization: Collect only necessary data.  
  * Transparency: Provide a clear, accessible Privacy Policy.  
  * User Consent & Control: Obtain explicit consent; allow users to view, export, and delete their data (via **Supabase** and **Clerk**).  
  * Location Data Handling: Critical focus. Avoid storing precise historical location data in **Supabase**. Perform calculations client-side whenever possible. Explain data usage clearly.  
  * No Selling/Sharing Data: Explicitly state that personal religious practice data and location data will not be sold or shared.  
  * Third-Party Trackers: Avoid non-essential third-party analytics or ad trackers.  
* **Authentication Security:**  
  * Leverage **Clerk**'s robust authentication features (MFA options, session management, security checks).  
  * Implement **Supabase** Row Level Security (RLS) to ensure users can only access their own data or data within their groups.  
* **Web Security:**  
  * Protect against common web vulnerabilities (XSS, CSRF). **Next.js** provides some built-in protections.

### 5.3 User Experience (UX) / Design Principles

* **Intuitive Design:**  
  * Clean, focused interface prioritizing core functionality.  
  * Adopt familiar and effective UI/UX patterns adapted for a spiritual context.  
  * Mobile-first responsive design.  
  * Seamless and consistent navigation structure (using **Next.js** routing).  
* **Religious Sensitivity & Aesthetics:**  
  * Minimal, respectful aesthetic.  
  * Calming, warm, supportive color palettes with optional dark mode.  
  * Subtle use of Islamic geometric patterns.  
  * High-quality, readable fonts for Arabic and other languages.  
  * Meaningful and respectful iconography.  
  * Language and Tone: Humble, encouraging, supportive, respectful.  
* **Cultural Adaptation:**  
  * Support for multiple languages (consider **Next.js** i18n features).  
  * Support for Right-to-Left (RTL) layouts.  
  * Respect for different madhabs and calculation methods through customization.

### 5.4 Accessibility

* Adhere to Web Content Accessibility Guidelines (WCAG) standards.  
* Ensure sufficient color contrast ratios.  
* Support adjustable font sizes.  
* Provide ARIA attributes and semantic HTML for screen reader compatibility.  
* Ensure keyboard navigation is possible.

### 5.5 Adaptability and Extensibility

* **Modular Architecture:**  
  * Codebase (**Next.js** app) should be modular, well-documented, and maintainable.  
  * Clear separation between frontend (**Next.js** components/pages) and backend services (**Supabase**, **Clerk**).  
* **Future Integrations:**  
  * Architecture should allow for adding new features or integrating new APIs later. **Supabase** Functions or **Next.js** API routes can facilitate backend logic expansion.

## 6\. Technical Architecture & Specifications

### 6.1 Platform & Architecture

* **Progressive Web App (PWA):** Built using **Next.js** for cross-platform reach, installability, offline support, notifications, and potential SEO benefits.  
  * App Manifest (`public/manifest.json`).  
  * Service Worker (using Workbox recommended, potentially integrated with `next-pwa` plugin).  
  * App Shell Architecture (inherent in **Next.js** structure).  
  * Responsive Design.

### 6.2 Frontend Development

* **Framework:** **Next.js** (React framework). Utilize TypeScript.  
* **State Management:** React Context API, Zustand, Redux/Pinia, or integrated **Next.js** state management approaches.  
* **Styling:** Tailwind CSS or a component library (Material UI, PrimeVue, etc.).  
* **Routing:** **Next.js** built-in file-system based routing.  
* **Offline Storage:** IndexedDB.  
* **Authentication Client:** **Clerk** Next.js SDK (`@clerk/nextjs`).  
* **Database Client:** **Supabase** JavaScript Client library (`@supabase/supabase-js`).

### 6.3 Backend Development & Database (Standardized Option)

* **Backend Services:** **Supabase** for database, storage, and serverless functions; **Clerk** for authentication.  
  * *Rationale:* **Supabase** provides managed Postgres, Storage, Edge Functions, and Realtime, reducing backend management. **Clerk** specializes in secure authentication and user management, integrating well with **Next.js** and **Supabase**.  
* **Database:** PostgreSQL (managed by **Supabase**).  
  * *Rationale:* Robust relational DB suitable for structured data. **Supabase** provides easy access, scalability, RLS.  
* **Authentication:** **Clerk**.  
  * *Rationale:* Dedicated service simplifying secure user management, login methods, session handling (optimized for **Next.js**), and offloading security burdens.  
* **File Storage:** **Supabase Storage**.  
  * *Use Cases:* User avatars, potentially other user-uploaded content in the future.  
* **Real-time Features:** **Supabase** Realtime Subscriptions (listening to Postgres changes via WebSockets).  
  * *Used for:* Updating group dashboards or potentially other live features.  
* **Serverless Functions (Optional):**  
  * **Supabase** Edge Functions (Deno-based): Good for tasks tightly coupled with DB events or needing edge performance.  
  * **Next.js** API Routes (Node.js-based): Convenient for standard API endpoints built within the frontend project, good for proxying or custom backend logic.  
  * *Use Cases:* Running backend logic (e.g., complex calculations, triggering notifications based on DB changes/schedules, handling webhooks from **Clerk**, proxying external API calls securely).

### 6.4 External APIs & Data Sources

* **Quran Data:**  
  * Primary Online: Quran.com API v4 or Al-Quran Cloud API.  
  * Offline/Static Cache Source: Fawazahmed0/quran-api or Quran JSON.  
  * Attribution required.  
* **Prayer Times:**  
  * Online Calculation: Al Adhan API.  
  * Offline Calculation: Adhan.js library.  
* **Hadith/Motivational Content:**  
  * Source: Sunnah.com API, HadithAPI.com, or Fawazahmed0/hadith-api.  
  * Prioritize authenticity; filter content; attribute sources.  
  * Consider including relevant Quranic verses.  
* **Push Notifications:**  
  * Service: Firebase Cloud Messaging (FCM) recommended, potentially triggered via **Supabase** Functions or **Next.js** API route, or direct Web Push API triggered similarly.

### 6.5 Data Flow & Security

* **Data Flow:** **Next.js** frontend interacts with **Clerk** for authentication and **Supabase** for data CRUD operations. Local state updates immediately, **Supabase**/**Clerk** handle persistence. Offline data stored in IndexedDB, synced to **Supabase** on reconnection. Realtime updates pushed from **Supabase** to listening clients. **Next.js** API routes or **Supabase** Functions handle specific backend logic.  
* **Security:** Implement security best practices (Section 5.2). Rely heavily on **Clerk**'s secure authentication (integrated with **Next.js** middleware) and **Supabase**'s Row Level Security (RLS) for data access control. Manage external API keys securely (e.g., using Replit/Vercel environment variables, **Supabase** Function environment variables).

## 7\. User Interface (UI) and User Experience (UX)

*(See Section 5.3 and detailed points below)*

### 7.1 Branding and Visual Design

* **App Name:** **Faithful Steps**.  
* **Color Palette:** Calming, motivating tones. Optional dark mode.  
* **Typography:** High-quality Arabic and Latin fonts. Good legibility.  
* **Icons and Imagery:** Minimalistic, meaningful, respectful icons. Subtle geometric patterns.  
* **Overall Aesthetic:** Clean, modern, focused, respectful, supportive, serene.

### 7.2 Interaction Design & Navigation

* **Mobile-First Approach:** Optimized for touch, responsive across devices.  
* **Navigation:** Intuitive structure (bottom nav/sidebar) implemented using **Next.js** routing.  
* **Key User Flows:** Smooth onboarding, easy daily tracking, seamless Quran reading, simple group interaction.  
* **Feedback:** Immediate visual feedback for actions. Subtle animations.  
* **Notifications UX:** Clear, concise, respectful, deep-linking notifications.

## 8\. Development Approach & Roadmap

### 8.1 Tools & Environment

* **Development Platform:** Replit (IDE, collaboration features, AI assistant integration).  
* **Frontend Framework:** **Next.js**.  
* **Version Control:** Git (GitHub or similar).  
* **AI Coding Assistant:** Replit Ghostwriter or GitHub Copilot (review code carefully).  
* **Backend Services:** **Supabase** account, **Clerk** account.  
* **Deployment:** Replit Deployments or Vercel (preferred for **Next.js**) for hosting the frontend PWA.  
  * *Rationale:* Vercel offers seamless integration and optimization for **Next.js** applications, including serverless functions (API routes), image optimization, analytics, etc. Replit Deployments can also host **Next.js** apps. Both handle custom domains, HTTPS, environment variables.

### 8.2 Development Phases (Solo Dev Focus \- Next.js/Supabase/Clerk Stack)

* **Phase 0: Setup & Foundation (Days 1-3)**  
  * Initialize **Next.js** project on Replit/local env, Git repo. Set up PWA basics (`next-pwa`).  
  * Set up **Supabase** project (tables: Profiles, PrayerLog, etc.). Set up **Clerk** application.  
  * Configure **Clerk** (`@clerk/nextjs`) for authentication in the **Next.js** app. Connect frontend to **Supabase** client.  
  * *Goal:* Runnable **Next.js** app with **Clerk** auth and **Supabase** connection working.  
* **Phase 1: Core Prayer Tracking & Times (Week 1\)**  
  * Implement full User Authentication flows using **Clerk**. Implement **Clerk** webhook \-\> **Supabase** function for profile sync.  
  * Integrate Prayer Time calculation (Aladhan API \+ Adhan.js). Display times based on settings from **Supabase**.  
  * Develop Prayer Tracker UI. Save logs to **Supabase**.  
  * Basic Prayer Time Push Notification POC (using **Supabase** Functions or **Next.js** API route to trigger FCM).  
  * *Goal:* MVP prayer tracking functionality with secure auth and data persistence.  
* **Phase 2: Quran Reader & Fasting Tracker (Week 2\)**  
  * Integrate Quran API. Build reader UI within **Next.js** pages.  
  * Implement offline Quran caching (Service Worker). Implement bookmarking/resume (saving state to **Supabase**).  
  * Develop Fasting Tracker UI. Save logs to **Supabase**.  
  * *Goal:* Core content and fasting features functional.  
* **Phase 3: Dashboard & Gamification Layer (Week 3\)**  
  * Build Progress Dashboard UI (**Next.js** page), querying data from **Supabase**. Implement visualizations.  
  * Implement streak calculation (querying **Supabase**).  
  * Implement achievement/badge system (storing criteria/earned badges in **Supabase**, potentially using **Supabase** Functions for awarding logic).  
  * Integrate motivational quotes. Refine notifications.  
  * *Goal:* Progress overview and personal motivation features active.  
* **Phase 4: Community Features (Private Groups) (Week 4\)**  
  * Implement User Profiles view (displaying data from **Supabase**).  
  * Develop Group creation, invites, joining (managing data in **Supabase** tables).  
  * Build Group Dashboard (querying aggregated **Supabase** data, using RLS). Implement real-time updates using **Supabase** Realtime.  
  * Optional: Basic group encouragement feed (posts stored in **Supabase**).  
  * *Goal:* Private group accountability features functional.  
* **Phase 5: PWA Polish & Offline Enhancements (Week 5\)**  
  * Refine UI/UX.  
  * Implement robust offline support (Service Worker/Workbox \+ IndexedDB) and sync logic to **Supabase**.  
  * Thoroughly test PWA features (installability, offline, notifications via `next-pwa`).  
  * Implement comprehensive Settings page (**Next.js** page, saving preferences to **Supabase**). Performance optimization.  
  * *Goal:* App is a reliable, performant PWA with solid offline capabilities.  
* **Phase 6: Testing, Refinement & Launch Prep (Week 6\)**  
  * Comprehensive Testing (Unit, Component, E2E \- potentially using Cypress/Playwright with **Next.js**, Manual, **Prayer Time Accuracy**).  
  * Security review (focus on **Supabase** RLS, **Clerk** config, API route security), accessibility audit. Address bugs.  
  * Prepare Privacy Policy, Terms of Service, attribution notices.  
  * Configure production deployment environment (e.g., Vercel or Replit Deployments).  
  * *Goal:* Stable, accurate, secure **Faithful Steps** app ready for beta/launch.  
* **Phase 7: Launch & Iteration (Ongoing)**  
  * Deploy the application. Monitor **Supabase**/**Clerk** usage and deployment status. Gather user feedback. Plan future iterations.

### 8.3 Testing Requirements

* **Unit Tests:** For critical client-side logic (offline calculations, UI logic) and potentially API routes/functions (using Vitest/Jest).  
* **Component Tests:** For UI components (using React Testing Library).  
* **End-to-End (E2E) Tests:** For critical user flows involving **Clerk** auth and **Supabase** data interaction (using Cypress/Playwright).  
* **Manual Testing:** Across browsers/devices, focusing on UI/UX, PWA behavior, offline scenarios.  
* **Prayer Time Accuracy Testing:** Essential, against reliable sources for diverse scenarios.  
* **Security Testing:** Verify **Supabase** Row Level Security rules, **Clerk** configurations, and API route security.  
* **PWA Audit:** Use Lighthouse etc.  
* **Beta Testing:** With diverse real users.

## 9\. Constraints, Considerations & Risks

### 9.1 Technical Constraints

* **Solo Developer Resources:** Limited time/bandwidth.  
* **PWA Limitations:** Notification/background processing variations. Offline storage limits.  
* **API Reliability & Costs:** Dependence on external APIs (Aladhan, Quran, Hadith) and BaaS (**Supabase**, **Clerk**) requires monitoring usage against free tiers and potential costs.

### 9.2 Special Considerations

* **Religious Sensitivity:** Accuracy is paramount. Gamification must avoid pride. Respectful design and content in **Faithful Steps**.  
* **Cultural Adaptation:** Multi-language/RTL support. Respect for diverse practices.  
* **Privacy Emphasis:** Highest priority on ethical data handling (location, religious logs). Transparency and user control. No data selling/sharing.

### 9.3 Risks and Mitigations

* **Data Privacy Breach/Misuse:** *Mitigation:* Robust security (**Clerk**, **Supabase** RLS), data minimization, client-side processing, transparency.  
* **Inaccurate Religious Calculations:** *Mitigation:* Reputable sources, extensive testing, user customization, feedback mechanisms.  
* **Notification Reliability:** *Mitigation:* Reliable services (FCM), thorough testing, user guidance on platform limits.  
* **Offline Data Synchronization Issues:** *Mitigation:* Robust sync logic, conflict handling.  
* **Technical Debt:** *Mitigation:* Clean code practices, modularity (**Next.js** promotes this), testing, critical review of AI code.  
* **API/BaaS Changes/Costs:** *Mitigation:* Monitor usage (**Supabase**, **Clerk**), choose services with clear terms, abstract dependencies where possible.

## 10\. Future Expansion Possibilities

* Audio recitation integration.  
* Tafsir integration.  
* Advanced Quran memorization tools.  
* Qibla direction indicator.  
* Dua collection.  
* Expanded social features (with privacy controls).  
* Customizable widgets.  
* Wearable device integration.  
* Sophisticated goal setting/analysis.  
* Hijri calendar event integration.

## 11\. Success Criteria & Evaluation

**Faithful Steps** will be considered successful if it:

1. Provides accurate prayer times verified through testing and user feedback.  
2. Offers a clean, reliable, accessible Quran reading experience with seamless offline caching.  
3. Achieves high user retention and engagement metrics.  
4. Creates a genuinely motivational yet humble environment encouraging spiritual consistency.  
5. Demonstrably respects user privacy through policies, controls, and secure data handling (**Clerk**/**Supabase**).  
6. Functions reliably as a PWA across platforms, including offline capabilities and notifications.  
7. Proves maintainable and extensible by a solo developer using the chosen stack (**Next.js**/**Supabase**/**Clerk**).

## 12\. Glossary

* **Adhan:** The Islamic call to prayer.  
* **API Route (Next.js):** Serverless functions built within a Next.js project for creating backend endpoints.  
* **Asr:** The afternoon prayer.  
* **Ayah:** A verse in the Quran.  
* **Clerk:** A third-party service specializing in user authentication and management, providing SDKs for frameworks like Next.js.  
* **Dua:** Personal supplication or prayer.  
* **Fajr, Dhuhr, Asr, Maghrib, Isha:** The five obligatory daily prayers.  
* **Faithful Steps:** The name of this application.  
* **Hadith:** Recorded sayings/actions of the Prophet Muhammad (pbuh).  
* **Hijri Calendar:** The Islamic lunar calendar.  
* **IndexedDB:** A browser API for client-side storage of significant amounts of structured data.  
* **Jamaah:** Congregational prayer.  
* **Juz:** One of 30 divisions of the Quran.  
* **Madhab:** School of Islamic jurisprudence.  
* **Next.js:** A popular React framework for building web applications, offering features like server-side rendering, static site generation, file-based routing, and API routes.  
* **PWA:** Progressive Web App.  
* **PostgreSQL:** A powerful open-source relational database system (used by **Supabase**).  
* **Qada:** Making up for a missed obligatory act.  
* **Qibla:** Direction towards the Kaaba in Mecca.  
* **Quran:** The Islamic holy book.  
* **Ramadan:** The month of fasting.  
* **Replit:** An online integrated development environment (IDE) and hosting platform.  
* **Replit Deployments:** Replit's feature for hosting production applications.  
* **Riya:** Ostentation or showing off in worship.  
* **Row Level Security (RLS):** A database security feature (used by **Supabase**/PostgreSQL) that controls which rows users can access or modify based on policies.  
* **Salah:** Obligatory prayers.  
* **Service Worker:** A script enabling PWA features like offline caching and push notifications.  
* **Supabase:** An open-source Backend-as-a-Service platform providing a managed PostgreSQL database, authentication (though **Clerk** is used here), storage, edge functions, and real-time capabilities.  
* **Supabase Edge Functions:** Deno-based serverless functions provided by Supabase.  
* **Supabase Storage:** Object storage service provided by Supabase.  
* **Sunnah:** Practices/teachings of the Prophet Muhammad (pbuh); also optional worship.  
* **Surah:** A chapter of the Quran.  
* **Tafsir:** Exegesis/interpretation of the Quran.  
* **Uthmani Script:** Standard script for the Arabic Quran.  
* **Vercel:** A cloud platform optimized for deploying frontend frameworks like Next.js, offering hosting, serverless functions, and more.  
* **Workbox:** A library from Google that simplifies working with Service Workers and caching strategies.

## Appendix: User Stories

*(User stories remain the same as in the previous version but should be interpreted in the context of the "Faithful Steps" app using the Next.js/Supabase/Clerk stack)*

### Core Prayer Tracking

**As Fatima (Consistent Practitioner)**

1. I want to view today's prayer times in **Faithful Steps** so that I know exactly when each prayer is due based on my location.  
2. I want to receive notifications from **Faithful Steps** before prayer times so that I can prepare for prayer despite my busy work schedule.  
3. I want to quickly mark prayers as completed in **Faithful Steps** so that I can track my consistency with minimal effort.  
4. I want to specify if I prayed in congregation (jamaah) in **Faithful Steps** so that I can track this important aspect of my practice.  
5. I want to see my prayer completion streak in **Faithful Steps** so that I can stay motivated to maintain consistency.  
6. I want to adjust notification timing preferences in **Faithful Steps** so that reminders fit around my work meetings and commitments.

**As Omar (Beginner/Returning Practitioner)**

1. I want **Faithful Steps** to show me the correct prayer times for my location so that I can establish a proper prayer routine.  
2. I want a simple interface in **Faithful Steps** to mark prayers as completed so that tracking doesn't feel overwhelming as I build my practice.  
3. I want gentle, encouraging reminders for prayers from **Faithful Steps** so that I'm motivated rather than pressured.  
4. I want to see which prayers I've been most consistent with in **Faithful Steps** so I can focus on improving where I struggle.  
5. I want to customize prayer calculation methods in **Faithful Steps** so the times align with my local mosque's schedule.  
6. I want to add notes to my prayer entries in **Faithful Steps** so I can record thoughts or challenges I faced.

**As Ahmed (Religious Knowledge Seeker)**

1. I want to understand different prayer calculation methods available in **Faithful Steps** so I can make an informed choice about which to follow.  
2. I want to see statistics about my prayer consistency within **Faithful Steps** so I can analyze patterns in my practice.  
3. I want to view monthly and weekly prayer completion calendars in **Faithful Steps** so I can identify trends over time.  
4. I want to export my prayer data from **Faithful Steps** so I can perform my own analysis or track long-term progress.

### Quran Reading Interface

**As Ahmed (Religious Knowledge Seeker)**

1. I want to access the Quran within **Faithful Steps** with multiple translations so I can deepen my understanding of the text.  
2. I want to bookmark verses I'm studying in **Faithful Steps** so I can easily return to them later.  
3. I want to track my progress through the entire Quran using **Faithful Steps** so I can establish a consistent reading habit.  
4. I want to see which surahs and juz I've completed in **Faithful Steps** so I can ensure comprehensive coverage.  
5. I want to set and track daily reading goals within **Faithful Steps** so I can maintain consistency.  
6. I want to access the Quran offline within **Faithful Steps** so I can read without internet access.

**As Omar (Beginner/Returning Practitioner)**

1. I want a clean, distraction-free reading interface in **Faithful Steps** so I can focus on the text without overwhelming elements.  
2. I want to adjust text size and enable night mode in **Faithful Steps**' Quran reader so reading is comfortable regardless of lighting conditions.  
3. I want to see transliteration alongside Arabic text in **Faithful Steps** so I can practice reading correctly.  
4. I want **Faithful Steps** to resume from where I last left off so I don't lose my place between sessions.

**As Fatima (Consistent Practitioner)**

1. I want to quickly navigate to specific surahs and verses within **Faithful Steps**' Quran reader so I can reference particular sections efficiently.  
2. I want to see my daily and weekly reading streaks in **Faithful Steps** so I stay motivated to read consistently.  
3. I want to view a calendar showing days I read Quran in **Faithful Steps** so I can track my consistency visually.

### Fasting Tracker

**As Ahmed (Religious Knowledge Seeker)**

1. I want to track both obligatory and optional fasts using **Faithful Steps** so I can maintain a comprehensive record of my practice.  
2. I want to see statistics about my fasting consistency in **Faithful Steps** so I can analyze my patterns.  
3. I want special indicators for Ramadan fasting in **Faithful Steps** so I can distinguish it from optional fasts.

**As Fatima (Consistent Practitioner)**

1. I want to mark days when I complete fasts in **Faithful Steps** so I can track my consistency.  
2. I want to add notes to fasting days in **Faithful Steps** so I can record my experience or intentions.  
3. I want to track specific optional fasts like Mondays/Thursdays using **Faithful Steps** so I can build this beneficial practice.  
4. I want to see my fasting history in a calendar view within **Faithful Steps** so I can visualize my consistency.

**As Omar (Beginner/Returning Practitioner)**

1. I want to learn about recommended optional fasting days through **Faithful Steps** so I can expand my practice beyond Ramadan.  
2. I want gentle reminders from **Faithful Steps** about upcoming recommended fasting days so I can prepare appropriately.

### Progress Dashboard

**As Fatima (Consistent Practitioner)**

1. I want to see my current prayer and reading streaks on the **Faithful Steps** dashboard so I stay motivated to maintain consistency.  
2. I want to view my prayer completion rate on the **Faithful Steps** dashboard so I understand my overall consistency.  
3. I want to see visual statistics of my spiritual practices in **Faithful Steps** so I can quickly gauge my progress.

**As Ahmed (Religious Knowledge Seeker)**

1. I want detailed metrics about my Quran reading progress on the **Faithful Steps** dashboard so I can track pages, surahs, and juz completed.  
2. I want to see trends in my practice over time within **Faithful Steps** so I can identify patterns and make improvements.  
3. I want to track my ratio of prayers performed in congregation vs. individually using **Faithful Steps** so I can work on increasing communal worship.

**As Omar (Beginner/Returning Practitioner)**

1. I want to see simple, encouraging feedback on my progress within **Faithful Steps** so I feel motivated rather than overwhelmed.  
2. I want to view relevant hadith or Quranic verses related to consistency displayed by **Faithful Steps** so I'm spiritually motivated.  
3. I want **Faithful Steps** to show personalized suggestions for improvement based on my practice patterns.

### Achievements System

**As Fatima (Consistent Practitioner)**

1. I want to earn badges in **Faithful Steps** for maintaining prayer streaks so I have tangible recognition of consistency.  
2. I want to receive milestone achievements in **Faithful Steps** for completing significant portions of the Quran.  
3. I want respectful congratulatory messages within **Faithful Steps** that acknowledge achievements without fostering pride.

**As Omar (Beginner/Returning Practitioner)**

1. I want to earn achievable initial badges in **Faithful Steps** so I feel encouraged as I begin my journey.  
2. I want **Faithful Steps** to show clear next steps for progression so I know what to work toward.

**As Ahmed (Religious Knowledge Seeker)**

1. I want to track comprehensive achievements related to Quran completion and consistent practice within **Faithful Steps**.  
2. I want achievements in **Faithful Steps** to be private to my profile rather than publicly ranked.

### Community Features

**As Aisha (Community-Oriented User)**

1. I want to create private groups with friends within **Faithful Steps** so we can support each other's spiritual practices.  
2. I want to share group invite codes/links from **Faithful Steps** so I can easily add trusted friends.  
3. I want to set group challenges within **Faithful Steps** such as "complete all prayers on time this week" to foster mutual accountability.  
4. I want to see our collective progress toward goals in **Faithful Steps** without exposing individual detailed logs.  
5. I want to send encouragement to group members through simple, focused messages within **Faithful Steps**.  
6. I want to indicate my intention to pray/fast/read within my **Faithful Steps** group so group members know I'm committed.

**As Fatima (Consistent Practitioner)**

1. I want to join accountability groups in **Faithful Steps** that respect my privacy preferences.  
2. I want to see group statistics and streaks within **Faithful Steps** to feel part of a community effort.  
3. I want control over what aspects of my practice are visible to my **Faithful Steps** group to maintain appropriate privacy.

**As Omar (Beginner/Returning Practitioner)**

1. I want to join groups within **Faithful Steps** with more experienced practitioners so I can learn from their consistency.  
2. I want to receive encouraging messages from group members within **Faithful Steps** to help me stay motivated.

### Account & Settings

**As Ahmed (Religious Knowledge Seeker)**

1. I want to select my preferred prayer calculation method in **Faithful Steps** from multiple options (MWL, ISNA, Egypt, Makkah, etc.).  
2. I want to specify my Asr calculation preference (Standard/Shafi'i vs. Hanafi) within **Faithful Steps**.  
3. I want to configure high latitude adjustment methods in **Faithful Steps** since I live in a northern region.

**As Fatima (Consistent Practitioner)**

1. I want to control notification settings for each prayer within **Faithful Steps** so they fit my schedule.  
2. I want to choose between dark and light themes in **Faithful Steps** for comfortable use at different times.  
3. I want to manage my **Faithful Steps** account profile information while maintaining privacy.  
4. I want to set my preferred language for the **Faithful Steps** application interface.

**As Aisha (Community-Oriented User)**

1. I want granular privacy controls for group features within **Faithful Steps** so I can decide exactly what to share.  
2. I want to manage group memberships within **Faithful Steps** so I can join or leave groups as needed.  
3. I want to customize my username and optional profile image for **Faithful Steps** group interactions.

**As Omar (Beginner/Returning Practitioner)**

1. I want to manually input my location in **Faithful Steps** instead of using GPS to preserve battery and privacy.  
2. I want **Faithful Steps** to easily explain what data the app collects and how it's used.  
3. I want the option to use **Faithful Steps** without creating an account for basic features.

### PWA Features

**As Fatima (Consistent Practitioner)**

1. I want to install **Faithful Steps** on my phone's home screen for quick access without opening a browser.  
2. I want to receive timely push notifications for prayer times from **Faithful Steps** even when the app is closed.  
3. I want **Faithful Steps** to work offline so I can track prayers and read Quran without internet.

**As Aisha (University Student)**

1. I want **Faithful Steps** to load quickly even on campus WiFi to check prayer times between classes.  
2. I want a responsive design for **Faithful Steps** that works well on both my phone and laptop.  
3. I want to synchronize my **Faithful Steps** data across devices so my tracking is consistent everywhere.

**As Omar (Healthcare Worker)**

1. I want to access prayer times and track worship using **Faithful Steps** even when working in areas with poor connectivity.  
2. I want **Faithful Steps** to use minimal battery since I'm often away from chargers during shifts.  
3. I want to receive notifications from **Faithful Steps** that respect do-not-disturb hours during critical work periods.
