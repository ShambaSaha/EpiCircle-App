
**📦 Customer App – EpiCircle Customer App**

A React Native mobile application designed to streamline the process of scheduling and tracking scrap pickups. This app focuses on user-friendly interactions for customers to log in, request pickups, and monitor their pickup history.

🚀 Features

🔐 1. Authentication (Phone Number + OTP)
Users can log in using their phone number.

After entering the phone number, an OTP verification screen appears.

For simplicity, OTP is mocked (default: 123456).

Upon successful verification, user session is saved using AsyncStorage.

🏠 2. Dashboard

Displays a welcome message with the user’s phone number or name.

Provides a clear call-to-action to "Schedule Pickup".

Includes a summary section showing recent pickup request status (mocked or from local storage).

🗓️ 3. Schedule Pickup Flow

Allows users to request a pickup by filling out a structured form:

📅 Pickup Date: Select using a date picker.

⏰ Time Slot: Choose from options like 10–11 AM, 12–1 PM, etc.

🏠 Pickup Address: Entered through a multiline text input.

📍 Google Map Link (optional): Paste the location URL.

On submission:

The request is stored locally (or via mock API).

Status is initialized as Pending.

📜 4. Order History

Displays a detailed list of all pickup requests made by the user, including:

-📅 Pickup Date

-⏰ Time Slot

-🏠 Address

-🔄 Status (Pending / Accepted / In-Process / Pending for Approval / Completed)

-🔢 Pickup Code (shown once the request is accepted)

Additionally, for requests in the Pending for Approval status:

Displays item list with quantities and shows total amount for customer review and approval

🧪 Tech Stack

-React Native (Expo)

-TypeScript

-AsyncStorage for local persistence

-Mock OTP & API logic for rapid prototyping

