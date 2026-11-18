    SoloTrack

Student name: A.S.R Aluthgedara

Student ID: PS/2022/040

Module: Mobile Application Development, Assignment 01

    What the app does

SoloTrack helps independent service workers keep track of scheduled work, customer follow-ups, and payments. The Today tab highlights jobs that need attention, such as work past its target date or completed jobs with an outstanding balance. Work status and payment are shown separately because finishing the service does not mean the customer has paid.

Informal conversations with a phone repairer and a cleaner helped identify the information that matters: the job time and location, customer notes, and whether the price has been agreed. The app uses fictional examples for both types of work.

    Screens

SoloTrack has three main screens. The short opening image and the two modals appear within the app and are not separate navigation destinations.

Today : `src/app/(tabs)/index.js` - Shows jobs needing attention, outstanding amounts, overdue payments, and a job preview. 
Jobs : `src/app/(tabs)/jobs.js` - Lists jobs with All, Active, and Completed filters. Tap a job to open its details. 
Job details : `src/app/job/[id].js` - Shows the selected job's image, customer and schedule details, payment balance, status controls, and follow-up reminder options. 

    Sample job data

`src/data/jobs.js` defines four sample records. Their scheduled dates are calculated relative to the day the app loads. Prices are in Sri Lankan rupees.

Two-bedroom home cleaning : LKR 6,500 agreed, LKR 1,500 received, and LKR 5,000 remaining. 
Samsung Galaxy A54 charging issue : LKR 4,500 estimated; the price is awaiting customer approval. 
Small office cleaning : LKR 4,500 agreed, LKR 1,500 received, and LKR 3,000 remaining. 
iPhone 12 battery replacement : LKR 12,000 agreed, LKR 5,000 received, and LKR 7,000 remaining. 

    React Native components

`View` and `Text` : Layout, labels, status indicators, and amounts across Today, Jobs, and Job details. 
`Image` : Jobs banner, job detail photos, and the opening cover in `src/components/startup_background.js`. 
`Pressable` : Job cards, list filters, status options, confirmation controls, and reminder buttons. 
`FlatList` : Renders the sample job cards on both Today and Jobs. 
`Modal` : Today has a job preview. Job details has a Cancel/Confirm modal before changing work status. 
`ScrollView` : Lets the user scroll through job details and the preview content. 

    Navigation and shared state

 `src/app/_layout.js` sets up the root stack, shared job provider, and opening cover.
 `src/app/(tabs)/_layout.js` defines the Today and Jobs tabs.
 `src/app/job/_layout.js` defines the nested job stack. The `[id].js` route reads the selected job's ID and shows its details. Back returns to the Jobs list.
 `src/context/job_context.js` holds the job list with React Context and `useState`. Confirming a status change updates the same record used by Today and Jobs, so filters and summaries reflect the change. A status change does not change the payment amount. Changes are held in memory for the session.
 `src/utils/job_helpers.js` calculates attention reasons and outstanding amounts from those records.

    Returning to the app

`src/context/job_context.js` listens to React Native [AppState](https://reactnative.dev/docs/0.88/appstate). When the app returns to the foreground, the provider saves the time and Jobs displays it as **Updated after returning at …**. To try it, open Jobs, go to the Android Home screen, and return to the running app.

    Local notifications

The app uses the [Expo SDK 58 notifications reference](https://docs.expo.dev/versions/v58.0.0/sdk/notifications/) for permission checks and time interval triggers. In `src/utils/notifications.js`, the app checks or requests permission and calls `scheduleNotificationAsync` to post a one-time follow-up notification on the device. During Android testing, explicit channel creation failed, so the final schedule uses Expo's default channel. The app also configures presentation while it is open.

Open a job and scroll to **Follow-up reminder**. Choose **Remind me in one hour** for a follow-up, or **Test reminder in 10 seconds** to verify the notification quickly. The 10-second test worked in Expo Go on the Android emulator.

    Run locally

You need Node.js, npm, and an Android emulator with an Expo Go version compatible with Expo SDK 58. Run these commands one at a time:


git clone https://github.com/SandewR/Solo_Track.git
cd Solo_Track
npm ci
npx expo start


Start the Android emulator and press `a` in the Expo terminal. Allow notifications if Android asks. The notification demonstration requires Android rather than the web preview.

    Demonstration video

Watch the SoloTrack demonstration -> (https://drive.google.com/drive/folders/1MaIrF_b2WjUhl5oP82Bec2hHshxEuz5V?usp=drive_link)
