# ♻️ SmartWaste — Smart Waste Management System

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge&logo=mongodb)
![Express](https://img.shields.io/badge/Backend-Express.js-black?style=for-the-badge&logo=express)
![React](https://img.shields.io/badge/Frontend-React.js-blue?style=for-the-badge&logo=react)
![Node](https://img.shields.io/badge/Runtime-Node.js-green?style=for-the-badge&logo=node.js)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38bdf8?style=for-the-badge&logo=tailwindcss)

---

## 📌 Problem Statement

> **"In most cities and towns, waste management is still handled through fixed schedules and manual reporting systems. Citizens have no proper platform to report garbage overflow, illegal dumping, or missed pickups in their area. Waste collectors operate without real-time data, leading to inefficient routes and missed locations. City administrators have no centralized dashboard to monitor waste collection performance or identify problem areas.**
>
> **SmartWaste is a full stack waste management system that connects citizens, waste collectors, and city admins on one platform. Citizens can report garbage issues with photos and location, waste collectors receive and manage pickup requests in real time, and admins monitor city-wide waste data through analytics dashboards — making cities cleaner, smarter, and more efficient."**

---

## 🎯 Goals of the Application

| Goal | Description |
|------|-------------|
| 📢 Easy Reporting | Citizens can report garbage issues instantly |
| 🚛 Smart Collection | Collectors get organized pickup tasks |
| 📊 Admin Oversight | Admins monitor performance and problem areas |
| 🌍 Cleaner Cities | Reduce garbage overflow through faster response |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | ReactJS + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Token) |
| Charts | Recharts / Chart.js |

---

## 👥 User Roles

```
👨‍💼 Admin          → Monitor all reports, manage users, view analytics
🚛 Waste Collector → View assigned pickups, update pickup status
👤 Citizen         → Submit garbage reports, track report status
```

---

## 🗺️ App Pages

```
/                    → Home / Landing Page
/signup              → Register
/login               → Login

/citizen/dashboard   → Citizen Home      🔒
/citizen/report      → Submit Report     🔒
/citizen/my-reports  → My Reports List   🔒
/citizen/profile     → Profile & Badges  🔒

/collector/dashboard → Collector Home    🔒
/collector/pickups   → Pickup List       🔒

/admin/dashboard     → Admin Analytics   🔒
/admin/reports       → All Reports       🔒
/admin/users         → User Management   🔒
```

> 🔒 = Protected Route (Login Required)

---

## 🧩 Features — Part by Part

---

### 🔐 PART 1 — Authentication System

A secure, role-based authentication system for all three user types.

**Pages**
```
/signup   → Register as Citizen (default role)
/login    → Login for all roles
```

**Features**
- ✅ Signup Form — Name, Email, Password, Phone, Area/Zone, Role
- ✅ Login Form — Email + Password
- ✅ Role Based Access — Citizen / Collector / Admin
- ✅ JWT Authentication — Token stored in localStorage
- ✅ Protected Routes — Each role sees only their pages
- ✅ Auto Redirect — Wrong role cannot access other dashboards

**Form Validation**
```
✅ Email format check
✅ Password minimum 8 characters
✅ Phone number format validation
✅ All fields required check
✅ Error messages shown below each field
```

**Tech Used**
```
Frontend  → React form, useContext for auth + role state
Backend   → POST /api/auth/signup & /api/auth/login
           bcrypt for password hashing
Database  → users collection
           Index on email field for fast login lookup
```

---

### 📊 PART 2 — Role Based Dashboards

After login, each user sees a completely different dashboard based on their role.

**👤 Citizen Dashboard**
```
┌──────────────────────────────────────┐
│  👋 Hello, Rahul!                    │
│                                      │
│  My Reports                          │
│  📋 Total: 12   ✅ Resolved: 8       │
│  ⏳ Pending: 3  🔄 In Progress: 1   │
│                                      │
│  [ + Submit New Report ]             │
│                                      │
│  Recent Reports                      │
│  📍 MG Road      → ✅ Resolved       │
│  📍 Station Area → 🔄 In Progress   │
│  📍 Park Street  → ⏳ Pending        │
└──────────────────────────────────────┘
```

**🚛 Collector Dashboard**
```
┌──────────────────────────────────────┐
│  👋 Hello, Suresh (Collector)        │
│                                      │
│  Today's Pickups                     │
│  📋 Assigned: 5   ✅ Completed: 3    │
│  ⏳ Pending: 2                       │
│                                      │
│  Assigned Pickup List                │
│  📍 MG Road   → [ Mark Complete ]   │
│  📍 Bus Stand → [ Start Pickup  ]   │
└──────────────────────────────────────┘
```

**👨‍💼 Admin Dashboard**
```
┌──────────────────────────────────────┐
│  📊 City Waste Overview              │
│                                      │
│  Total Reports: 245                  │
│  Resolved: 189   Pending: 41         │
│  Collectors Active: 12               │
│                                      │
│  🔴 Problem Areas This Week         │
│  1. Station Road  → 18 reports      │
│  2. Market Area   → 14 reports      │
│  3. Old City Zone → 11 reports      │
└──────────────────────────────────────┘
```

**Tech Used**
```
Frontend  → Conditional rendering based on role from Context API
Backend   → GET /api/dashboard/citizen
           GET /api/dashboard/collector
           GET /api/dashboard/admin
Database  → MongoDB aggregation for counts and summaries
```

---

### 📝 PART 3 — Garbage Report (CRUD)

Core feature — Citizens submit garbage issue reports with details and photo.

**Report Submission Form**
```
Garbage Type   → [ Household Waste ▼ ]
                 Options: Household / Industrial /
                          Medical / Construction / Other
Location/Area  → [ Type area name... ]
Landmark       → [ Near XYZ school ]
City Zone      → [ Zone A ▼ ]
Description    → [ Describe the issue... ]
Photo Upload   → [ 📷 Upload Image ]
Urgency Level  → 🟢 Low  🟡 Medium  🔴 High

[ Submit Report ]
```

**CRUD Operations**

| Operation | Description | Who Can Do It |
|-----------|-------------|---------------|
| ➕ CREATE | Submit new garbage report | Citizen |
| 👁️ READ | View report details & status | All Roles |
| ✏️ UPDATE | Edit report before accepted | Citizen |
| 🗑️ DELETE | Delete own pending report | Citizen / Admin |

**Report Status Flow**
```
⏳ Pending
    ↓
🔄 In Progress  (Collector accepts)
    ↓
✅ Resolved     (Collector marks complete)
    ↓
❌ Rejected     (Admin rejects invalid report)
```

**Tech Used**
```
Frontend  → Controlled React form, useState, image preview
Backend   → POST   /api/reports
           GET    /api/reports
           PUT    /api/reports/:id
           DELETE /api/reports/:id
Database  → reports collection
           Index on zone, status, createdAt fields
```

---

### 🔎 PART 4 — Search, Filter & Sort

All users can search and filter reports based on different criteria.

**🔍 Search**
```
Search reports by area, landmark, or description
→ Debounced (waits 500ms after user stops typing)
→ Real-time results update
```

**Filter Options**

| Role | Filter Options |
|------|---------------|
| Citizen | Status, Date, Urgency |
| Collector | Zone, Status, Urgency |
| Admin | Zone, Status, Collector, Date Range |

**Sort Options**
```
Date        →  Newest First / Oldest First
Urgency     →  High to Low / Low to High
Status      →  Group by Status
```

**Tech Used**
```
Frontend  → Filter state with useState
           Custom useDebounce hook (500ms delay)
Backend   → GET /api/reports?zone=A&status=pending&page=1
Database  → MongoDB query with $match + indexes on zone & status
```

---

### 📄 PART 5 — Pagination

All report lists are paginated to handle large amounts of data efficiently.

**How It Works**
```
Showing reports 1–10 of 245

[ ← Prev ]   Page 3 of 25   [ Next → ]

Results per page → [ 10 ▼ ]
```

**Where Pagination Is Used**
```
📋 Citizen   → My Reports list
🚛 Collector → Assigned pickups list
👨‍💼 Admin    → All reports list + User management list
```

**Tech Used**
```
Frontend  → Page number state, prev/next buttons
Backend   → GET /api/reports?page=1&limit=10
Database  → MongoDB  .skip((page-1) * limit).limit(limit)
```

---

### 🚛 PART 6 — Pickup Management (Collector)

Waste collectors see all reports assigned to their zone and manage pickup tasks.

**Collector Workflow**
```
Step 1 → Collector logs in
Step 2 → Sees list of Pending reports in their zone
Step 3 → Clicks "Accept Pickup"
         → Status changes: Pending → In Progress
Step 4 → Goes to location and collects garbage
Step 5 → Clicks "Mark as Complete"
         → Status changes: In Progress → Resolved
         → Citizen gets notified
```

**Pickup List View**
```
📍 Report #045 — MG Road
   Type: Household Waste
   Urgency: 🔴 High
   Reported: 2 hours ago
   [ View Details ]  [ Accept Pickup ]

📍 Report #043 — Station Area
   Type: Industrial Waste
   Urgency: 🟡 Medium
   Status: 🔄 In Progress
   [ Mark as Complete ]
```

**Tech Used**
```
Frontend  → Status update buttons, conditional rendering
Backend   → PUT /api/reports/:id/status
           PUT /api/reports/:id/assign
Database  → Update report status + collectorId field
```

---

### 📊 PART 7 — Admin Panel & Analytics

Admin has full control over the system and can view city-wide waste analytics.

**Admin Sections**

**👥 User Management**
```
✅ View all Citizens and Collectors
✅ Search user by name or email
✅ Activate / Deactivate user accounts
✅ Assign collectors to specific zones
```

**📋 All Reports Management**
```
✅ View every report in the system
✅ Filter by zone, status, collector, date
✅ Manually change any report status
✅ Delete invalid or spam reports
```

**📊 Analytics Charts**

| Chart | Description |
|-------|-------------|
| 📊 Bar Chart | Most reported areas this month |
| 📈 Line Chart | Monthly report trend (Jan → Dec) |
| 🥧 Pie Chart | Status breakdown — Resolved / Pending / In Progress |
| 🏆 Table | Collector performance — pickups completed |

**Tech Used**
```
Frontend  → Recharts / Chart.js for visualizations
Backend   → GET /api/admin/analytics
Database  → MongoDB Aggregation Pipeline
           $group by zone    → count reports per area
           $group by month   → monthly totals
           $group by collectorId → performance stats
```

---

### 📈 PART 8 — MongoDB Aggregation

The backend uses MongoDB aggregation pipelines to calculate analytics data.

**Most Reported Zones**
```js
db.reports.aggregate([
  { $group: {
      _id: "$zone",
      totalReports: { $sum: 1 }
  }},
  { $sort: { totalReports: -1 } },
  { $limit: 5 }
])
```

**Monthly Report Count**
```js
db.reports.aggregate([
  { $group: {
      _id: { month: { $month: "$createdAt" } },
      count: { $sum: 1 }
  }},
  { $sort: { "_id.month": 1 } }
])
```

**Collector Performance**
```js
db.reports.aggregate([
  { $match: { status: "resolved" } },
  { $group: {
      _id: "$collectorId",
      completedPickups: { $sum: 1 }
  }},
  { $sort: { completedPickups: -1 } }
])
```

---

### 🏅 PART 9 — Badge & Reward System

Citizens earn badges for actively reporting garbage — keeps them motivated.

**Badge List**

| Badge | Icon | How to Earn |
|-------|------|-------------|
| First Reporter | 🌱 | Submit your first report |
| Active Citizen | ⭐ | Submit 10 reports |
| Clean Zone Hero | 🏆 | 5 reports resolved in your area |
| Streak Reporter | 🔥 | Report for 7 days in a row |
| Top Contributor | 👑 | Most reports in city this month |

**Features**
- ✅ Badges shown on Citizen profile page
- ✅ Auto awarded when condition is met
- ✅ Toast notification when new badge earned
- ✅ Locked badges shown as 🔒 with unlock hint

---

### 🌙 PART 10 — Theme & Profile Settings

**Profile Page**
```
[ 👤 Avatar ]  Rahul Sharma
               Ahmedabad, Zone A
               Member since Jan 2025

📊 My Stats
  Reports Submitted : 12
  Reports Resolved  : 8
  Badges Earned     : 3

🏅 My Badges
  🌱 ⭐ 🔥   🔒 🔒

⚙️ Settings
  [ 🌙 Dark Mode Toggle  ]
  [ ✏️ Edit Profile      ]
  [ 🔑 Change Password   ]
  [ 🚪 Logout            ]
```

**Dark / Light Mode**
```
✅ Toggle button in Navbar
✅ Theme saved in localStorage
✅ Persists after page refresh
✅ Applied globally via Context API
✅ Smooth CSS transition between themes
```

---

## 🗄️ Database Collections

```
📁 MongoDB Collections

users          → name, email, password, phone, role, zone, createdAt
reports        → citizenId, garbageType, location, zone, photo,
                 description, urgency, status, collectorId, createdAt
assignments    → reportId, collectorId, assignedAt, completedAt
badges         → name, description, icon, condition
userBadges     → userId, badgeId, earnedAt
zones          → zoneName, zoneCode, assignedCollectors
```

---

## 🛣️ API Routes

```
AUTH
POST   /api/auth/signup
POST   /api/auth/login

REPORTS
GET    /api/reports              → list with filter/search/pagination
POST   /api/reports              → submit new report
PUT    /api/reports/:id          → update report
DELETE /api/reports/:id          → delete report
PUT    /api/reports/:id/status   → update pickup status

DASHBOARD
GET    /api/dashboard/citizen    → citizen stats
GET    /api/dashboard/collector  → collector stats
GET    /api/dashboard/admin      → admin overview

ANALYTICS
GET    /api/analytics/zones      → reports per zone
GET    /api/analytics/monthly    → monthly trend
GET    /api/analytics/collectors → collector performance

USERS (Admin)
GET    /api/admin/users          → all users list
PUT    /api/admin/users/:id      → activate / deactivate user
```

---

## ✅ All 15 Hackathon Features Mapped

| # | Feature | Where Used in SmartWaste |
|---|---------|--------------------------|
| 1️⃣ | Routing & Navigation | 10+ pages with role-based protected routes |
| 2️⃣ | React Hooks | useState, useEffect, useRef, useContext throughout |
| 3️⃣ | State Management | Auth + Role + Theme via Context API |
| 4️⃣ | Authentication | JWT login with 3 role types |
| 5️⃣ | Dark / Light Mode | Toggle saved in localStorage |
| 6️⃣ | Search, Filter, Sort | Report list with full filter options |
| 7️⃣ | Debouncing | Search bar with 500ms debounce hook |
| 8️⃣ | Pagination | All report lists — 10 per page |
| 9️⃣ | CRUD Operations | Full report create / read / update / delete |
| 🔟 | MongoDB Indexing | Index on zone, status, email, createdAt |
| 1️⃣1️⃣ | MongoDB Aggregation | Zone reports, monthly trends, collector stats |
| 1️⃣2️⃣ | REST API | All Express routes with proper error handling |
| 1️⃣3️⃣ | Form Validation | All forms with proper error messages |
| 1️⃣4️⃣ | Responsive UI | Tailwind CSS — mobile + tablet + desktop |
| 1️⃣5️⃣ | Error Handling | Try-catch on all API calls + error display |

---

## 📁 Folder Structure

```
smartwaste/
├── client/                  # React Frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── context/         # Auth + Theme Context
│       ├── hooks/           # Custom hooks (useDebounce etc.)
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── citizen/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── SubmitReport.jsx
│       │   │   ├── MyReports.jsx
│       │   │   └── Profile.jsx
│       │   ├── collector/
│       │   │   ├── Dashboard.jsx
│       │   │   └── Pickups.jsx
│       │   └── admin/
│       │       ├── Dashboard.jsx
│       │       ├── Reports.jsx
│       │       └── Users.jsx
│       ├── utils/           # API calls, helpers
│       └── App.jsx
│
├── server/                  # Node.js Backend
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Report.js
│   │   ├── Badge.js
│   │   └── Zone.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── reports.js
│   │   ├── dashboard.js
│   │   ├── analytics.js
│   │   └── admin.js
│   └── server.js
│
├── .env
├── .gitignore
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/smartwaste.git
cd smartwaste
```

### 2. Setup Backend
```bash
cd server
npm install
```

### 3. Setup Frontend
```bash
cd client
npm install
```

### 4. Environment Variables
Create a `.env` file in the `server/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 5. Run the Application
```bash
# Run Backend (from server/)
npm run dev

# Run Frontend (from client/)
npm start
```

---

## 👨‍💻 Team Members

| Name | Role |
|------|------|
| Member 1 | Frontend Developer |
| Member 2 | Backend Developer |
| Member 3 | Database & API |
| Member 4 | UI/UX & Testing |

---

## 📄 License

This project is built for **Full Stack Hackathon Event** purposes.

---

> ♻️ *SmartWaste — Making cities cleaner, one report at a time.*
