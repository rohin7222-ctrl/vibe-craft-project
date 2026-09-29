# 🎓 VibeCraft &bull; Smart Attendance Predictor & Campus Room Locator

> **A state-of-the-art Next.js & TypeScript academic platform for college students to track attendance cutoffs, simulate leaves, prevent irreversible detention, and locate vacant classrooms in real time.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Turbopack](https://img.shields.io/badge/Bundler-Turbopack-000000?style=for-the-badge&logo=vercel)](https://turbo.build/)

---

## 🌟 Executive Summary

**VibeCraft** is an intelligent college assistant application designed to solve two critical challenges faced by university students every semester:

1. **Academic Attendance & Condonation Prevention:** Calculating exact attendance percentages based on real college schedules, forecasting the mathematical impact of sick leaves, leveraging On-Duty (OD) credits, and safeguarding against exam detention.
2. **Campus Room & Facility Discovery:** Discovering empty, air-conditioned classrooms and computer labs for study sessions, meetings, or project work with real-time floor plans and countdown timers.

---

## 🚀 Key Modules & Capabilities

### 1. 📊 Unified Attendance Dashboard
* **100% Dedicated Dashboard View:** Replaced cluttered multi-view/split modes with a clean, unified dashboard.
* **Top Quick Settings Bar:** Switch sections (`IV_ECE_B`, `III_ECE_DS`, `II_BME`, etc.), configure target dates, and adjust subject attendance percentages with real-time dynamic recalculations.
* **Batch Presets:** 1-click presets (`75%`, `80%`, `85%`, `90%`, or Clear) across all courses.
* **Mathematical Intelligence:**
  * Exact calculation of past classes conducted ($t_{past}$), future classes ($t_{future}$), and total semester sessions ($t_{total}$).
  * Consecutive classes required to attain or recover the 75% university threshold.
  * Safe bunkable sessions cushion before falling into danger.
  * Early detection of irreversible detention (where even 100% future attendance cannot achieve 75%).

### 2. 🩺 Leave & On-Duty (OD) Simulator
* **Interactive Sliders:** Test upcoming sick leaves (0–10 days) and On-Duty exemptions (0–10 days).
* **Official OD Credit Policy:** Classes during approved OD days count as 100% present, reducing mandatory classroom hours.
* **Academic Recovery Blueprint:** Computes internal continuous assessment (CIA) marks loss (out of 5 attendance marks) and provides compensatory action plans (record submissions, retests, lab sessions).

### 3. 🏛️ Campus Free Classroom & Lab Locator
* **Top Booking Bar:** High-prominence Weekday selector (Monday to Friday with live "Today" indicator) and Period Selector (Period 1 to 9 with timings and live room counts) right at the very top of the page.
* **Multiple Visual Perspectives:**
  * **Interactive Visual Building Map:** Floor-by-floor layout representing physical room elevations.
  * **Cards Grid View:** Room-by-room status with AC badges, capacity, and consecutive free period badges.
  * **Master Matrix View:** Full timetable matrix comparing all rooms across all 9 periods.
  * **Elevation Architecture Map & Grouped Floor Views.**
* **Real-time Filters:** Search by room name/floor, toggle AC/Non-AC, filter by status (Free/Occupied), or jump directly to live clock period with `⚡ Sync to Live Now`.

### 4. 🤖 AI Campus Copilot & Truth Auditor
* **Multilingual / Tanglish NLP:** Communicates fluently in English, Tamil, and Tanglish (e.g., *"enaku 2 ac room venum inum 2 hours la"*, *"Leave எடுத்தா mark குறையுமா?"*).
* **Fake Attendance Auditor & Truth Verifier:** Detects inflated percentages or mathematically impossible class claims, comparing user assertions against official timetable records and alerting students before condonation penalties arise.

---

## 📂 Project Architecture

```
vibe-craft-project-main/
├── backend/
│   └── attendance_calculator.py    # Python academic computation model & timetable parser
├── public/                         # Public static assets & favicon
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts       # Multilingual AI copilot & room scout API
│   │   │   └── predict/route.ts    # Mathematical attendance prediction API
│   │   ├── attendance/page.tsx     # Direct attendance route
│   │   ├── locator/page.tsx        # Campus classroom locator & visual map page
│   │   ├── layout.tsx              # Root HTML shell & fonts
│   │   ├── page.tsx                # Main Unified Attendance Dashboard
│   │   └── globals.css             # Tailwind v4 theme styling
│   ├── components/
│   │   ├── locator/
│   │   │   ├── TopBookingBar.tsx   # Top Date & Period Selector
│   │   │   ├── accept_booking.tsx  # Interactive Classroom Booking & Digital Pass
│   │   │   ├── FreeRoomsShowcase.tsx
│   │   │   ├── VisualBuildingMap.tsx
│   │   │   ├── AIRoomScout.tsx
│   │   │   ├── LocatorFilters.tsx
│   │   │   ├── RoomCountdownModal.tsx # Inspection view with 1-click Accept Booking
│   │   │   ├── MasterMatrixView.tsx
│   │   │   └── ...
│   │   ├── AcademicRecoveryCard.tsx# Internal marks & recovery strategy
│   │   ├── AttendanceCharts.tsx    # Recharts visualization
│   │   ├── AttendanceConfigCard.tsx# Top dashboard setup & subject percentage inputs
│   │   ├── BrandHero.tsx           # Global branding navigation bar
│   │   ├── ChatbotWidget.tsx       # Floating AI Academic Advisor
│   │   ├── DashboardScreen.tsx     # Main dashboard cards & KPI layout
│   │   ├── KPIOverview.tsx         # Real-time safe/warning/danger badges
│   │   └── LeavePlanner.tsx        # Sick leave & OD simulator
│   ├── data/
│   │   ├── roomData.ts             # 10 campus rooms, floors, AC specs & 9-period schedules
│   │   └── timetableData.ts        # Weekly schedules for 10+ college sections
│   ├── types/
│   │   └── attendance.ts           # TypeScript interfaces & types
│   └── utils/
│       ├── attendanceCalculator.ts # Core semester attendance algorithms
│       └── calculator.ts           # Utility functions
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
* **Node.js**: v18.18.0 or higher
* **npm**: v9 or higher

### Installation

1. **Clone or Navigate to the project directory:**
   ```bash
   cd vibe-craft-project-main
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   * 🏠 **Main Attendance Dashboard:** [http://localhost:3000](http://localhost:3000)
   * 🗺️ **Class Booking & Campus Map:** [http://localhost:3000/locator](http://localhost:3000/locator)

---

## 📊 Core Timetable & Period Timing Schedule

| Period | Time Window | Typical Usage |
| :--- | :--- | :--- |
| **Period 1** | 09:00 AM &ndash; 09:50 AM | Morning Lecture 1 |
| **Period 2** | 09:50 AM &ndash; 10:40 AM | Morning Lecture 2 |
| **Period 3** | 10:40 AM &ndash; 11:30 AM | Mid-Morning Lecture / Lab Slot |
| **Period 4** | 11:30 AM &ndash; 12:20 PM | Pre-Lunch Session |
| **Period 5** | 12:40 PM &ndash; 01:30 PM | Afternoon Lecture 1 |
| **Period 6** | 01:30 PM &ndash; 02:20 PM | Afternoon Lecture 2 |
| **Period 7** | 02:20 PM &ndash; 03:10 PM | Late Afternoon Lab / Theory |
| **Period 8** | 03:10 PM &ndash; 04:00 PM | Extended Practical Session |
| **Period 9** | 04:00 PM &ndash; 04:50 PM | Evening Elective / Study Hour |

---

## 🛠️ API Reference

### 1. `POST /api/predict`
Calculates attendance forecast for a given section, target date, and user percentages.
* **Payload:**
  ```json
  {
    "section": "IV_ECE_B",
    "targetDate": "2026-11-29",
    "userPercentages": {
      "Wireless Communication": 72,
      "Machine Learning": 88
    },
    "targetPercentage": 75,
    "simulation": { "odDays": 2, "sickDays": 1 }
  }
  ```

### 2. `POST /api/chat`
Context-aware bilingual AI advisor for attendance analysis or real-time classroom finding.
* **Payload:**
  ```json
  {
    "message": "enaku 2 ac room venum inum 2 hours la",
    "day": "Monday",
    "period": 3
  }
  ```

---

## 📄 License & Credits

Built with ❤️ for collegiate academic success and seamless campus navigation.
