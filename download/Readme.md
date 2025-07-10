**🚚 Partner App – Scrap Pickup Handler**

A React Native mobile application designed for pickup partners to manage assigned scrap pickup requests efficiently. From login to final item approval, this app ensures a seamless workflow for field partners involved in collection.

🔐 1. Authentication (Phone Number + OTP)

Partner logs in using their phone number.

Receives an OTP screen (mocked, default 123456).

On successful entry, session is saved using AsyncStorage.

Ensures secure and simple partner login without password hassle.

📋 2. View Assigned Pickups

Displays a dynamic list of assigned pickup requests to the partner. Each pickup card includes:

-🧑 Customer Name

-📞 Phone Number

-📍 Pickup Address

-🌐 Google Maps Location (if available)

-🗓️ Scheduled Date

-⏰ Time Slot

-🔄 Current Status (Pending, Accepted, In-Process, etc.)

🔄 3. Pickup Workflow

A streamlined, step-by-step process for fulfilling pickup requests:

✅ Accept Pickup

Partner taps “Accept”

Request status → Accepted

🚀 Start Pickup

Partner enters Pickup Code (shared by customer)

Status changes → In-Process

📦 Add Item Details

Partner fills out:

-Scrap item name(s)

-Quantity

-Price per item

📤 Submit for Approval

Sends the filled details to the customer for confirmation

Status updates → Pending for Approval

🎉 Completion

Once the customer approves, status updates → Completed

⚙️ Tech Stack

-React Native (Expo)

-TypeScript

-AsyncStorage for offline-first experience

-Mock API interactions and session management
