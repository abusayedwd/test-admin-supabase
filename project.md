# 🕌 DeenHub Admin Panel

A secure admin dashboard for managing the **DeenHub** Islamic App — built with modern full-stack technologies using **Next.js 15 App Router**, **Supabase**, and a beautifully designed UI powered by **Shadcn UI** and **Tailwind CSS**.

---

## 🔧 Tech Stack

### Full-Stack Framework

- **Next.js 15 (App Router)**
- **React 19** (React Server Components)
- **TypeScript**

### Backend / Database

- **Supabase** (PostgreSQL, Auth, RLS)
- **Edge Runtime-compatible APIs**
- **Supabase Admin Client (Server only)**

### UI / Styling

- **Tailwind CSS**
- **Shadcn UI** (Built on Radix UI)
- **Radix UI** (Accessible, unstyled primitives)

---

## ✨ Features

### 🔐 Admin Authentication

- Only **admin users** can log in — no access for normal users
- Auth-first UI — shows **login page first**
- Supabase-based session and role verification
- Secure RLS-backed access control

---

### 👥 Users Management

- View all registered users from the app
- Filter users by **plan** (Free / Subscribed)
- Perform actions:  
  - **Edit** user info
  - **Delete** user
  - **Change Subscription Plan**
  - **Add new user** manually from admin
- Powerful filters & search functionality

---

### 🚨 Reported Content Moderation

- View content flagged by AI or users
- Sources include:
  - AI Chatbot responses
  - Quran AI explanation feedback
  - Reported Hadith content
- Perform actions to **resolve**, **flag**, or **delete** reported items

---

### 📖 Free Quran Requests

- View and manage Quran distribution requests
- Add new requests manually
- Remove or mark as fulfilled

---

### 🕌 Mosque Metadata Management

- View, update, or delete mosque metadata records
- Add new mosque entries
- Useful for location-aware features in the main app

---

## 🚧 Roadmap (Upcoming)

- Admin audit logs
- AI-based moderation suggestions
- CSV export of user data
- Role-based multi-admin support

---

## 🛡 Security

- Supabase RLS is strictly enforced
- No sensitive operations are available on the client
- Admin operations require server-side Supabase key (never exposed)
- JWT auth tokens managed securely via server cookies

---

## 🧠 About DeenHub

_DeenHub is a modern Islamic app aiming to spread authentic knowledge, AI-powered Islamic assistance, and community-driven tools to Muslims around the world._

---
