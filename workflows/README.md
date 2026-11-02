# 📚 OrganEase Workflow & Architecture Documentation Suite

Welcome to the technical workflow and architectural documentation for **OrganEase**. This folder contains detailed blueprints and sequence specifications for each tier of the system.

---

## 📑 Documentation Index

| Document | Scope & Focus | Primary Topics Covered |
| :--- | :--- | :--- |
| **[system_architecture_workflow.md](file:///D:/PROJECT_S/OrganEase/workflows/system_architecture_workflow.md)** | **Master Architecture & End-to-End Workflow** | • Multi-tier architecture diagram (Client, Server, Database)<br>• End-to-end organ request & allocation sequence<br>• Cold ischemia viability state machine<br>• Tier responsibility mapping |
| **[frontend_workflow.md](file:///D:/PROJECT_S/OrganEase/workflows/frontend_workflow.md)** | **Frontend Tier (React SPA)** | • Component hierarchy & directory layout<br>• React Router v5 & route guards (`ProtectedRoute`, `AdminProtectedRoute`)<br>• Dual Context + `useReducer` state management<br>• Real-time cold ischemia countdown via Moment.js<br>• Braintree Web Drop-In payment flow |
| **[backend_workflow.md](file:///D:/PROJECT_S/OrganEase/workflows/backend_workflow.md)** | **Backend Tier (Node.js & Express API)** | • Express application pipeline & global middleware<br>• Authentication & RBAC (`loginCheck`, `isAuth`, `isAdmin`)<br>• Multer file uploads & filesystem management<br>• Complete REST API endpoint reference matrix<br>• Braintree sandbox payment processing |
| **[database_workflow.md](file:///D:/PROJECT_S/OrganEase/workflows/database_workflow.md)** | **Database Tier (MongoDB & Mongoose)** | • Full Entity Relationship (ER) diagram<br>• Schema specifications for Users, Categories, Organs, Orders, and Slides<br>• Ischemia window (`pName`) & PIN code (`pPrice`) domain modeling<br>• Order lifecycle state machine<br>• Automated data migration & seeding pipeline |

---

## 🚀 Quick Reference Commands

### Start All Services
- **Backend:** `cd OrganEase/server && node server.js` (Listening on `http://localhost:5000`)
- **Frontend:** `cd OrganEase/client && npm start` (Listening on `http://localhost:3000`)

### Seed / Migrate Database
```powershell
cd OrganEase/server
npm run migrate
```
Or trigger via HTTP GET:
```http
GET http://localhost:5000/api/customize/migrate-db
```

### Pre-Seeded Accounts
- **Procurement Officer (Admin):** `admin@organease.com` / `admin123`
- **Hospital Requisition Team (User):** `hospital@organease.com` / `user123`
