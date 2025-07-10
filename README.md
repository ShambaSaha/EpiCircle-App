♻️ EpiCircle Customer & Partner App

A full-stack, cross-platform mobile solution developed using React Native (Expo) to simplify the process of scheduling, managing, and processing scrap material pickups. The app is divided into two modules:

-📱 Customer App – for users to schedule and track scrap pickups

-🚚 Partner App – for pickup agents to manage assigned requests

🚀 Features: 

App	Features

Customer App	Phone Login, OTP Verification, Schedule Pickup, Order History

Partner App	Login, Accept Pickup, Start Pickup, Item Details Entry, Workflow Status

📱 Customer App – Modules & Flow

🔐 1. Authentication

Users log in using their phone number

6-digit OTP (mocked as 123456)

Session is stored via AsyncStorage

🏠 2. Dashboard

Welcome message with the user’s name or phone number

CTA: “Schedule Pickup”

Display of recent pickup summary

📅 3. Schedule Pickup Flow

Step-by-step form to request a pickup:

📆 Pickup Date (Date Picker)

⏰ Time Slot (e.g., 10–11 AM, 12–1 PM)

🏠 Address (Text input)

🌐 Google Maps link (optional)

✅ Request is stored locally with status: Pending

📜 4. Order History

Comprehensive view of all pickup requests including:

📅 Date

⏰ Time Slot

📍 Address

🛑 Status:

Pending, Accepted, In-Process, Pending for Approval, Completed

🔐 Pickup Code (visible once accepted)

✅ Approval UI for customers in “Pending for Approval” status

🚚 Partner App – Modules & Flow

🔐 1. Authentication

Phone number + OTP login (mocked as 123456)

Uses AsyncStorage for session handling

📋 2. View Assigned Pickups

Each pickup card includes:

👤 Customer Name

📞 Phone Number

📍 Address with optional Google Maps link

📅 Date & Time Slot

🟠 Current Status badge


