  
**Project Name:** Faithful Steps   
**Project Key:** FS

## Epic 1: Project Foundation & Authentication

**Goal:** Establish the core project structure for Faithful Steps using Next.js, set up the development environment, and implement secure user authentication using Clerk, enabling users to sign up, log in, and have their identity managed. Connect the frontend to the Supabase backend.

**Tickets:**

1. **FS-1: Setup Project Structure & Dependencies (Next.js)**  
     
   * **Background:** Initialize the Replit environment for a Next.js (TypeScript) frontend project. Set up necessary dependencies (Next.js, React, TypeScript, Tailwind CSS, Supabase client, Clerk client SDK). Configure basic PWA manifest (`next-pwa` recommended) and service worker placeholders. Establish Git repository.  
   * **Acceptance Criteria:**  
     * A new Next.js (TypeScript) project is created using `create-next-app` and runnable on Replit.  
     * Tailwind CSS is configured and usable for styling.  
     * Supabase JS client (`@supabase/supabase-js`) is installed.  
     * Clerk Next.js SDK (`@clerk/nextjs`) is installed.  
     * A basic `manifest.json` file exists (likely configured via `next-pwa` or manually in `public`).  
     * An empty `service-worker.js` file (or managed via `next-pwa`) exists and is registered.  
     * Project is pushed to a Git repository.  
     * Basic Next.js structure (`pages/`, `public/`, `styles/`) is present.  
   * **Technology Suggestions:** `create-next-app`, npm/yarn, Git, Replit Secrets for API keys, `next-pwa` (optional but recommended for PWA features), Tailwind CSS.  
   * **Testing Steps:**  
     1. Clone the repository into a fresh Replit instance (or local environment).  
     2. Run `npm install` (or equivalent).  
     3. Run the development server (`npm run dev`).  
     4. Verify the basic Next.js app loads in the browser without errors.  
     5. Inspect browser dev tools to confirm the manifest is linked and the service worker is registered (even if inactive).  
     6. Attempt to use a basic Tailwind class on an element and verify it applies styling.

   

2. **FS-2: Implement User Registration & Login UI with Clerk (Next.js)**  
     
   * **Background:** Create the basic UI components for user sign-up and sign-in using Next.js file-based routing. Integrate Clerk's Next.js components or use Clerk SDK hooks to build custom forms for handling email/password registration and login. Include options for OAuth providers configured in Clerk (e.g., Google). Protect specific routes.  
   * **Acceptance Criteria:**  
     * A dedicated `/sign-up` route/page (`pages/sign-up/[[...index]].tsx`) exists using Clerk's component.  
     * A dedicated `/sign-in` route/page (`pages/sign-in/[[...index]].tsx`) exists using Clerk's component.  
     * Configured OAuth provider buttons (e.g., Google) are displayed on signup/login forms via Clerk config.  
     * Users can successfully register using email and password via the UI, handled by Clerk.  
     * Users can successfully log in using their registered email and password via the UI, handled by Clerk.  
     * Users can successfully sign up/log in using configured OAuth providers via Clerk.  
     * Appropriate loading states and error messages from Clerk are displayed to the user during auth processes.  
     * Basic route protection using Clerk's Next.js helpers (e.g., `withAuth`) protects authenticated routes (e.g., a placeholder `/dashboard`).  
   * **Technology Suggestions:** Next.js file-based routing, Clerk Next.js SDK (`<SignUp>`, `<SignIn>`, `useAuth`, `useUser`, middleware/route protection helpers), Tailwind CSS.  
   * **Testing Steps:**  
     1. Navigate to `/sign-up`. Attempt registration with email/password. Verify success and check Clerk dashboard.  
     2. Attempt registration with invalid email/weak password. Verify errors.  
     3. Navigate to `/sign-in`. Attempt login with created credentials. Verify success.  
     4. Attempt login with incorrect credentials. Verify errors.  
     5. (If Google OAuth configured): Click "Sign in with Google". Complete flow. Verify login/signup success and check Clerk user data.  
     6. Attempt to access a protected route (e.g., `/dashboard`) while logged out. Verify redirection to login.  
     7. Log in and access protected route. Verify access granted.

   

