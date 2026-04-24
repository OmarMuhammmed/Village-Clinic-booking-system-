# 🚀 Rural Clinic Queue System (PRD)

## 1. Executive Summary
A simplified, high-efficiency queue management system designed for medical clinics in rural areas. The goal is to replace chaotic physical waiting with a transparent, digital numbering system that respects local behavior (low tech-literacy, no accounts, WhatsApp reliance).

## 2. Core Philosophy
* **Queue-Based, Not Time-Based:** People in villages don't arrive exactly at 5:30 PM; they arrive and wait for their turn. The system provides a **Ticket Number** and an **Estimated Wait Time**.
* **Zero Friction:** No registration, no passwords, no email verification for patients.
* **Real-time Transparency:** Patients can see exactly which number is currently inside the examination room from their phones.

---

## 3. User Personas
1.  **The Patient:** Needs a simple way to book a turn without a complex UI.
2.  **The Doctor/Secretary:** Needs a "Remote Control" to call the next patient and manage the crowd.
3.  **The Caretaker:** Needs to book for an elderly relative or a child.

---

## 4. Functional Requirements

### 🟢 Front-End (React Application)

#### A. Patient Experience (Mobile-First)
* **Clinic Discovery:** A clean landing page to select the Doctor and Specialty.
* **Booking Form:** Extremely simple (Name, Phone Number).
* **Live Ticket View:** A dynamic screen showing:
    * The user's assigned Ticket Number.
    * The "Current Number" being served right now.
    * Estimated remaining time.
* **Multi-Booking:** Option to "Book for someone else" (Inputting a different name but same/different phone).

#### B. Doctor/Secretary Dashboard
* **Queue Controller:** A "Next" button to move the queue forward.
* **Status Management:** Ability to "Cancel" a ticket or mark a patient as "No-show".
* **Walk-in Entry:** A manual form for the secretary to add patients who arrived at the clinic without using the app.
* **Session Control:** Ability to Start/End the daily clinic session.

---

### 🔵 Back-End (Django Rest Framework)

#### A. Business Logic & Rules
* **Ticket Generation:** Numbers must be sequential per doctor per day (Resetting every day).
* **No Duplicate Active Bookings:** A single phone number cannot have two "Waiting" tickets for the same doctor on the same day.
* **Status Workflow:** `Waiting` ➔ `In-Progress` ➔ `Done` OR `Cancelled`.
* **Wait-Time Estimation:** Logic based on average check-up time multiplied by the number of people ahead in the queue.

#### B. API Responsibilities
* **Public Endpoints:** Fetch doctors list, fetch available days, and create a booking.
* **Secure Endpoints:** Dashboard actions (Next, Cancel, Manual Add) protected by simple authentication for the clinic staff.
* **Real-time Updates:** Providing data for the frontend to poll or receive updates (to keep the "Current Number" live).

---

## 5. Non-Functional Requirements
* **Performance:** The "Current Number" update must feel instant.
* **Usability:** Large buttons, high contrast, and Arabic-first language support.
* **Reliability:** The system must handle "Offline" scenarios gracefully (e.g., if the doctor loses internet, the last state remains).

---

## 6. Success Scenario (The Flow)
1.  **Booking:** Patient opens the link ➔ Chooses Dr. Ahmed ➔ Enters name/phone ➔ Gets **Ticket #12**.
2.  **Notification:** Patient receives a WhatsApp-style confirmation (simulated or real).
3.  **Waiting:** Patient stays at home/cafe and refreshes the page to see "Now serving: #8".
4.  **Action:** When it's "Now serving: #10", the patient heads to the clinic.
5.  **Completion:** Secretary clicks "Next" ➔ Patient #12 enters ➔ UI updates for everyone else.

---

## 7. Roadmap (MVP)
* [ ] **Phase 1:** Core API (Doctors, Days, Tickets) + Basic Booking UI.
* [ ] **Phase 2:** Secretary Dashboard (Next/Cancel logic).
* [ ] **Phase 3:** Live updates (Auto-refreshing the ticket status).
* [ ] **Phase 4:** WhatsApp Integration (Messaging API).

---

### نصيحة ليك وأنت بتبدأ:
خلي الـ PRD ده قدامك في ملف اسمه `PRODUCT_SPEC.md` وكل ما تخلص Feature علم عليها. لما تيجي تعرض المشروع على دكتور، وريه الـ **Live Ticket View** وهي بتتغير في لحظتها لما السكرتيرة تضغط **Next**.. دي اللحظة اللي هتبهرهم فعلاً.

حابب أبدأ معاك بتقسيمة الـ **Database Schema** عشان تكون جاهزة للـ DRF؟