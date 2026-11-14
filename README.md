 SoloTrack

Student name: A.S.R Aluthgedara  
Student ID: PS/2022/040  
Module: Mobile Application Development  
Assignment: Assignment 01  
Status: In development — dashboard milestone

***********************************************************************************************************************************************************************************************

** About the application

SoloTrack is a job follow-up and payment-tracking application for independent service workers.It helps workers identify unfinished work, due follow-ups and outstanding payments. The initial design supports phone repairs and cleaning jobs.Work completion and payment are tracked separately. A completed job may still require a payment follow-up.

** Early user research

Informal conversations were conducted with a phone repairer and a cleaner.Both described using a phone calendar and mentioned difficulties keeping track of times and places. The repairer also discussed customer and work details. The cleaner described agreeing on a price before starting work.These conversations informed the initial design. They are early findings from two people, not a comprehensive user study.

** Current implementation

   -JavaScript dashboard with a shared color and spacing theme
   -Four fictional, realistic sample job records
   -FlatList displaying job cards
   -Needs attention and View all list modes
   -Job preview modal
   -Outstanding-balance and overdue-payment calculations
   -Identification of due follow-ups and overdue work
   -Press feedback, status labels and elevated cards

The current version is a read-only dashboard prototype. It does not yet support creating jobs, changing payment records or saving user changes.

** Screens and navigation

There is currently one implemented SoloTrack content screen

Dashboard: attention summary, payment totals and job list

The job preview is a Modal overlay, not a separate route.The root Expo Router layout uses a Stack. Tab navigation and a nested job-details stack are planned. The template Explore route remains and will be replaced during navigation development.

** Components used

   -SafeAreaView : Main screen and modal safe areas 
   -View : Cards, summaries and layout containers 
   -Text : Labels, amounts and job information 
   -Pressable : Job selection, list switching and modal closing 
   -FlatList : Rendering sample jobs 
   -Modal : Displaying the selected job 
   -ScrollView : Scrollable modal content 
   -StyleSheet : Screen styling 

The required Image component will be added in a later milestone.

** Source organization

   `src/app/_layout.js` — root navigation layout
   `src/app/index.js` — dashboard and job preview
   `src/data/jobs.js` — sample job records
   `src/utils/job_helpers.js` — attention and payment calculations
   `src/constants/solotrack_theme.js` — reusable design values

** Technology

    React Native
    Expo SDK 58
    Expo Router
    JavaScript
    React Native Safe Area Context

** Run locally

Install a Node.js version compatible with the project's Expo SDK.Then Run below coed one at a time,

git clone https://github.com/SandewR/Solo_Track.git
cd Solo_Track
npm ci
npx expo start

Start an Android emulator and press `a` in the Expo terminal.

Run commands from the project folder containing `package.json`. A compatible Expo Go client is required.


** Remaining work

   -Tab navigation and nested stack navigation
   -Shared interactive job state across screens
   -Add/edit job form and validation
   -Job-status and payment updates
   -Persistent local storage
   -Filtering controls
   -AppState background-to-foreground handling
   -Local notifications
   -Image assets and further visual refinement  
   -Broader testing and final demonstration video

Time-sensitive labels currently recalculate when the dashboard renders. Automatic foreground refresh is not implemented yet.

** Local notifications

Not implemented yet.

The planned feature will use `expo-notifications` to schedule local follow-up reminders. Research references, permission handling and actual device test results will be documented when implemented.

** Demonstration video

Not recorded yet. An accessible demonstration-video link will be added before final submission.