2. **FS-3: Implement User Logout & Session Management (Next.js)**  
     
   * **Background:** Provide a way for logged-in users to log out. Ensure Clerk's Next.js session management correctly identifies authenticated users and handles token refresh automatically via the SDK. Display user state conditionally in the UI.  
   * **Acceptance Criteria:**  
     * A logout button/link is available for authenticated users (e.g., in navbar or using Clerk's `<UserButton>`).  
     * Clicking logout successfully signs the user out via Clerk SDK.  
     * User is redirected to a public page (e.g., `/sign-in` or `/`) after logout.  
     * UI elements (e.g., navbar) conditionally display login/signup or logout/profile links based on authentication state using Clerk's `<SignedIn>`/`<SignedOut>` components.  
     * Authenticated user sessions persist across page refreshes.  
   * **Technology Suggestions:** Clerk Next.js SDK (`useAuth().signOut`, `<SignedIn>`, `<SignedOut>`, `<UserButton>`), Next.js routing, conditional rendering.  
   * **Testing Steps:**  
     1. Log in to the application. Verify UI shows logged-in state (e.g., `<UserButton>` appears).  
     2. Refresh the page. Verify user remains logged in.  
     3. Click the logout button (within `<UserButton>` or custom). Verify user is redirected to a public page.  
     4. Verify UI shows logged-out state (e.g., Sign In link appears). Attempt to access a protected route. Verify redirection.

   

2. **FS-4: Connect Frontend to Supabase & Basic User Profile Sync**  
     
   * **Background:** Initialize the Supabase client in the Next.js application using environment variables. Create a basic `profiles` table in Supabase. Implement logic using a Clerk webhook triggering a Supabase Edge Function to create/update a corresponding user profile entry in Supabase when a user signs up or updates relevant info via Clerk, linking via the Clerk User ID.  
   * **Acceptance Criteria:**  
     * Supabase client is initialized successfully using API URL and anon key from environment variables (`.env.local`).  
     * A `profiles` table exists in Supabase (columns: `id` (UUID, PRIMARY KEY, matches Clerk User ID), `username` (TEXT, UNIQUE, NOT NULL), `display_name` (TEXT), `avatar_url` (TEXT), `created_at` (TIMESTAMPTZ), `updated_at` (TIMESTAMPTZ)).  
     * A Supabase Edge Function exists, triggered by a Clerk webhook (e.g., `user.created`, `user.updated`).  
     * The function correctly upserts data into the `profiles` table based on the webhook payload (using Clerk User ID as the primary key `id`, extracting username, potentially email for initial username).  
     * Basic Row Level Security (RLS) is enabled on the `profiles` table ensuring users can only select/update their own profile (using Supabase's `auth.uid()` function which *must* be configured to match the Clerk User ID via JWT template in Supabase Auth settings).  
   * **Technology Suggestions:** Supabase JS client, Next.js environment variables (`.env.local`), Supabase SQL Editor/Migrations, Supabase RLS policies (configured with Clerk JWT template), Supabase Edge Functions (Deno/TypeScript), Clerk Webhooks.  
   * **Testing Steps:**  
     1. Check Next.js environment variables/Replit secrets for Supabase keys. Verify Clerk webhook points to the Supabase Function URL. Ensure Supabase Auth JWT template is configured for Clerk.  
     2. Inspect Supabase dashboard (`profiles` table structure, RLS policies, Function logs).  
     3. Register a *new* user via the Clerk UI.  
     4. Check the Supabase Function logs to verify the webhook was received and processed successfully.  
     5. Check the Supabase `profiles` table to verify a new row exists with `id` matching the new Clerk User ID and correct username.  
     6. (Manual Query Test): Using Supabase JS client *authenticated as that user* (via Clerk token propagation to Supabase), attempt to select the profile row. Verify success. Attempt while authenticated as a *different* user. Verify failure due to RLS.

---

## Epic 2: Core Prayer Functionality

**Goal:** Enable users to view accurate prayer times for their location, log their daily prayer completion status with details, store this data securely in Supabase, and view their history within the Faithful Steps app.

**Tickets:**

2. **FS-5: Integrate Prayer Time Calculation & Display (Today)**  
     
   * **Background:** Fetch prayer times for the current day using the Al Adhan API based on either user's Geolocation (with permission) or manually entered coordinates/city stored in user settings (Supabase `profiles` table). Implement offline calculation using Adhan.js as a fallback. Display these times clearly in the Next.js UI.  
   * **Acceptance Criteria:**  
     * App checks user settings (Supabase `profiles` table, fetched via Supabase client) for stored location/method preferences if logged in.  
     * If no location set or user is logged out, prompt for Geolocation permission or manual input (handled client-side).  
     * Today's prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha, optionally Sunrise) are displayed based on location/settings.  
     * Times are fetched from Al Adhan API when online.  
     * Adhan.js library calculates times when offline (using stored location/settings if available, or session input otherwise).  
     * Loading/error states are handled.  
     * Displayed times reflect user's selected calculation method/Asr preference (from settings, use defaults initially).  
   * **Technology Suggestions:** Browser Geolocation API, `fetch` API / Serverless Function for API call, Al Adhan API endpoint, Adhan.js library, React state management (useState, useEffect), Supabase client (to get/set user location/prefs in `profiles`).  
   * **Testing Steps:**  
     1. Load app (new user/logged out). Verify prompt for location or manual input. Grant permission/enter location. Verify times appear.  
     2. Cross-reference times with a trusted source.  
     3. Simulate offline mode (browser dev tools). Refresh. Verify times are still displayed (calculated locally by Adhan.js).  
     4. (Later, after settings implemented) Log in, change location/method in settings. Verify prayer times display updates accordingly.

   

2. **FS-6: Implement Daily Prayer Logging UI**  
     
   * **Background:** Create the UI component within the Next.js app allowing users to mark each of the five daily prayers as completed for the *current* day. This should be a simple, intuitive interface (e.g., checklist, tappable buttons).  
   * **Acceptance Criteria:**  
     * A UI element displays the five prayers for the current day alongside their times.  
     * Each prayer has interactive elements (e.g., buttons for 'On Time', 'Delayed', 'Jamaah', 'Missed').  
     * Clicking an element selects that status and provides immediate visual feedback (e.g., highlighting the chosen button, updating a summary).  
     * Only one status can be active per prayer (selecting one deselects others). Requires login to interact.  
   * **Technology Suggestions:** React components (within Next.js pages/components), state management (local component state or global store like Zustand/Context), Tailwind CSS.  
   * **Testing Steps:**  
     1. Log in. View the prayer tracking section for today.  
     2. Click the 'On Time' button for Fajr. Verify it becomes visually selected.  
     3. Click the 'Delayed' button for Fajr. Verify 'On Time' deselects and 'Delayed' becomes selected.  
     4. Click the 'Missed' button for Dhuhr. Verify selection.  
     5. Repeat for other prayers and statuses. Ensure UI disabled/prompts login if logged out.

   

2. **FS-7: Persist Prayer Log Data to Supabase**  
     
   * **Background:** Connect the prayer logging UI to the Supabase backend. Create a `prayer_log` table in Supabase. When a logged-in user selects a prayer status, save/update this information (user ID, date, prayer name, status) to the database using the Supabase client. Implement RLS.  
   * **Acceptance Criteria:**  
     * A `prayer_log` table exists in Supabase (columns: `id` (UUID, PK), `user_id` (UUID, FK to `profiles.id`), `date` (DATE), `prayer_name` (ENUM/TEXT: 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'), `status` (ENUM/TEXT: 'On Time', 'Delayed', 'Jamaah', 'Missed', 'Not Logged'), `created_at` (TIMESTAMPTZ), `updated_at` (TIMESTAMPTZ)). Constraint: UNIQUE(`user_id`, `date`, `prayer_name`).  
     * When a prayer status is selected in the UI *by a logged-in user*, the corresponding record is upserted into the `prayer_log` table via the Supabase client.  
     * The `user_id` correctly links the log to the authenticated user (using Clerk User ID passed to Supabase).  
     * RLS ensures users can only CRUD their *own* prayer log entries (based on `auth.uid()`).  
     * Data persists across page refreshes (fetched from Supabase on load for logged-in users).  
   * **Technology Suggestions:** Supabase JS client (`upsert`), Supabase SQL Editor/Migrations (use ENUM type for status/prayer\_name), Supabase RLS policies (using `auth.uid()`).  
   * **Testing Steps:**  
     1. Log in as User A (ensure Clerk auth propagates to Supabase). Mark Fajr as 'On Time', Dhuhr as 'Delayed'.  
     2. Check Supabase `prayer_log`. Verify two rows exist for User A (matching Clerk ID) for today with correct statuses.  
     3. Refresh application. Verify UI reflects the saved statuses for User A.  
     4. Change Fajr status to 'Jamaah'. Check Supabase. Verify the existing row for Fajr was updated (upsert).  
     5. Log in as User B. Verify User A's logs aren't shown. Log Asr as 'Missed'. Verify data saved correctly for User B in Supabase.

   

2. **FS-34: Add Notes Field to Prayer Log** (New Ticket based on User Story Omar-6)  
     
   * **Background:** Enhance the prayer log feature to allow logged-in users to optionally add short text notes to each prayer entry.  
   * **Acceptance Criteria:**  
     * A small text input or button revealing a text area is available for each prayer log entry in the UI.  
     * The `prayer_log` table in Supabase has a new `notes` column (TEXT, nullable).  
     * User-entered notes are saved to the `notes` column when the prayer log is updated/created via Supabase client.  
     * Saved notes are displayed when viewing the prayer log entry.  
     * Notes field is optional. RLS applies.  
   * **Technology Suggestions:** Update React components (add input/textarea), update Supabase migration, update Supabase `upsert` call.  
   * **Testing Steps:**  
     1. Log in. Mark Fajr as 'On Time'. Add a note "Felt peaceful". Save/log.  
     2. Check Supabase `prayer_log` table. Verify the note is saved in the correct row for the logged-in user.  
     3. Refresh the page or view the entry again. Verify the note "Felt peaceful" is displayed alongside the Fajr entry.  
     4. Log Dhuhr without a note. Verify the notes column is null/empty for that entry in Supabase.

   

2. **FS-9: Add Calendar View for Prayer History**  
     
   * **Background:** Implement a calendar component to display the logged-in user's prayer log history. Fetch data from Supabase for the displayed month/week and use visual cues on the calendar days to summarize completion status (e.g., heatmap based on number completed/on time).  
   * **Acceptance Criteria:**  
     * A calendar view is available (e.g., on dashboard or dedicated history page) for logged-in users.  
     * Users can navigate between months/weeks.  
     * Days on the calendar visually indicate the overall prayer status/completion for that day using colors or icons (e.g., 5/5 prayers logged might be dark green, 3/5 light green, 0/5 grey).  
     * Data for the calendar view is fetched efficiently from the Supabase `prayer_log` table for the relevant date range and authenticated user (respecting RLS).  
     * Clicking a day might show a summary or link to that day's detailed log (optional enhancement).  
   * **Technology Suggestions:** `react-calendar` library or similar, Supabase JS client (querying with date ranges, aggregation/count respecting RLS), React components within Next.js, date manipulation library.  
   * **Testing Steps:**  
     1. Log in. Log prayer data for several days with varying statuses/completion numbers.  
     2. Navigate to the calendar view. Verify correct month shown.  
     3. Verify days with logged data have visual indicators reflecting completion level (e.g., color intensity).  
     4. Navigate months. Verify calendar updates. Ensure only logged-in user's data is shown. Log out, ensure view is inaccessible or shows empty state.

---

## Epic 3: Quran Reader Implementation

**Goal:** Provide users with a functional, accessible Quran reading interface within Faithful Steps, allowing navigation, viewing text/translations/transliteration, bookmarking, tracking progress, and enabling offline reading.

**Tickets:**

2. **FS-10: Fetch and Display Quran Text & Basic Navigation**  
     
   * **Background:** Integrate a Quran API (e.g., Al-Quran Cloud, Fawazahmed0 static JSON) to fetch Arabic text. Implement a basic reader UI within the Next.js app allowing users to select a Surah and view its Ayahs sequentially.  
   * **Acceptance Criteria:**  
     * Users can select a Surah from a list/dropdown.  
     * Upon selection, the Arabic text for all Ayahs in that Surah is fetched (client-side or via Next.js API route/getServerSideProps) and displayed.  
     * Ayahs are clearly numbered.  
     * Basic pagination or scrolling allows viewing the entire Surah.  
     * Loading/error states handled. Display API attribution.  
   * **Technology Suggestions:** `fetch` API, chosen Quran API, React components in Next.js, state management, virtual scrolling library (optional).  
   * **Testing Steps:**  
     1. Navigate to Quran reader page. Select Surah 1\. Verify 7 verses displayed.  
     2. Select Surah 2\. Verify start displayed, scroll/paginate to load more.  
     3. Check attribution. Simulate API error, verify message.

   

2. **FS-11: Add Quran Translations & Transliteration**  
     
   * **Background:** Enhance reader to fetch/display selected translations and optional transliteration based on user preferences (use defaults first, settings later in Epic 8).  
   * **Acceptance Criteria:**  
     * At least one default English translation is displayed alongside/below Arabic text.  
     * Optional: Default transliteration is displayed.  
     * UI remains clear and readable.  
     * API calls fetch required data efficiently.  
   * **Technology Suggestions:** Update API calls (client-side or backend), update React components, CSS/Tailwind for layout.  
   * **Testing Steps:**  
     1. Select Surah 112\. Verify Arabic, default English translation, and (if applicable) default transliteration are displayed per verse.  
     2. Verify layout readability on different screen sizes.

   

2. **FS-35: Implement Quran Reader Navigation (Ayah/Juz)** (New Ticket based on User Story Fatima-1)  
     
   * **Background:** Add controls to allow users to navigate directly to a specific Ayah number within the current Surah, or to jump to the start of a specific Juz'.  
   * **Acceptance Criteria:**  
     * UI controls (e.g., input field, dropdown) allow users to select/enter an Ayah number or Juz' number.  
     * Activating the control scrolls/navigates the reader view to the specified Ayah or the beginning of the specified Juz'.  
     * Input validation prevents selecting invalid Ayah/Juz' numbers for the current view.  
   * **Technology Suggestions:** React components (input, select), state management, DOM manipulation (scrolling to element ID) or adjusting pagination logic.  
   * **Testing Steps:**  
     1. Navigate to Surah Al-Baqarah (2) in the reader.  
     2. Use the Ayah navigation control to enter '15'. Verify the view scrolls/updates to show Ayah 15 prominently.  
     3. Use the Juz' navigation control to select Juz' 2\. Verify the view navigates/updates to show the start of Juz' 2 (which is within Surah Al-Baqarah).  
     4. Try entering an invalid Ayah number (e.g., 500 for Surah 2). Verify error indication or no action.

   

2. **FS-12: Implement Basic Quran Offline Caching (PWA)**  
     
   * **Background:** Use the Service Worker (configured possibly via `next-pwa`) to cache Quran text (Arabic \+ selected default translation/transliteration) that the user has viewed. Enable reading previously viewed Surahs offline.  
   * **Acceptance Criteria:**  
     * Service Worker configured (e.g., using Workbox via `next-pwa`) with caching strategy for Quran API responses (e.g., StaleWhileRevalidate or CacheFirst).  
     * Viewed Surahs' text and default translation/transliteration are cached.  
     * Previously viewed Surahs are accessible and readable offline.  
     * Non-viewed Surahs show an offline message or are inaccessible when offline.  
   * **Technology Suggestions:** Service Worker API, Workbox library (integrated via `next-pwa`), Cache API.  
   * **Testing Steps:**  
     1. Online: View Surah 1 and Surah 114\.  
     2. Go Offline (browser dev tools). Reload app.  
     3. Navigate to Quran reader. View Surah 1 (should load from cache). View Surah 114 (should load from cache).  
     4. Attempt to view Surah 2 (should fail gracefully or show offline message).

   

2. **FS-13: Implement Quran Bookmarking & Resume Reading**  
     
   * **Background:** Allow logged-in users to bookmark specific Ayahs. Automatically save the last read position (Surah/Ayah) for logged-in users. Persist this data in Supabase. Provide UI to jump to bookmarks or resume reading.  
   * **Acceptance Criteria:**  
     * Bookmark icon/button per Ayah saves reference (user\_id, surah, ayah) to Supabase `bookmarks` table for logged-in users.  
     * Last read Surah/Ayah automatically saved to Supabase `profiles` or a dedicated `reading_state` table for logged-in users.  
     * "Resume Reading" button/link navigates the reader view to the last saved position.  
     * A dedicated bookmarks section/page lists saved bookmarks, allowing navigation to the bookmarked Ayah.  
     * RLS protects user-specific bookmark and reading state data in Supabase.  
   * **Technology Suggestions:** Supabase JS client, Supabase tables (`bookmarks` (user\_id, surah, ayah, created\_at), `profiles`/`reading_state` (user\_id, last\_surah, last\_ayah, updated\_at)), Supabase RLS policies, React state/context, UI components within Next.js.  
   * **Testing Steps:**  
     1. Log in. Navigate to Quran reader. Bookmark 2:10 and 3:5. Check Supabase `bookmarks` table for User A's entries.  
     2. Read up to 2:20. Navigate away or close tab. Check Supabase `profiles` or `reading_state` for saved state (2:20).  
     3. Return to app. Click "Resume Reading". Verify reader navigates to Surah 2, Ayah 20\.  
     4. Go to bookmarks list page. Click bookmark for 3:5. Verify reader navigates to Surah 3, Ayah 5\.  
     5. Log out. Verify bookmarking/resume features are disabled or use local storage (see Epic 9).

   

2. **FS-36: Log Quran Reading Sessions** (New Ticket needed for tracking)  
     
   * **Background:** To enable progress tracking (streaks, calendars, % completion), log when a logged-in user actively reads Quran. This could be based on time spent, pages/verses scrolled through, or marking a session complete. Store this log in Supabase.  
   * **Acceptance Criteria:**  
     * A `quran_reading_log` table exists in Supabase (e.g., `id` (UUID, PK), `user_id` (UUID, FK), `date` (DATE), `start_surah` (INT), `start_ayah` (INT), `end_surah` (INT), `end_ayah` (INT), `duration_minutes` (INT, optional), `created_at` (TIMESTAMPTZ)).  
     * When a logged-in user finishes a reading session (e.g., navigates away from reader after significant activity, or manually marks session end), a record is created in `quran_reading_log` via Supabase client.  
     * The log captures the date and ideally the range read (e.g., start/end Surah:Ayah). Approximation is acceptable.  
     * RLS protects this log data in Supabase.  
   * **Technology Suggestions:** Supabase JS client, Supabase SQL/Migrations, Supabase RLS policies, React component lifecycle methods (`useEffect` cleanup) or interaction listeners (visibility API, scroll events) to detect session end/activity.  
   * **Testing Steps:**  
     1. Log in as User A. Open Quran reader. Read from 2:1 to 2:5. Navigate away from the reader page.  
     2. Check Supabase `quran_reading_log` table. Verify a record exists for today, User A, indicating roughly the range read (e.g., start 2:1, end 2:5).  
     3. Read again later, e.g., 3:10 to 3:15. Navigate away. Verify another log entry is created for User A.  
     4. Log in as User B. Verify no logs from User A are visible/fetched.

---

## Epic 4: Fasting Tracking Feature

**Goal:** Allow logged-in users of Faithful Steps to log their fasting days (Ramadan, voluntary, make-up) with types and optional notes using a calendar interface, persisting the data securely in Supabase.

**Tickets:**

2. **FS-14: Create Fasting Log UI & Basic Logging**  
     
   * **Background:** Implement a calendar interface within the Next.js app for tracking fasts. Allow logged-in users to tap/click a day to mark it as "fasted".  
   * **Acceptance Criteria:**  
     * Dedicated fasting tracking section/page accessible to logged-in users.  
     * Displays a calendar interface.  
     * Selecting a day visually marks it as "fasted".  
     * Selecting an already marked day unmarks it.  
     * Users can navigate between months.  
   * **Technology Suggestions:** `react-calendar` or similar library, React components within Next.js, state management.  
   * **Testing Steps:**  
     1. Log in. Navigate to fasting tracker page.  
     2. Select today's date on the calendar. Verify visual change indicating "fasted".  
     3. Select yesterday's date. Verify change. Select today again. Verify it gets unmarked.  
     4. Navigate between months.

   

2. **FS-15: Persist Fasting Log Data to Supabase**  
     
   * **Background:** Create a `fasting_log` table in Supabase. Connect the UI (FS-14) so that marking/unmarking a day saves or deletes the corresponding fasting record for the logged-in user via the Supabase client. Implement RLS.  
   * **Acceptance Criteria:**  
     * `fasting_log` table exists in Supabase (columns: `id` (UUID, PK), `user_id` (UUID, FK), `date` (DATE), `fasting_type` (ENUM/TEXT: 'Ramadan', 'Voluntary', 'Qada', 'Missed'), `notes` (TEXT, nullable), `created_at` (TIMESTAMPTZ)). Constraint: UNIQUE(`user_id`, `date`).  
     * Marking/unmarking a day in the UI upserts/deletes the record in `fasting_log` via Supabase client, using a default type (e.g., 'Voluntary') initially.  
     * Data is linked to the authenticated `user_id`. RLS ensures users CRUD only their own data.  
     * Fasting status persists on page refresh (fetched from Supabase).  
   * **Technology Suggestions:** Supabase JS client (`upsert`, `delete`), Supabase SQL/Migrations (use ENUM type for `fasting_type`), Supabase RLS policies.  
   * **Testing Steps:**  
     1. Log in as User A. Mark today and yesterday as fasted. Check Supabase `fasting_log` for User A's records. Refresh app, verify calendar state persists.  
     2. Unmark yesterday. Check Supabase (row for yesterday should be deleted or updated if 'Not Fasted' state exists).  
     3. Log in as User B. Verify User A's fasting data is not visible. Mark a day as fasted. Verify saved correctly for User B in Supabase.

   

2. **FS-16: Implement Different Fasting Types (Ramadan, Voluntary, Make-up)**  
     
   * **Background:** Enhance the fasting log UI to allow users to select the type of fast (Ramadan, Voluntary, Qada, Missed) when marking a day. Display different visual indicators on the calendar for different types. Optionally, identify approximate Ramadan dates.  
   * **Acceptance Criteria:**  
     * UI allows selecting the fast type (e.g., via a modal or dropdown when clicking a day) before saving.  
     * The selected `fasting_type` is stored in the Supabase `fasting_log` table.  
     * Calendar displays different visual cues (colors, icons) for different fasting types.  
     * App identifies approximate Ramadan dates based on current year (using a Hijri library) and highlights them or suggests 'Ramadan' type.  
   * **Technology Suggestions:** Update UI components (modal/dropdown), update Supabase client calls to include `fasting_type`, Hijri date library (e.g., `moment-hijri`, `hijri-js`), update calendar day rendering logic.  
   * **Testing Steps:**  
     1. Find an approximate Ramadan date on the calendar. Mark it, select type 'Ramadan'. Verify distinct visual cue and correct `fasting_type` saved in Supabase.  
     2. Mark a non-Ramadan date, select 'Voluntary'. Verify UI/DB.  
     3. Mark another day, select 'Qada'. Verify UI/DB. Mark another, select 'Missed'. Verify UI/DB.  
     4. Observe the calendar for clear visual differences between the logged fast types.

   

2. **FS-37: Add Notes Field to Fasting Log** (New Ticket based on User Story Fatima-2)  
     
   * **Background:** Allow logged-in users to optionally add short text notes to each fasting day entry.  
   * **Acceptance Criteria:**  
     * UI provides a way to add notes when logging or editing a fasting day (e.g., in the same modal/form where type is selected).  
     * The `fasting_log` table's `notes` column stores the entered text.  
     * Notes are saved/retrieved correctly via Supabase client and displayed when viewing the log entry details.  
     * Notes are optional. RLS applies.  
   * **Technology Suggestions:** Update React components, update Supabase `upsert` call to include `notes`.  
   * **Testing Steps:**  
     1. Log in. Mark today as 'Voluntary' fast. Add note "Easy fast today". Save.  
     2. Check Supabase `fasting_log`. Verify note saved for the correct user/date.  
     3. View the entry details again (e.g., by clicking the day). Verify the note is displayed.  
     4. Log another fasting day without a note. Verify the notes column is null or empty in Supabase for that entry.

---

## Epic 5: Dashboard & Personal Motivation

**Goal:** Provide logged-in users of Faithful Steps with a personalized dashboard summarizing progress across prayers, fasting, and Quran reading, incorporating motivational elements like streaks, achievements, and visualizations fetched from Supabase.

**Tickets:**

2. **FS-17: Implement Basic Dashboard Structure & Data Fetching**  
     
   * **Background:** Create the main dashboard page (e.g., `/dashboard`) accessible only to logged-in users. Fetch the user's summary data for today (prayer status, fasting status, last Quran position/log) from Supabase. Display basic info.  
   * **Acceptance Criteria:**  
     * `/dashboard` route exists and is protected (requires login via Clerk/Next.js).  
     * Fetches relevant data for the authenticated user from Supabase tables (`prayer_log`, `fasting_log`, `reading_state`/`quran_reading_log`) respecting RLS. Data fetching can be client-side or server-side (SSR/ISR).  
     * Displays summary for today (e.g., "Prayers: 3/5 logged", "Fasting Today: Voluntary", "Last read: Surah X, Ayah Y").  
     * Handles loading and error states gracefully.  
   * **Technology Suggestions:** Next.js page route (`pages/dashboard.tsx`), Clerk helpers for auth protection, Supabase JS client, React components, state management.  
   * **Testing Steps:**  
     1. Log in. Ensure prayer/fasting/reading data exists for today for this user in Supabase. Navigate to `/dashboard`.  
     2. Verify loading indicator, then verify displayed summary accurately matches the logged data from Supabase.  
     3. Log more data (e.g., another prayer). Refresh dashboard. Verify summary updates. Simulate Supabase error, verify error message shown. Log out, verify redirection from `/dashboard`.

   

2. **FS-18: Implement Streak Calculation and Display**  
     
   * **Background:** Calculate the logged-in user's current streaks (e.g., consecutive days praying all 5 prayers, consecutive days reading Quran based on `quran_reading_log`). Fetch necessary data from Supabase and perform calculation. Display streaks on the dashboard.  
   * **Acceptance Criteria:**  
     * Logic exists (client-side, Next.js API route, or Supabase Function) to calculate consecutive days meeting specific criteria (e.g., 5 prayers logged with status 'On Time'/'Delayed'/'Jamaah', any entry in `quran_reading_log` for the day).  
     * Calculation queries relevant Supabase tables (`prayer_log`, `quran_reading_log`) for the authenticated user, ordered by date.  
     * Current streaks ("Prayer Streak: X days", "Quran Reading Streak: Y days") are displayed on the dashboard.  
     * Streaks correctly reset to 0 if a day is missed according to the criteria. Handles initial state (no data).  
   * **Technology Suggestions:** Supabase JS client (efficient queries), JavaScript date logic for sequence checking, React components. Calculation could be done client-side or via a dedicated Supabase Function for potentially better performance/reusability.  
   * **Testing Steps:**  
     1. Log in. Ensure user has logged 5 prayers daily for the past 3 days and logged Quran reading (FS-36) daily for the past 2 days.  
     2. View dashboard. Verify display shows "Prayer Streak: 3 days", "Quran Reading Streak: 2 days".  
     3. Manually update Supabase data to mark one prayer 'Missed' yesterday. Refresh dashboard. Verify Prayer Streak resets to 0 (or 1 if today's criteria met).  
     4. Ensure today's logs meet criteria. Check dashboard tomorrow, verify streaks increment correctly.

   

2. **FS-19: Add Progress Visualizations (Charts/Heatmap/Quran Progress)**  
     
   * **Background:** Enhance the dashboard with visual representations of the user's progress: potentially a bar chart showing prayer completion counts for the last 7 days, a prayer history heatmap calendar (reusing FS-9 component), and an overall Quran reading progress indicator (% completed).  
   * **Acceptance Criteria:**  
     * Dashboard includes at least one visualization like a prayer completion bar chart (last 7 days) or the prayer heatmap calendar.  
     * Dashboard displays an estimated Quran completion percentage (e.g., calculated based on the highest Surah/Ayah reached in `reading_state` or aggregated from `quran_reading_log`, needs a defined total like 6236 verses).  
     * Visualizations accurately reflect the logged-in user's data fetched from Supabase (respecting RLS).  
     * Charts are clear, understandable, and responsive.  
   * **Technology Suggestions:** Charting library (Chart.js, Recharts), reuse calendar component (FS-9), Supabase JS client (aggregation queries), React components. Logic for % Quran complete calculation needed.  
   * **Testing Steps:**  
     1. Log in. Ensure prayer data exists for the last week. View dashboard. Verify bar chart or heatmap accurately reflects the counts/statuses.  
     2. Ensure Quran reading state/logs exist. View dashboard. Verify Quran % complete is displayed and seems reasonable based on the latest logs or reading state.  
     3. Log more data impacting the visualizations. Refresh dashboard. Verify visualizations update correctly.

   

2. **FS-20: Implement Achievement/Badge System (Backend Logic)**  
     
   * **Background:** Define criteria for various achievements (e.g., "First Prayer Logged", "7-day Prayer Streak", "Completed 1 Juz", "Fasted 10 Voluntary Days", "Read Surah Al-Kahf on Friday"). Create necessary Supabase tables (`achievements` definition, `user_achievements` link). Implement logic, preferably using a Supabase Function (triggered or scheduled), to check criteria and award achievements to users.  
   * **Acceptance Criteria:**  
     * `achievements` table exists in Supabase (e.g., `id`, `name`, `description`, `icon_url`, `criteria_data` (JSONB)).  
     * `user_achievements` table exists (e.g., `id`, `user_id` (FK), `achievement_id` (FK), `achieved_at` (TIMESTAMPTZ)). Constraint: UNIQUE(`user_id`, `achievement_id`).  
     * A Supabase Function (triggered by log table inserts/updates or run on a schedule) correctly identifies when a user meets the defined criteria based on their logs (`prayer_log`, `fasting_log`, `quran_reading_log`/`reading_state`).  
     * A record is inserted into `user_achievements` when criteria are met for the first time. RLS protects `user_achievements`.  
   * **Technology Suggestions:** Supabase SQL/Migrations, Supabase Edge Functions (TypeScript/Deno, using Supabase client), potentially database triggers or cron job scheduling (pg\_cron).  
   * **Testing Steps:**  
     1. Define a simple "First Prayer Logged" achievement in `achievements`. Log in as a new user. Log one prayer. Trigger/wait for the check function. Verify a record appears in `user_achievements` for this user and achievement.  
     2. Define a "3-day Prayer Streak" achievement. Log 5 prayers daily for 3 consecutive days. Verify the achievement is awarded after the 3rd day's logs are processed by the function.  
     3. Define "Read Surah Al-Fatihah". Log reading of Surah 1 (requires tracking from FS-36 or similar). Verify achievement awarded. Ensure achievements are not awarded multiple times.

   

2. **FS-21: Display Earned Badges & Motivational Quotes**  
     
   * **Background:** Fetch and display the logged-in user's earned achievements/badges on their profile or dashboard. Display a daily motivational quote (e.g., from Hadith or Quran) sourced from an API or a curated list in Supabase.  
   * **Acceptance Criteria:**  
     * Dashboard or profile page displays icons/names of earned badges by fetching data from `user_achievements` (joining with `achievements` for details) for the logged-in user via Supabase client.  
     * A designated area on the dashboard or elsewhere displays a daily motivational quote with its source/attribution.  
     * Quote is fetched randomly or sequentially from a Hadith/Quran API or a dedicated `quotes` table in Supabase.  
   * **Technology Suggestions:** React components within Next.js, Supabase JS client (querying user achievements), potentially `fetch` for external quote API, UI elements for badges (images/icons).  
   * **Testing Steps:**  
     1. Log in as a user who has earned badges (from FS-20 testing). Navigate to dashboard/profile. Verify the earned badges are displayed correctly.  
     2. Verify a motivational quote is displayed with attribution. Refresh the page (or revisit next day), verify quote potentially changes.  
     3. Log in as a user with no badges. Verify the badge section is empty or shows a placeholder. Ensure only the logged-in user's badges are shown.

   

2. **FS-38: Display Advanced Dashboard Metrics** (New Ticket based on User Stories Ahmed-1, Ahmed-3)  
     
   * **Background:** Add more detailed metrics to the dashboard based on analysis of user logs, such as Quran reading statistics (pages/surahs/juz read this week/month) and prayer Jamaah vs. individual ratio over a period.  
   * **Acceptance Criteria:**  
     * Dashboard displays statistics derived from `quran_reading_log` for the logged-in user (e.g., "Juz' read this month: 2", "Avg. Reading Time: X mins"). Requires aggregation queries on Supabase.  
     * Dashboard displays Jama'ah prayer ratio (e.g., "Congregational Prayers (Last 7 days): 40%") calculated from `prayer_log` data for the logged-in user. Requires aggregation.  
     * Calculations are accurate based on the user's logged data in Supabase.  
     * Metrics are presented clearly and concisely on the dashboard.  
   * **Technology Suggestions:** Supabase JS client (using more complex aggregation queries: COUNT, SUM, AVG, date ranges, filtering, GROUP BY), React components, data processing logic (client-side or via Supabase Function/View).  
   * **Testing Steps:**  
     1. Log in. Ensure sufficient `quran_reading_log` data exists spanning specific Juz ranges over the past month. Check dashboard. Verify the calculated Juz count/stats seem accurate.  
     2. Ensure `prayer_log` data exists for the past week, with a mix of 'Jamaah' and other statuses ('On Time'/'Delayed'). Check dashboard. Verify the Jama'ah ratio calculation is correct (e.g., count(Jamaah) / count(Jamaah or OnTime or Delayed) \* 100).  
     3. Log more relevant data. Refresh dashboard. Verify metrics update accordingly.

---

## Epic 6: Private Community Groups

**Goal:** Enable logged-in users of Faithful Steps to create or join small, private groups for mutual encouragement and accountability, allowing discreet sharing of progress summaries, setting group challenges, and basic communication, all managed via Supabase.

**Tickets:**

2. **FS-22: Implement Group Creation & Invitation System**  
     
   * **Background:** Allow logged-in users to create new private groups, generating a unique invite code. Store group details and membership information in Supabase tables.  
   * **Acceptance Criteria:**  
     * UI accessible to logged-in users allows creating a group (requires group name).  
     * Supabase tables exist: `groups` (id UUID PK, name TEXT, owner\_id UUID FK \-\> profiles.id, invite\_code UUID UNIQUE, created\_at TIMESTAMPTZ) and `group_memberships` (id UUID PK, group\_id UUID FK \-\> groups.id, user\_id UUID FK \-\> profiles.id, joined\_at TIMESTAMPTZ). Constraint: UNIQUE(group\_id, user\_id).  
     * Upon creation, a new record is added to `groups` with the creator as `owner_id`, a unique `invite_code` is generated and stored, and the creator is automatically added to `group_memberships`.  
     * The invite code is displayed to the group owner after creation. RLS ensures only logged-in users can create groups, and appropriate access controls are set (e.g., owner has more rights).  
   * **Technology Suggestions:** React components/forms within Next.js, Supabase JS client (inserts), Supabase SQL/Migrations, Supabase RLS policies, UUID generation logic (e.g., `uuid` library or Supabase function).  
   * **Testing Steps:**  
     1. Log in as User A. Navigate to group creation UI. Enter "Test Group 1" and create.  
     2. Verify success message and displayed invite code. Check Supabase `groups` table for the new group owned by User A. Check `group_memberships` table for User A's membership in this group.

   

2. **FS-23: Implement Joining Groups via Invite Code**  
     
   * **Background:** Provide a UI for logged-in users to enter an invite code to join an existing group. Validate the code against the `groups` table in Supabase and add the user to the `group_memberships` table if valid.  
   * **Acceptance Criteria:**  
     * UI element (e.g., input field and button) allows logged-in users to submit an invite code.  
     * Submission triggers a lookup in Supabase `groups` table for the code.  
     * If a valid, non-expired code is found, the user is added to the `group_memberships` table for that group (unless already a member).  
     * User receives clear feedback on success ("Joined group\!") or failure ("Invalid code", "Already a member").  
     * RLS ensures only logged-in users can attempt to join.  
   * **Technology Suggestions:** React components/forms, Supabase JS client (query `groups`, insert `group_memberships`, handle potential errors like unique constraint violation). Logic could be in a Next.js API route or Supabase Function for atomicity.  
   * **Testing Steps:**  
     1. User A creates "Test Group 1" and shares the invite code with User B.  
     2. Log in as User B. Navigate to join group UI. Enter the correct code. Verify success message. Check Supabase `group_memberships` for User B's record in "Test Group 1".  
     3. User B enters the same code again. Verify "Already a member" (or similar) error message.  
     4. Enter an invalid/non-existent code. Verify "Invalid code" error message.

   

2. **FS-39: Implement Leaving Groups** (New Ticket based on User Story Aisha-2)  
     
   * **Background:** Allow logged-in users who are members of a group (but not the owner, initially) to leave the group voluntarily.  
   * **Acceptance Criteria:**  
     * A "Leave Group" button/option is visible on the group dashboard/settings page for members who are *not* the owner.  
     * Clicking the button (and confirming) removes the user's corresponding record from the `group_memberships` table in Supabase.  
     * User receives confirmation, and the UI updates (e.g., user is redirected, group disappears from their list).  
     * The group owner cannot leave the group using this mechanism (they might need to delete the group or transfer ownership \- features for later consideration). RLS should prevent owner deletion of their own membership.  
   * **Technology Suggestions:** React component (button), Supabase JS client (`delete` from `group_memberships` with appropriate `where` clause for user\_id and group\_id), confirmation modal, conditional rendering based on ownership.  
   * **Testing Steps:**  
     1. User A creates group, User B joins. Log in as User B. Navigate to the group's page.  
     2. Find and click the "Leave Group" button. Confirm the action in the modal.  
     3. Verify User B is removed from the group visually (e.g., redirected, group list updated).  
     4. Check Supabase `group_memberships` table. Verify User B's record for that specific group is deleted.  
     5. Log in as User A (owner). View the group dashboard. Verify User B is no longer listed as a member. Verify User A does *not* see the "Leave Group" button for themselves, or it's disabled.

   

2. **FS-24: Implement Basic Group Dashboard & Member List**  
     
   * **Background:** Create a view for group members (accessible via a dynamic route like `/groups/[groupId]`) showing the group's name and a list of its current members (display names or usernames). Fetch data from Supabase respecting RLS.  
   * **Acceptance Criteria:**  
     * Logged-in users can navigate to a list of groups they are members of.  
     * Selecting a group leads to its dashboard page (e.g., `pages/groups/[groupId].tsx`).  
     * The group dashboard displays the group name and a list of current members (fetching from `group_memberships` and joining with `profiles` for names).  
     * RLS must ensure only current members of the group can access its dashboard and view the member list. Non-members attempting access should be denied.  
   * **Technology Suggestions:** Next.js dynamic routes, React components, Supabase JS client (query `group_memberships` and `profiles` with joins, respecting RLS), Clerk auth context.  
   * **Testing Steps:**  
     1. User A creates group, User B joins. Log in as User A. Navigate to the group dashboard. Verify group name and members (User A, User B) are listed correctly.  
     2. Log in as User B. Navigate to the same group dashboard. Verify the same information is displayed.  
     3. Log in as User C (not a member). Attempt to access the group dashboard URL directly. Verify access is denied (e.g., 404 or redirect).

   

2. **FS-25: Display Discreet Member Progress on Group Dashboard (Realtime)**  
     
   * **Background:** Enhance the group dashboard to show very simple, privacy-respecting indicators of recent activity for each member (e.g., a green checkmark if they logged \>= 3 prayers today, or completed their daily reading goal). Fetch summarized/boolean status only, not detailed logs. Use Supabase Realtime subscriptions for live updates.  
   * **Acceptance Criteria:**  
     * Group dashboard shows a simple visual indicator next to each member's name (e.g., checkmark, dot color).  
     * The status shown is based on a predefined, simple, privacy-preserving rule (e.g., "Logged any Quran reading today? Yes/No", "Logged \>= 3 prayers today? Yes/No"). The *details* of the logs are not shared.  
     * The necessary summarized data is fetched efficiently (potentially via a Supabase Function or View that calculates the boolean status per user per day, respecting RLS and user privacy settings \- see FS-46).  
     * The dashboard subscribes to Supabase Realtime changes (e.g., on the summary view/table or triggered by log updates). Indicators update live (without page refresh) when a member's actions change their status for the day.  
   * **Technology Suggestions:** Supabase JS client (querying summary data/view), Supabase Realtime subscriptions, React state management to handle updates, Supabase Function/View (optional but good for complex summary logic), conditional rendering for indicators.  
   * **Testing Steps:**  
     1. User A and User B are in the same group. Both open the group dashboard in separate browsers/tabs. Initially, User A has logged 0 prayers today (indicator is grey/absent).  
     2. User A logs 3 prayers in another part of the app. Observe User B's dashboard view: User A's indicator should update automatically to green/checkmark via Supabase Realtime shortly after the data is saved.  
     3. Repeat with User B logging data that meets the criteria. Verify User A's dashboard updates in real-time.

   

2. **FS-40: Implement Basic Group Messaging/Feed** (New Ticket based on User Stories Aisha-5, Omar-2)  
     
   * **Background:** Add a simple, chronological feed within the group dashboard where members can post predefined encouraging messages or short custom text messages visible only to group members.  
   * **Acceptance Criteria:**  
     * A `group_messages` table exists in Supabase (id UUID PK, group\_id UUID FK, user\_id UUID FK, message\_text TEXT, created\_at TIMESTAMPTZ).  
     * The group dashboard UI includes a section displaying messages from `group_messages` for that group, ordered newest first or last.  
     * UI provides an input field and button (or buttons for predefined messages) allowing members to post a new message to the group feed.  
     * Posted messages are saved to the `group_messages` table via Supabase client, linked to the group and the posting user.  
     * The feed updates to show new messages (ideally using Supabase Realtime for instant updates).  
     * RLS ensures only members of the group can read messages from and post messages to their group's feed.  
   * **Technology Suggestions:** Supabase JS client (insert, select), Supabase SQL/Migrations, Supabase RLS policies, React components (feed display, input form), Supabase Realtime subscriptions on `group_messages` table.  
   * **Testing Steps:**  
     1. User A (member of Test Group 1\) posts "Great job everyone\!" in the group feed UI. Check `group_messages` table in Supabase.  
     2. User B (also member) views the group dashboard. Verify User A's message appears (instantly if Realtime is working).  
     3. User B posts a reply message. Verify it appears in the feed for both User A and User B.  
     4. User C (not a member) attempts to access the group/feed. Verify they cannot see messages or post.

   

2. **FS-41: Implement Basic Group Challenges** (New Ticket based on User Story Aisha-3)  
     
   * **Background:** Allow group owner or members (TBD permission) to define simple, time-bound group challenges (e.g., "Pray all Sunnah prayers this week", "Read Surah Al-Kahf this Friday", "Log 5 prayers daily for 5 days"). Track collective progress visually.  
   * **Acceptance Criteria:**  
     * A `group_challenges` table exists in Supabase (id UUID PK, group\_id UUID FK, title TEXT, description TEXT, start\_date DATE, end\_date DATE, target\_metric TEXT/JSONB, created\_by UUID FK, created\_at TIMESTAMPTZ).  
     * UI within the group allows creating new challenges (inputting details) and viewing currently active/past challenges for the group.  
     * A simple visualization (e.g., progress bar, list of participants who completed) shows collective progress towards the challenge goal.  
     * Progress calculation logic needs definition based on challenge type (e.g., querying `prayer_log`, `quran_reading_log` for members within the date range and matching criteria). This might require a Supabase Function.  
     * RLS protects challenge data (only members can view/interact). Decide on creation permissions (owner only vs. members).  
   * **Technology Suggestions:** Supabase tables/RLS, Supabase JS client (CRUD operations for challenges, querying progress data), React components (forms, display), progress calculation logic (likely in a Supabase Function triggered periodically or on demand). Start with simple challenge types.  
   * **Testing Steps:**  
     1. User A (owner) creates a challenge: "Log Fajr Prayer Daily this Week" for Test Group 1, setting start/end dates. Check `group_challenges` table.  
     2. User A logs Fajr prayer today (within challenge dates). User B (member) logs Fajr prayer today.  
     3. View the challenge details on the group dashboard. Verify the progress visualization updates to show partial completion reflecting the logs (e.g., "2/N member-days completed" or similar).  
     4. Verify only group members (User A, User B) can see the challenge. User C cannot. Check creation permissions work as designed.

---

## Epic 7: Notification System

**Goal:** Implement reliable web push notifications via Faithful Steps' Service Worker for prayer times and other optional reminders, ensuring users have control over their notification preferences stored in Supabase.

**Tickets:**

2. **FS-26: Implement Frontend Push Notification Subscription**  
     
   * **Background:** Request user permission for notifications using the browser's Push API. If granted, obtain the `PushSubscription` object and send it to the backend (Supabase) to be stored against the logged-in user's profile.  
   * **Acceptance Criteria:**  
     * A UI element (e.g., toggle button in settings) allows logged-in users to enable notifications, triggering the standard browser permission prompt.  
     * If permission is granted, the frontend script retrieves the `PushSubscription` object from the browser.  
     * This `PushSubscription` object is sent to Supabase (e.g., via a Supabase Function or directly if RLS allows) and stored in a dedicated `push_subscriptions` table (columns: `id` UUID PK, `user_id` UUID FK UNIQUE, `subscription_object` JSONB, `created_at` TIMESTAMPTZ). Store only one active subscription per user.  
     * UI provides feedback on success, failure, or if permission was denied or the browser doesn't support push notifications.  
   * **Technology Suggestions:** Web Notification API (`Notification.requestPermission()`), Push API (`registration.pushManager.subscribe()`), VAPID keys (public key needed in frontend), Supabase JS client or Function to save subscription, Supabase table.  
   * **Testing Steps:**  
     1. Log in. Go to settings. Click the "Enable Notifications" button. Deny permission in the browser prompt. Verify appropriate feedback message and no data saved in Supabase `push_subscriptions`.  
     2. Click enable again. Grant permission. Verify success message. Check Supabase `push_subscriptions` table for a new row containing the subscription JSON for the logged-in user.  
     3. Attempt on a browser known not to support Push API. Verify the feature is gracefully disabled or informs the user.

   

2. **FS-27: Setup Backend Logic for Sending Prayer Time Notifications**  
     
   * **Background:** Implement backend logic, likely as a scheduled Supabase Edge Function, to identify users who should receive a prayer time notification soon. Fetch their stored `PushSubscription`, calculate the correct prayer time based on their settings, construct a payload, and send the push message using a web push library.  
   * **Acceptance Criteria:**  
     * A scheduled Supabase Edge Function runs periodically (e.g., every 5-15 minutes).  
     * The function queries for users whose *next* prayer time (based on their stored location/settings in `profiles`) falls within the notification window (e.g., 15 mins from now).  
     * It filters for users who have an active `push_subscriptions` record and have enabled notifications for that specific prayer (preferences stored in `profiles` or settings table \- see FS-29).  
     * For each eligible user, retrieves their `PushSubscription` object.  
     * Constructs a notification payload (title, body, icon).  
     * Uses a `web-push` library (or similar) with VAPID keys to send the notification via the web push protocol.  
     * Includes logic to handle push service errors (e.g., expired/invalid subscriptions) and potentially remove invalid subscriptions from the database.  
   * **Technology Suggestions:** Supabase Edge Functions (Deno/TypeScript), Supabase scheduling (pg\_cron), Supabase JS client (within function), `web-push` library (Node/Deno compatible), VAPID keys stored as environment variables, Adhan.js or similar prayer time logic within the function.  
   * **Testing Steps:**  
     1. Set up a test user: ensure they are logged in, have granted notification permission (FS-26), have a location set, and have notifications enabled for 'Asr' (FS-29). Ensure 'Asr' time is \~10 minutes away.  
     2. Manually trigger the scheduled Supabase Function or wait for its next run. Monitor the function logs. Verify it correctly identifies the test user, calculates Asr time, retrieves the subscription, and attempts to send the push message.  
     3. Check the client device (where permission was granted). Verify the 'Asr' prayer time notification is received.  
     4. Test preference handling: Disable 'Asr' notification for the user, trigger function again when Asr is near. Verify *no* notification is sent (check logs). Test invalid subscription: manually corrupt a subscription, trigger function, verify error handling works and potentially removes the bad subscription.

   

2. **FS-28: Implement Service Worker Push Event Handling**  
     
   * **Background:** Add an event listener within the application's Service Worker (managed via `next-pwa` or manually) to handle incoming `push` events triggered by the backend (FS-27). Parse the received payload and display a notification to the user using the Service Worker's `showNotification` API.  
   * **Acceptance Criteria:**  
     * The Service Worker file includes an event listener for the `push` event (`self.addEventListener('push', ...)`).  
     * Inside the listener, the incoming `event.data` (likely JSON) is parsed to extract notification details (title, body, icon, etc.).  
     * `self.registration.showNotification()` is called with the extracted details to display the notification to the user.  
     * Handles cases where the payload might be empty or malformed gracefully.  
   * **Technology Suggestions:** Service Worker API (`addEventListener('push')`), `event.data.json()`, `self.registration.showNotification()`. Integration within Next.js likely via `next-pwa`.  
   * **Testing Steps:**  
     1. Trigger a push notification from the backend (FS-27 testing).  
     2. Ensure the application tab is closed or the browser is minimized/backgrounded.  
     3. Verify the notification appears on the client device's operating system.  
     4. Verify the title, body, and icon (if configured) match the payload sent from the backend function.

   

2. **FS-29: Add Notification Preferences in Settings UI**  
     
   * **Background:** Create a UI section within the main settings page (`/settings`) allowing logged-in users to manage their notification preferences: a global toggle to enable/disable all notifications, and individual toggles for each of the five daily prayers. Save these preferences to the user's record in Supabase.  
   * **Acceptance Criteria:**  
     * The `/settings` page includes UI controls (e.g., switches/toggles) for:  
       * Global notification enable/disable (linked to FS-26 permission request if not yet granted).  
       * Individual enable/disable for Fajr, Dhuhr, Asr, Maghrib, Isha notifications.  
     * Changing these settings updates corresponding boolean columns or a JSONB field in the user's `profiles` table or a dedicated `user_settings` table in Supabase via the Supabase client.  
     * The backend notification sending logic (FS-27) correctly queries and respects these stored preferences before sending any notification.  
   * **Technology Suggestions:** React components (toggles/switches) within Next.js settings page, Supabase JS client (`update` user profile/settings), Supabase table modification (add columns like `notify_fajr` BOOLEAN etc. or a `notification_prefs` JSONB), update Supabase Function query in FS-27.  
   * **Testing Steps:**  
     1. Log in. Go to `/settings`. Disable the 'Asr' prayer notification toggle. Verify the change is saved to the user's record in Supabase.  
     2. Trigger the backend send logic (FS-27) when Asr time is approaching for this user. Verify *no* Asr notification is received.  
     3. Go back to settings, enable 'Asr' notifications. Verify saved in Supabase. Trigger backend send again. Verify the Asr notification *is* received.  
     4. Disable the global notification toggle. Trigger send for any prayer. Verify *no* notifications are received.

   

2. **FS-42: Implement Optional Fasting Reminders** (New Ticket based on User Story Omar-2)  
     
   * **Background:** Allow logged-in users to opt-in via settings to receive push notifications reminding them about upcoming recommended voluntary fasting days (e.g., Mondays/Thursdays, Ayam al-Beedh/White Days).  
   * **Acceptance Criteria:**  
     * A setting (e.g., toggle switch) exists on the `/settings` page to enable/disable "Voluntary Fasting Reminders". This preference is saved to the user's settings in Supabase.  
     * The backend logic (likely extending the scheduled Supabase Function from FS-27 or a separate one) identifies upcoming recommended fasting days based on the Hijri calendar.  
     * If a user has opted-in (preference enabled in Supabase) and has an active push subscription, the function sends a reminder notification (e.g., "Reminder: Tomorrow is Monday, a recommended day to fast") the day before or morning of the fast.  
   * **Technology Suggestions:** Hijri date library with knowledge of Sunnah fasting days, update Supabase Function logic to check dates and user preferences, update settings UI/Supabase settings table, `web-push` library for sending.  
   * **Testing Steps:**  
     1. Log in. Go to settings. Enable the "Voluntary Fasting Reminders" toggle. Verify preference saved in Supabase.  
     2. Manually trigger the backend function, simulating the day before a known recommended fasting day (e.g., a Sunday for Monday fast). Monitor logs. Verify a reminder notification is sent to the subscribed user.  
     3. Go back to settings. Disable the reminder toggle. Verify saved. Trigger the function again under the same conditions. Verify *no* notification is sent.

   

2. **FS-43: Implement Optional Quran Reading Goal Reminders** (New Ticket based on User Story Ahmed-5 part 2\)  
     
   * **Background:** If a user sets a daily or weekly Quran reading goal (feature potentially implemented in Epic 8 or elsewhere), allow them to opt-in for push notification reminders if they haven't met their goal by a certain time of day/week.  
   * **Acceptance Criteria:**  
     * A setting exists (likely near goal setting UI or in general settings) to enable/disable "Reading Goal Reminders". Preference saved in Supabase. (Depends on goal-setting feature existing).  
     * Backend logic (e.g., a scheduled Supabase Function running daily/weekly in the evening) checks for subscribed users who have enabled this reminder.  
     * The function queries the user's reading goal and their `quran_reading_log` data for the relevant period.  
     * If the goal has not been met by the check time, send a gentle reminder push notification (e.g., "Reminder: Haven't met your daily Quran goal yet?").  
   * **Technology Suggestions:** Supabase Function (scheduled), Supabase JS client (query user goals, query `quran_reading_log`), `web-push` library. Requires the goal setting feature to be implemented first.  
   * **Testing Steps:**  
     1. (After goal setting feature exists) Log in. Set a daily Quran reading goal (e.g., read 10 verses). Enable "Reading Goal Reminders" in settings. Verify saved.  
     2. Do *not* log any Quran reading for the day that meets the goal.  
     3. Manually trigger the backend check function in the evening. Monitor logs. Verify a reminder notification is sent/received.  
     4. On the next day, log Quran reading that *meets* the goal. Trigger the function in the evening. Verify *no* reminder is sent. Disable the reminder setting. Verify no reminder sent regardless of meeting the goal.

---

## Epic 8: PWA Polish, Configuration & Profile Management

**Goal:** Enhance the Faithful Steps application to function reliably as an installable Progressive Web App (PWA) with robust offline support for key features, provide comprehensive user configuration options, allow users to manage their profile details, and ensure good accessibility.

**Tickets:**

2. **FS-30: Implement Robust Offline Data Syncing**  
     
   * **Background:** Allow users to log data (prayers, fasting days, Quran bookmarks, maybe start/end of reading sessions) while offline. Store these pending actions locally (e.g., in IndexedDB). Implement a mechanism to sync this data to Supabase once the connection is restored.  
   * **Acceptance Criteria:**  
     * When the user performs actions like logging a prayer, marking a fast, or bookmarking a verse while offline (`navigator.onLine` is false), the data is saved to a local store (IndexedDB recommended) marked as "pending sync".  
     * The UI updates immediately to reflect the action optimistically.  
     * Upon detecting reconnection (`online` event or periodic checks), the app attempts to send all pending records from IndexedDB to Supabase using the appropriate client methods (`upsert`, `insert`).  
     * Successfully synced records are removed from the local pending store.  
     * Handle potential errors during sync (e.g., conflicts, server errors) and implement a basic retry strategy or flag items requiring manual attention.  
   * **Technology Suggestions:** IndexedDB API (using a wrapper library like `idb` is helpful), Service Worker (optional, can use `BackgroundSync` API for more robust sync attempts), `navigator.onLine` property, `online`/`offline` event listeners, Supabase JS client, error handling logic.  
   * **Testing Steps:**  
     1. Log in. Go offline (browser dev tools).  
     2. Log a prayer (e.g., Asr 'On Time'). Bookmark a Quran verse (e.g., 3:1). Mark today as 'Voluntary' fast.  
     3. Verify UI updates optimistically. Check IndexedDB (Application tab in dev tools) to see the pending records stored locally.  
     4. Go back online. Wait/trigger the sync process.  
     5. Verify the pending records are cleared from IndexedDB. Check Supabase `prayer_log`, `bookmarks`, `fasting_log` tables. Verify the corresponding records now exist, associated with the correct user ID. Test syncing multiple pending items at once.

   

2. **FS-31: Refine PWA Manifest & Service Worker Caching (Next.js)**  
     
   * **Background:** Optimize the `manifest.json` file for better installability and presentation (icons, theme color, display mode, name). Configure the Service Worker (using `next-pwa` or similar) for effective caching strategies (app shell, static assets, key API data/responses) to improve performance and offline reliability.  
   * **Acceptance Criteria:**  
     * The PWA `manifest.json` (managed via `next-pwa` config or `public/manifest.json`) is complete with appropriate icons, theme colors, background color, short name, name, start URL, and display mode (`standalone` or `minimal-ui`).  
     * The Service Worker (generated/managed by `next-pwa`) implements caching strategies:  
       * App Shell / Next.js generated pages/chunks (e.g., CacheFirst or StaleWhileRevalidate).  
       * Static assets (`public/`, `_next/static/`) (CacheFirst).  
       * Key API data (like Quran text, translations \- FS-12, potentially user settings) using StaleWhileRevalidate or NetworkFirst depending on freshness needs.  
     * The app loads quickly when offline or on slow networks, showing the cached shell and data.  
     * The app passes the core PWA checks in Lighthouse audit (installable, offline support).  
   * **Technology Suggestions:** `manifest.json` properties, `next-pwa` library configuration (`workboxOptions`, `runtimeCaching`), Service Worker lifecycle, Workbox strategies.  
   * **Testing Steps:**  
     1. Build the Next.js app for production (`npm run build`). Start the production server (`npm start`).  
     2. Load the app online. Ensure the Service Worker activates. Navigate through key sections (prayer times, Quran reader with viewed Surah, dashboard).  
     3. Go offline (browser dev tools). Reload the app. Verify it loads instantly showing the app shell and previously cached data (e.g., viewed Surah text). Navigation to cached sections should work.  
     4. Run a Lighthouse audit on the production URL. Verify the PWA category score is high and it passes installability checks. Check browser's "Install App" prompt appears (desktop/mobile).

   

2. **FS-32: Implement Comprehensive Settings Page UI (Next.js)**  
     
   * **Background:** Create a dedicated, well-organized settings page (`/settings`) consolidating various user configuration options. Allow users to modify preferences related to prayer calculation, location, Quran reader, theme, notifications, and account management.  
   * **Acceptance Criteria:**  
     * A `/settings` page (e.g., `pages/settings.tsx`) exists, accessible only to logged-in users.  
     * UI controls are present for managing:  
       * Prayer Time Calculation: Method (e.g., MWL, ISNA), Asr Method (Standard, Hanafi), High Latitude Rule.  
       * Location: Manual input/update for prayer times.  
       * Quran Reader Preferences: Default Translation(s), Transliteration visibility, Font Size (links to FS-44).  
       * Appearance: Theme selection (Light/Dark/System).  
       * Notifications: Link/section for managing notification preferences (FS-29, FS-42, FS-43).  
       * Data Management: Button to initiate user data export (TBD format).  
       * Account Management: Button to initiate account deletion process (likely via Clerk settings or custom flow triggering Clerk deletion). Link to Privacy Policy / Terms of Service.  
     * Changing settings persists the values to the user's record (`profiles` or `user_settings` table) in Supabase via Supabase client.  
     * Other parts of the application correctly read and reflect these saved settings upon next load/use.  
   * **Technology Suggestions:** Next.js page route, React components (forms, selects, toggles), Supabase JS client (`update`), Clerk JS SDK (potentially for profile/deletion flows if not using Clerk components), state management, possibly an i18n library for future localization.  
   * **Testing Steps:**  
     1. Log in. Navigate to `/settings`. Verify all expected setting controls are present and reflect current state (or defaults).  
     2. Change the Prayer Time Calculation Method. Save. Navigate to the prayer times view (FS-5). Verify the times are recalculated based on the new method.  
     3. Change the Theme setting. Verify the application's appearance updates immediately and the preference persists after page refresh.  
     4. Change a Quran Reader preference (e.g., disable transliteration). Save. Navigate to the Quran reader (FS-11). Verify the change is reflected.  
     5. Verify the notification settings controls work (as per FS-29 tests). Verify data export/account deletion buttons exist (functionality TBD based on implementation).

   

2. **FS-44: Implement Quran Reader Settings (Font Size, Translation Selection)** (New/Refined Ticket based on User Story Omar-2, Ahmed-1)  
     
   * **Background:** Provide specific controls, either within the main settings page (FS-32) or directly accessible from the Quran reader UI, to allow users to adjust the font size of the Quran text and select which available translations they wish to see displayed.  
   * **Acceptance Criteria:**  
     * UI control (e.g., slider, \+/- buttons) allows adjusting the font size for both Arabic Quran text and its translation(s). The chosen font size persists (using local storage for simplicity or Supabase user settings for cross-device persistence).  
     * UI control (e.g., checklist, multi-select dropdown) lists available translations (fetched from API/config). User can select one or more translations to be displayed alongside the Arabic text. This selection persists (local storage or Supabase user settings).  
     * The Quran reader UI (FS-10, FS-11) dynamically adjusts the font size based on the setting and displays only the selected translations.  
   * **Technology Suggestions:** React components (slider, checkboxes), state management (local component state, Context API, or Zustand), Local Storage API or Supabase client (for persistence), CSS adjustments for font size, conditional rendering for translations.  
   * **Testing Steps:**  
     1. Log in. Go to Quran reader or settings page section for reader preferences.  
     2. Increase the font size using the control. Navigate to the Quran reader view. Verify the Arabic and translation text sizes have increased. Refresh the page. Verify the larger font size persists.  
     3. Assume multiple translations (e.g., Sahih International, Pickthall) are available. Use the selection control to enable *only* Pickthall. Navigate to the reader. Verify only Arabic and Pickthall translation are shown for each verse.  
     4. Go back and select both Sahih International and Pickthall. Verify both translations are now displayed below the Arabic text. Refresh page, verify the selection persists.

   

2. **FS-45: Implement User Profile Editing UI** (New Ticket based on User Stories Fatima-3, Aisha-3)  
     
   * **Background:** Provide a UI section, likely within the `/settings` page (FS-32), allowing logged-in users to edit their mutable profile information, such as their display name and username. Optionally include avatar uploading.  
   * **Acceptance Criteria:**  
     * Profile editing section in settings allows users to input and save changes to their `display_name` and `username`.  
     * Saving triggers an update to the user's corresponding row in the Supabase `profiles` table via Supabase client.  
     * Username uniqueness is enforced by the database UNIQUE constraint on the `profiles` table. The UI provides clear error feedback if the user tries to save a username that is already taken.  
     * (Optional) An "Upload Avatar" button allows users to select an image file. The file is uploaded securely to **Supabase Storage**. On successful upload, the `avatar_url` column in the user's `profiles` record is updated with the public URL of the uploaded image. RLS policies should be configured on the Supabase Storage bucket.  
     * RLS on the `profiles` table ensures users can only update their *own* profile data.  
     * Updated profile information (display name, avatar) is reflected in relevant UI parts (e.g., navbar, group member lists).  
   * **Technology Suggestions:** React components (forms, file input), Supabase JS client (`update` for profiles, `upload` for Storage), Supabase Storage API & RLS policies, error handling logic, Clerk user context (to get user ID).  
   * **Testing Steps:**  
     1. Log in. Go to profile editing section in settings. Change Display Name to "Test User Edited". Save. Verify success message. Navigate away and back, or refresh. Verify the new display name persists in the form and is potentially shown in the navbar/UserButton. Check Supabase `profiles` table.  
     2. Try changing the username to one known to be used by another user. Save. Verify an error message "Username already taken" (or similar) is displayed.  
     3. Change the username to a unique, valid value. Save. Verify success message and persistence in DB/UI.  
     4. (If avatar upload implemented) Click upload, select a valid image file. Verify upload process indicator and success message. Check Supabase Storage bucket for the new file. Check `profiles` table for the updated `avatar_url`. Verify the new avatar is displayed in the UI (e.g., `<UserButton>`). Test uploading invalid file type or oversized file, verify error handling.

   

2. **FS-46: Implement Granular Privacy Controls for Groups** (New Ticket based on User Story Fatima-3)  
     
   * **Background:** Add settings to allow users fine-grained control over what level of their activity (e.g., prayer logs, reading logs) is summarized and shared within the private groups they are members of.  
   * **Acceptance Criteria:**  
     * A section in user settings (`/settings`) provides options for group data sharing preferences (e.g., Radio buttons/Dropdown: "Share Full Summary", "Share Only Goal Completion Status", "Share Nothing").  
     * The selected preference is saved to the user's settings record in Supabase (e.g., a `group_sharing_level` column/property).  
     * The logic that fetches or calculates the summary status for display on the group dashboard (FS-25) respects this user-specific preference.  
       * If "Share Nothing", no indicator/status is shown for this user to others.  
       * If "Share Only Goal Completion", only a boolean checkmark/dot is shown (as per original FS-25).  
       * If "Share Full Summary" (optional complexity), potentially shows slightly more info, e.g., "4/5 Prayers Logged" \- requires careful design to maintain privacy.  
     * The default setting should be reasonably private (e.g., "Share Only Goal Completion Status").  
   * **Technology Suggestions:** Update settings UI components, update Supabase user settings table/column, modify the Supabase query/Function/View used in FS-25 to conditionally select or calculate the shared data based on the user's `group_sharing_level` preference (e.g., using SQL CASE statements or conditional logic in function).  
   * **Testing Steps:**  
     1. User A and User B are in a group. Log in as User A. Go to settings, set group sharing level to "Share Nothing". Save.  
     2. Log in as User B. View the group dashboard. Verify that *no* activity status or indicator is shown for User A.  
     3. Log in as User A. Change setting to "Share Only Goal Completion Status". Save. Ensure User A has met a goal (e.g., logged 3+ prayers).  
     4. Log in as User B. View group dashboard. Verify a simple checkmark/indicator *is* now shown for User A.  
     5. (If "Full Summary" implemented) Test that setting shows more detail, respecting the design. Test the default setting behaviour.

   

2. **FS-33: UI/UX Polish & Accessibility Audit**  
     
   * **Background:** Conduct a thorough review of the entire Faithful Steps application's user interface (UI) and user experience (UX). Refine visual consistency, layouts, navigation flow, and responsiveness. Perform an accessibility audit (WCAG AA) and implement necessary fixes.  
   * **Acceptance Criteria:**  
     * UI elements, typography, color schemes, and layouts are consistent across all sections of the application.  
     * Navigation is intuitive and predictable.  
     * Application is fully responsive and usable across common device sizes (mobile, tablet, desktop).  
     * WCAG 2.1 Level AA guidelines are met, particularly concerning:  
       * Color contrast ratios for text and significant UI elements.  
       * Full keyboard navigability for all interactive elements (links, buttons, form controls).  
       * Logical focus order.  
       * Semantic HTML structure. Use of ARIA attributes where necessary to enhance screen reader compatibility.  
       * Proper labels for form inputs. Alt text for meaningful images.  
     * Visual refinements based on feedback or design review are implemented.  
   * **Technology Suggestions:** CSS/Tailwind CSS refinement, browser developer tools (inspector, responsive design mode, accessibility inspector), automated accessibility testing tools (Axe DevTools, Lighthouse), manual testing with keyboard-only navigation, manual testing with screen readers (NVDA, VoiceOver, JAWS).  
   * **Testing Steps:**  
     1. Test the application on different viewport sizes (e.g., using browser dev tools). Verify layout adapts correctly without content overlap or usability issues.  
     2. Navigate through the entire application using only the keyboard (Tab, Shift+Tab, Enter, Space). Ensure all interactive elements are reachable and operable. Check focus indicators are visible.  
     3. Use a color contrast checking tool on various text/background combinations to ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text/UI components).  
     4. Use an automated accessibility checker (like Axe) to identify common issues.  
     5. Use a screen reader to navigate key workflows (login, logging prayer, reading Quran, joining group). Verify elements are announced clearly and the flow is logical. Fix any identified issues.

---

## Epic 9: Anonymous Mode & Local Data

**Goal:** Allow users to experience core features of Faithful Steps (like viewing prayer times, basic local tracking) without needing to create an account immediately. Store this data locally on the device, with an option to later sign up and migrate the local data to their account.

**Tickets:**

2. **FS-47: Implement Local Prayer Time Viewing (No Auth)**  
     
   * **Background:** Enable access to the prayer times calculation and display feature for users who are not logged in or haven't signed up yet. Calculations should rely on temporary location input or permission, using local calculation.  
   * **Acceptance Criteria:**  
     * If the user is not authenticated (Clerk `userId` is null/undefined), the prayer times view is still accessible.  
     * The view prompts the user for Geolocation permission or allows manual location input (city/coordinates) specifically for this session's calculation.  
     * Prayer times for the current day are calculated using the Adhan.js library based on the provided location.  
     * The calculated times are displayed in the UI.  
     * Location information provided in this anonymous mode is *not* persisted across page loads or sessions (user will be prompted again). Settings related to calculation methods use defaults.  
   * **Technology Suggestions:** Conditional rendering/logic based on Clerk auth state (`useAuth().userId`), Adhan.js library, Browser Geolocation API, React components, local component state for temporary location.  
   * **Testing Steps:**  
     1. Ensure you are logged out or open the app in an incognito/private browser window.  
     2. Navigate to the prayer times view. Verify it loads and prompts for location permission or input.  
     3. Grant permission or enter a location.  
     4. Verify that prayer times are displayed correctly based on the provided location and default calculation settings, calculated by Adhan.js.  
     5. Refresh the page. Verify the prayer times are gone and the location prompt appears again, indicating non-persistence.

   

2. **FS-48: Implement Local-Only Prayer Logging (No Auth)**  
     
   * **Background:** Allow users who are not logged in to interact with the daily prayer logging UI (FS-6). Instead of saving to Supabase, store the log data directly in the browser's IndexedDB.  
   * **Acceptance Criteria:**  
     * The prayer logging UI (checklist/buttons for Fajr, Dhuhr, etc.) is interactive even when the user is logged out.  
     * When a logged-out user marks a prayer status, the log entry (containing date, prayer name, status, potentially notes if FS-34 is adapted) is saved *only* to a specific IndexedDB store designated for anonymous data.  
     * The UI reflects the locally logged status, and this status persists across page refreshes *on the same browser*.  
     * Data is *not* sent to Supabase for anonymous users. No `user_id` is associated with this local data initially.  
   * **Technology Suggestions:** IndexedDB API (`idb` wrapper recommended), conditional logic checking auth state (`useAuth().userId`) within the prayer logging component/hook, separate IndexedDB object store for anonymous logs.  
   * **Testing Steps:**  
     1. Log out. Navigate to the prayer logging UI for today. Mark Fajr as 'On Time' and Dhuhr as 'Delayed'. Add a note to Fajr if implemented.  
     2. Check the browser's developer tools (Application \-\> IndexedDB). Verify the log entries exist in the designated anonymous store.  
     3. Refresh the page. Verify the UI still shows Fajr as 'On Time' (with note) and Dhuhr as 'Delayed'.  
     4. Check the Supabase `prayer_log` table in the backend. Verify *no* entries were created corresponding to these actions.  
     5. Log in as a registered user. Verify that this locally logged anonymous data is *not* automatically displayed (it's separate from account data, unless migration FS-50 is done).

   

2. **FS-49: Implement Local-Only Quran Reading State (No Auth)**  
     
   * **Background:** Allow logged-out users to use the Quran reader interface, saving their bookmarks and last read position locally to IndexedDB instead of Supabase.  
   * **Acceptance Criteria:**  
     * The Quran reader interface is accessible when logged out (fetching text still requires internet access or cached data from FS-12).  
     * When a logged-out user clicks the bookmark icon on an Ayah, the bookmark reference (surah, ayah) is saved locally to an anonymous IndexedDB store.  
     * The last read position (surah, ayah) is automatically saved locally to IndexedDB as the user reads.  
     * The "Resume Reading" functionality and the display of bookmarks work correctly based on the data retrieved from the anonymous IndexedDB store.  
     * This data is *not* sent to Supabase and has no `user_id` associated initially.  
   * **Technology Suggestions:** IndexedDB API (`idb`), conditional logic checking auth state within bookmarking and last-read-position saving functions, separate IndexedDB object stores for anonymous bookmarks/reading state.  
   * **Testing Steps:**  
     1. Log out. Open the Quran reader. Read up to Surah 2, Ayah 5\. Bookmark Surah 2, Ayah 3\.  
     2. Check IndexedDB. Verify the last read position (2:5) and the bookmark (2:3) are stored in the anonymous stores.  
     3. Refresh the page. Click the "Resume Reading" button/link. Verify the reader view navigates to 2:5. Navigate to the bookmarks view. Verify the bookmark for 2:3 is listed.  
     4. Check Supabase `bookmarks` and `reading_state` tables. Verify no data corresponding to this anonymous session was saved.

   

2. **FS-50: Optional: Data Migration on Signup/Login**  
     
   * **Background:** Provide a mechanism for users who have been using the app anonymously (and have generated local data in IndexedDB) to optionally migrate this data to their account when they sign up or log in for the first time on that specific browser/device.  
   * **Acceptance Criteria:**  
     * Immediately after a successful signup or login event (using Clerk), the application checks if any data exists in the anonymous IndexedDB stores (prayer logs, bookmarks, reading state).  
     * If anonymous local data is found, the user is presented with a clear, non-intrusive prompt (e.g., a modal or banner): "You have locally tracked data from previous anonymous use. Would you like to migrate this data to your Faithful Steps account?". Options: "Yes, Migrate" / "No, Keep Separate" / "Discard Local Data".  
     * If the user chooses to migrate:  
       * The application reads the anonymous data from IndexedDB.  
       * It attempts to `upsert` or `insert` this data into the corresponding Supabase tables (`prayer_log`, `bookmarks`, `reading_state`), now associated with the newly authenticated `user_id`.  
       * Handle potential conflicts gracefully (e.g., if a prayer log for the same day/prayer already exists in Supabase, perhaps Supabase data takes precedence, or merge notes). Define conflict resolution strategy.  
       * Upon successful migration of all data to Supabase, the original anonymous data is cleared from IndexedDB.  
     * If the user chooses "No" or "Discard", the local anonymous data is either left alone or cleared, respectively, and no migration occurs.  
     * If no local data exists, the prompt is not shown.  
   * **Technology Suggestions:** Logic to run post-Clerk authentication (e.g., in `useEffect` triggered by `userId` change), IndexedDB read operations, UI prompt component (modal), Supabase JS client (batch `upsert`/`insert` recommended), conflict resolution logic, IndexedDB delete operations. This feature has significant complexity, especially around conflict handling.  
   * **Testing Steps:**  
     1. Log out. Use the app anonymously: log several prayers across 2 different days (FS-48), bookmark 2 Quran verses (FS-49), set a last read position. Verify data exists in anonymous IndexedDB stores.  
     2. Now, sign up for a *new* account using Clerk on the *same browser*.  
     3. Verify the migration prompt appears after successful signup/redirect.  
     4. Click "Yes, Migrate". Wait for the process to complete (provide feedback).  
     5. Check the corresponding Supabase tables (`prayer_log`, `bookmarks`, `reading_state`). Verify the data previously stored locally now exists in Supabase, associated with the new user's ID.  
     6. Check IndexedDB again. Verify the anonymous data stores have been cleared.  
     7. Repeat the process, but this time choose "No" or "Discard" at the prompt. Verify Supabase data is unchanged and IndexedDB data is handled according to the choice (remains or is cleared). Test migration upon *login* to an existing account that hasn't previously migrated data from that browser. Test conflict scenario (e.g., log prayer locally, log different status for same prayer in account, then migrate).
