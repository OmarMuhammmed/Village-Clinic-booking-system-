# 🚀 Rural Clinic Queue System - Backend PRD

## 1. Executive Summary
A simplified, high-efficiency queue management system designed for medical clinics in rural areas. This document covers the Backend (Django Rest Framework) specifications.

## 2. Core Philosophy
* **Queue-Based, Not Time-Based:** People in villages don't arrive exactly at 5:30 PM; they arrive and wait for their turn. The system provides a **Ticket Number** and an **Estimated Wait Time**.
* **Zero Friction:** No registration, no passwords, no email verification for patients.
* **Real-time Transparency:** Patients can see exactly which number is currently inside the examination room from their phones.

## 3. Functional Requirements

### A. Business Logic & Rules
* **Ticket Generation:** Numbers must be sequential per doctor per day (Resetting every day).
* **No Duplicate Active Bookings:** A single phone number cannot have two "Waiting" tickets for the same doctor on the same day.
* **Status Workflow:** `Waiting` ➔ `In-Progress` ➔ `Done` OR `Cancelled`.
* **Wait-Time Estimation:** Logic based on average check-up time multiplied by the number of people ahead in the queue.

### B. API Responsibilities
* **Public Endpoints:** Fetch doctors list, fetch available days, and create a booking.
* **Secure Endpoints:** Dashboard actions (Next, Cancel, Manual Add) protected by simple authentication for the clinic staff.
* **Real-time Updates:** Providing data for the frontend to poll or receive updates (to keep the "Current Number" live).

## 4. Non-Functional Requirements
* **Performance:** The "Current Number" update must feel instant.
* **Reliability:** The system must handle "Offline" scenarios gracefully (e.g., if the doctor loses internet, the last state remains).

## 5. Roadmap (MVP)
* [ ] **Phase 1:** Core API (Doctors, Days, Tickets)
* [ ] **Phase 2:** Secretary Dashboard (Next/Cancel logic).
* [ ] **Phase 3:** Live updates (Auto-refreshing the ticket status).
* [ ] **Phase 4:** WhatsApp Integration (Messaging API).
