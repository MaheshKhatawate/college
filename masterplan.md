# masterplan.md

## 1. App Overview & Objective  
A **cloud-based Ayurvedic Diet Management Platform** built on the MERN stack. The system enables Ayurvedic doctors to efficiently create, manage, and organize patient-specific diet charts, while providing patients with a simple, engaging way to follow their prescribed plans.  

The MVP focuses **only on diet**, leaving medicine prescriptions and AI-driven features for future phases.  

---

## 2. Target Audience  
- **Primary Users:** Ayurvedic doctors/dietitians (hospital or independent practice).  
- **Secondary Users:** Patients added by doctors (access via secure login).  

---

## 3. Core Features (MVP)  
- **Doctor Login:**  
  - Add/manage patients.  
  - Create and update diet charts using a **dynamic food database** (8,000+ foods, customizable).  
  - Generate printable diet charts (PDF).  
  - Access patient profiles with health parameters (age, gender, dietary habits, water intake, bowel movement patterns, etc.).  

- **Patient Login:**  
  - View personalized diet charts online (mobile-friendly UI).  
  - Download/print diet charts.  
  - Opt-in to reminders/notifications (hydration, meals, supplements if enabled).  
  - Interact with a **rule-based FAQ chatbot** for basic queries.  

- **Food Database:**  
  - Nutrient values (calories, macros, micros).  
  - Ayurvedic properties (Rasa, potency, digestibility, Dosha effects).  
  - Doctor-editable: add custom foods and recipes.  

---

## 4. Additional Features  
- **Reminders/Notifications:** Configurable by patients. Delivered via web push + email (future: SMS/WhatsApp).  
- **Reporting Tools:** Printable charts for patients, doctor’s record-keeping.  
- **Security & Compliance:**  
  - Role-based access (doctor vs patient).  
  - Encrypted data storage.  
  - Compliance with HIPAA-like standards and local health data laws.  
- **UX Principles:**  
  - **Mobile-first responsive design** with React + Tailwind.  
  - Clean, intuitive workflows aligned with Ayurvedic practice habits.  
- **Integration Ready:** APIs designed for future integration with HIS/EHR.  

---

## 5. Technical Stack (MVP)  
- **Frontend:** React + Tailwind CSS (responsive, mobile-first).  
- **Backend:** Node.js + Express (REST API).  
- **Database:** MongoDB (cloud-hosted, flexible schema for patient profiles and food data).  
- **Auth & Security:** JWT authentication, HTTPS, data encryption at rest.  
- **Deployment:** Cloud hosting (AWS / GCP / Azure).  
- **PDF/Reporting:** jsPDF or server-side PDF service.  
- **Chatbot:** Rule-based FAQ, powered by simple decision trees or keyword matching.  

---

## 6. Conceptual Data Model  
- **User (Doctor/Patient):** name, email, role, login credentials.  
- **Patient Profile:** demographics, health parameters, habits.  
- **Food Item:** name, nutrition data, Ayurvedic classification, tags.  
- **Recipe:** custom foods/recipes linked to food items.  
- **Diet Chart:** linked to patient, list of meals/foods with quantities & timings.  
- **Notification:** type, schedule, opt-in status.  

---

## 7. Development Phases  
**Phase 1 (MVP):**  
- Doctor & patient login.  
- Patient management module.  
- Food database integration.  
- Diet chart creation & PDF export.  
- Patient portal (view, print, reminders).  
- Rule-based chatbot.  

**Phase 2 (Future Enhancements):**  
- ML-assisted diet recommendations.  
- Native mobile app (React Native).  
- Ayurvedic medicine/supplement prescriptions.  
- HIS/EHR integration.  
- AI-powered chatbot.  

---

## 8. Potential Challenges & Solutions  
- **Data Volume (8,000+ foods):** Optimize search/indexing in MongoDB.  
- **Patient Adoption:** Provide simple mobile-friendly access + print options.  
- **Notifications Reliability:** Start with web push/email, expand later.  
- **Compliance:** Implement encryption and secure login from MVP stage.  

---

## 9. Future Expansion Possibilities  
- Add **medicine prescription management**.  
- Build **analytics dashboards** for doctors (patient adherence tracking).  
- Offer **personalized patient mobile apps** with push notifications.  
- Expand chatbot into **AI-powered Ayurveda assistant**.  
- Enable **multi-doctor clinics** with admin dashboards.  


## System Architecture Diagram

Below is the high-level system architecture for the MVP:

```mermaid
flowchart LR
    Doctor[Doctor (Web Login)] -->|Login / Manage Patients| Frontend[React + Tailwind UI]
    Patient[Patient (Web/Mobile Login)] -->|Login / View Diet| Frontend
    Frontend -->|REST API Calls| Backend[Express.js API]
    Backend -->|CRUD Ops| DB[(MongoDB Atlas<br>Food + Patients + Diets)]
    Backend -->|Push Reminders| Notif((Notification Service))
    Backend -->|Query Handling| Chatbot((Chatbot Service))
    Backend -->|Diet Chart / Reports| Frontend
```

A PNG version is also provided separately for presentations:  
[System Architecture Diagram](system_architecture.png)
