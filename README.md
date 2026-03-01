🧠 Smart To-Do

# 🧠 Smart To-Do

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![PWA Ready](https://img.shields.io/badge/PWA-Installable-blueviolet)
![Firebase](https://img.shields.io/badge/Firebase-Realtime-orange)
![Status](https://img.shields.io/badge/Status-Production_Ready-success)
Modern Kanban Task Manager (PWA Ready)
Smart To-Do is a professional Progressive Web App (PWA) built with Firebase and modern JavaScript.
It provides a real-time Kanban task management system with advanced deadline intelligence, premium UI animations, and mobile-first design.

🚀 Live Features
🔐 Authentication (Firebase Auth)
Email / Password login & signup

Secure route protection

Auto redirect on auth state change

📋 Smart Kanban Board
Three columns:

To-Do

Ongoing

Completed

Drag & Drop support

Dropdown status change support

Smooth movement animation

Sticky column headers

Collapsible columns (mobile optimized)

⏳ Intelligent Deadline System
Due date with live countdown (seconds precision)

Expired detection

Overdue highlighting

High + Overdue → Critical glow effect

Real-time countdown auto refresh

✅ Premium Completion Intelligence
When a task is completed, Smart To-Do calculates:

✔ Completed Early

✔ Completed Late

✔ Completed On Time

✔ Completed X minutes / hours / days ago

Visual indicators:

🟢 Early → Green

🔴 Late → Red

🔵 On Time → Neutral

✔ Time-ago indicator

📅 Smart Timestamp System
Created time watermark

Due date watermark

“No due date” fallback

Consistent AM/PM format everywhere

Relative time auto-updates

🎨 Premium UI System
Glassmorphism design

Gradient animated buttons

Neon glow priority effects

Critical task pulsing glow

Dark / Light mode toggle

Smooth page fade animations

Clean typography

📱 True Mobile-First Design
Fully responsive layout

No content cut on small screens

Scrollable task lists

Optimized spacing for touch

Works on:

Mobile

Tablet

Desktop

Large displays

📦 Progressive Web App (PWA)
Smart To-Do is installable like a native app.

📲 Add to Home Screen

🔌 Offline support (via Service Worker)

⚡ Fast load performance

🖼 Custom 192x192 & 512x512 icons

Standalone app mode

🛠 Tech Stack
Frontend

HTML5 (Semantic structure)

CSS3 (Flexbox, Glass UI, Animations)

Vanilla JavaScript (ES6+, Modular)

Backend

Firebase Authentication

Cloud Firestore (Realtime DB)

Firebase Hosting (optional)

PWA

Web App Manifest

Service Worker

App Icons

🧩 Core Architecture
Client-side rendering

Real-time Firestore listener

Status-based column grouping

Priority-based sorting

Due date sorting

ServerTimestamp tracking

📁 Project Structure
Smart-To-Do/
│
├── index.html
├── login.html
├── signup.html
├── home.html
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
│
├── manifest.json
├── service-worker.js
└── README.md


⚙️ Installation & Setup
1️⃣ Clone repository:
git clone https://github.com/safiur-official/HexSoftwares_Project_ToDo-Enterprise.git
2️⃣ Configure Firebase
Create Firebase project
Enable:
Authentication (Email/Password)
Firestore Database
Replace Firebase config inside app.js
3️⃣ Run Locally
You must use a local server (PWA requires HTTPS or localhost):
npx serve .
or use VS Code Live Server

📲 Install as App
On supported browsers:
Open Smart To-Do
Click Install button in address bar
Or “Add to Home Screen” on mobile

🎯 Why Smart To-Do is Different
Unlike basic to-do apps, Smart To-Do includes:
Real-time database sync
Smart completion analysis
Priority-based UI intelligence
Neon critical alerts
Fully responsive glass UI
PWA native-like experience

📌 Future Enhancements (Planned)
📊 Analytics Dashboard
📈 Productivity insights
👥 Team collaboration
🔔 Push notifications
☁ Cloud backup export
🎯 Task categories & labels

👨‍💻 Author
Developed by SK Safiur Rahaman

📜 License
This project is licensed under the MIT License.