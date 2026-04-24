# 🚀 Rural Clinic Queue System - Frontend PRD

## 1. Executive Summary
A simplified, high-efficiency queue management system designed for medical clinics in rural areas. This document covers the Frontend (React Application) specifications.

## 2. Core Philosophy
* **Zero Friction:** No registration, no passwords, no email verification for patients.
* **Real-time Transparency:** Patients can see exactly which number is currently inside the examination room from their phones.
* **Mobile-First User Experience**

## 3. User Personas
1. **The Patient:** Needs a simple way to book a turn without a complex UI.
2. **The Doctor/Secretary:** Needs a "Remote Control" to call the next patient and manage the crowd.
3. **The Caretaker:** Needs to book for an elderly relative or a child.

## 4. Functional Requirements

### A. Patient Experience (Mobile-First)
* **Clinic Discovery:** A clean landing page to select the Doctor and Specialty.
* **Booking Form:** Extremely simple (Name, Phone Number).
* **Live Ticket View:** A dynamic screen showing:
    * The user's assigned Ticket Number.
    * The "Current Number" being served right now.
    * Estimated remaining time.
* **Multi-Booking:** Option to "Book for someone else" (Inputting a different name but same/different phone).

### B. Doctor/Secretary Dashboard
* **Queue Controller:** A "Next" button to move the queue forward.
* **Status Management:** Ability to "Cancel" a ticket or mark a patient as "No-show".
* **Walk-in Entry:** A manual form for the secretary to add patients who arrived at the clinic without using the app.
* **Session Control:** Ability to Start/End the daily clinic session.

## 5. Non-Functional Requirements
* **Performance:** The "Current Number" update must feel instant.
* **Usability:** Large buttons, high contrast, and Arabic-first language support.
* **Reliability:** The system must handle "Offline" scenarios gracefully (e.g., if the doctor loses internet, the last state remains).

## 6. Success Scenario (The Flow)
1. **Booking:** Patient opens the link ➔ Chooses Dr. Ahmed ➔ Enters name/phone ➔ Gets **Ticket #12**.
2. **Notification:** Patient receives a WhatsApp-style confirmation (simulated or real).
3. **Waiting:** Patient stays at home/cafe and refreshes the page to see "Now serving: #8".
4. **Action:** When it's "Now serving: #10", the patient heads to the clinic.
5. **Completion:** Secretary clicks "Next" ➔ Patient #12 enters ➔ UI updates for everyone else.
