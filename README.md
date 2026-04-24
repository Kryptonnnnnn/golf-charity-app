# 🏌️ Golf Charity Web App

A full-stack web application that allows users to participate in monthly draws, win prizes, and contribute to charitable causes.

---

## 🚀 Live Demo

- 🌐 Live Website: https://golf-charity-app-henna.vercel.app/
- 👤 User Dashboard: https://golf-charity-app-henna.vercel.app/login
- 🛠 Admin Panel: https://golf-charity-app-henna.vercel.app/admin-login

---

## 🔐 Admin Credentials

- Email: admin@gmail.com  
- Password: admin123  

---

## 📌 Features

### 👤 User
- Signup & Login (Supabase Auth)
- Subscribe (Monthly / Yearly)
- Add Scores (1–45)
- Select Charity
- View Draw Results
- View Winnings
- Leaderboard Ranking

### 🛠 Admin
- Secure Admin Login
- Run Monthly Draw
- Auto Prize Distribution
- View All Users
- Manage Draw Results

---

## 💰 Business Logic

- Each user contributes ₹100
- Prize pool = total users × ₹100
- Distribution:
  - 5 Matches → 40%
  - 4 Matches → 35%
  - 3 Matches → 25%

---

## 🧠 Tech Stack

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Supabase (Auth + Database)
- Deployment: Vercel

---

## 🗄 Database Tables

- users (Supabase Auth)
- profiles
- scores
- draws
- winners
- subscriptions
- charities

---

## ⚙️ Setup Instructions

### 1. Clone Repo
 bash
 - git clone https://github.com/kryptonnnnnn/golf-app.git
 - cd golf-app

### 2. Install Dependencies
 - npm install

### 3. Create .env file
 - VITE_SUPABASE_URL=your_url
 - VITE_SUPABASE_ANON_KEY=your_key

### 4. Run Project
 - npm run dev
