# 📘 VibeCraft: Project Summary & Technical Brief

## 1. Project Overview
**VibeCraft** is an all-in-one Smart College Web Application engineered using **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It addresses two major everyday challenges encountered by university students:

1. **Strategic Attendance & Exam Detention Prevention:** Automatically calculating subject-by-subject attendance requirements, projecting future cutoffs against real semester timetables, and simulating the exact impact of leaves and On-Duty (OD) credits.
2. **Real-Time Campus Classroom & Lab Locator:** Providing an interactive visual building map and period-by-period schedules to instantly discover vacant, air-conditioned rooms and computer laboratories across college floors.

---

## 2. Core Problem & Solution

| Problem Faced by College Students | How VibeCraft Solves It |
| :--- | :--- |
| **Ambiguity in 75% Attendance Requirement:** Students rarely know exactly how many future classes they must attend or how many they can safely miss before facing exam detention. | Provides exact class-by-class formulas: $t_{past}$, $t_{future}$, consecutive attendances required, and maximum skippable cushions per course. |
| **Unplanned Sick Leave & Penalties:** Taking unplanned leaves often causes unexpected drops in continuous internal assessment (CIA) marks. | Features a real-time **Leave Simulator** showing percentage drop and internal assessment score impacts (0–5 marks) with recovery steps. |
| **On-Duty (OD) Utilization:** Students unsure how hackathons, symposiums, or sports exemptions affect their threshold. | Includes an **OD Simulator** calculating 100% attendance credit for sanctioned duty days. |
| **Wandering Around Campus for Study Rooms:** Free hours or project work often wasted looking for vacant, quiet rooms with air conditioning. | Features a **Class Booking & Locator** with top-mounted Date & Period selectors, AC filters, and visual interactive floor maps. |
| **Fake or Unreliable Calculations:** Many generic attendance apps assume a static number of total classes. | Directly mapped to authentic college departmental timetables (`IV_ECE_B`, `III_ECE_DS`, `II_BME`, etc.) spanning semester start to semester end dates. |

---

## 3. Key Modules & Functional Architecture

### A. Unified Attendance Dashboard
* **Focused Dashboard Experience:** All split-view/slide-view modes have been unified into a single, high-density, beautifully styled dashboard.
* **Top Quick Settings Bar:** Switch sections, pick target calculation dates, and enter current course percentages or apply 1-click presets (`75%`, `80%`, `85%`, `90%`).
* **KPI Overview:** Instant color-coded badges for **Safe Zone**, **Warning Zone**, **Danger Zone**, and **Irreversible Detention Alert**.
* **Academic Recovery Blueprint:** Calculates marks lost out of 5 CIA attendance points and specifies concrete recovery actions (e.g., extra lab sessions, retests, attendance streaks).
* **Recharts Visualization:** Visual comparison bars showing Current vs. Target vs. Maximum Achievable percentages.

### B. Free Classroom & Lab Booking Locator
* **Top Priority Selector:** Date/Day-of-Week selector (Monday to Friday with live "Today" badge) and Period Selector (Period 1 to 9 with real-time room vacancy counts) positioned right at the top of the interface.
* **Smart Filter Controls:** Search rooms by keyword or floor, filter by AC / Non-AC, and toggle between Available / Occupied rooms.
* **Multiple Visual Modes:**
  * **Visual Building Map:** Floor-by-floor physical elevation grid.
  * **Room Cards Grid:** Clean cards detailing remaining consecutive free periods, amenities (Wi-Fi, AC, sockets), and countdown timer.
  * **Room Inspection & Accept Booking (`accept_booking.tsx`):** Touching or inspecting any classroom opens the booking portal where students can enter their name, department, and purpose (`📚 Self Study`, `💻 Project Dev`, etc.) and click "Accept Booking". Once booked, the room's status instantly updates to **🔴 OCCUPIED** across all campus maps and live counters, accompanied by a digital Boarding Pass / Campus Room Pass.
* **Instant Top Pick Recommendation:** Automatically prioritizes air-conditioned classrooms with the longest continuous free time window.

### C. Bilingual AI Copilot & Fake Attendance Auditor
* **Natural Language Interaction:** Supports English, Tamil, and Tanglish queries (e.g., *"enaku 2 ac room venum inum 2 hours la"*, *"leave edutha mark korayuma"*).
* **AI Truth Verification:** Audits user claims against actual conducted class counts from the college timetable database; politely flags impossible or fake claims and guides students toward realistic safe bunk strategies.

---

## 4. Technology Stack & Implementation Details

* **Framework:** Next.js 16.3.6 (Turbopack, App Router)
* **Frontend Library:** React 19.2.8
* **Language:** TypeScript 5.0 (Strict typing)
* **Styling & Design System:** Tailwind CSS v4 (Glassmorphism, custom gradient tokens, modern rounded aesthetic)
* **Icons & Visuals:** Lucide React Icons
* **Data Visualization:** Recharts 3.10.1
* **Backend Mathematics & APIs:**
  * Next.js Serverless Route Handlers (`/api/predict`, `/api/chat`)
  * Python academic calculator script (`backend/attendance_calculator.py`)

---

## 5. Live Navigation URLs

| Screen / Feature | Local URL |
| :--- | :--- |
| **Main Attendance Dashboard** | [http://localhost:3000](http://localhost:3000) |
| **Class Booking & Campus Locator** | [http://localhost:3000/locator](http://localhost:3000/locator) |
| **Network URL (LAN Devices)** | `http://192.168.31.205:3000` |

---

## 6. Conclusion
VibeCraft elevates collegiate academic tracking from simple manual calculators to an intelligent, automated campus companion. By combining authentic timetable modeling with real-time facility intelligence and natural language assistance, it empowers students to stay safely above attendance thresholds and optimize their campus productivity.
