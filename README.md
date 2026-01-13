# Barangay Stray Animal Tracking and Monitoring System

A modern, minimalistic web application built with **React + Vite**, **Firebase**, and **Tailwind CSS** for tracking and monitoring stray animals in a barangay community.

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State Management**: Zustand
- **Icons**: Lucide React

## 📱 Features

### User Roles
- **Admin**: Full system access, user management
- **Staff**: Animal records management
- **Veterinarian**: Medical records focus

### Core Features
- 📊 Dashboard with real-time statistics
- 🐕 Animal record management (CRUD)
- 💉 Vaccination tracking
- ✂️ Neutering/Spaying status
- 📋 Visit history recording
- 👥 User management (Admin only)
- 🌙 Dark mode support
- 🔐 Role-based access control

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   cd Barangay-ECHO
   npm install
   ```

2. **Seed the database (first time only)**
   ```bash
   npm run seed
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open** http://localhost:3000

## 📧 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@barangay.com | password123 |
| Staff | staff@barangay.com | password123 |
| Veterinarian | vet@barangay.com | password123 |

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Button, Card, Badge, Input
│   └── Shell.jsx        # Main layout with nav
├── lib/
│   ├── firebase.js      # Firebase config
│   ├── auth.js          # Auth functions
│   ├── animals.js       # Animal CRUD
│   ├── visits.js        # Visit management
│   └── users.js         # User management
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── AnimalsPage.jsx
│   ├── AddAnimalPage.jsx
│   ├── AnimalDetailPage.jsx
│   ├── VisitsPage.jsx
│   ├── AddVisitPage.jsx
│   ├── ProfilePage.jsx
│   └── AdminUsersPage.jsx
├── store/
│   ├── authStore.js
│   └── animalStore.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🎨 Design

- Clean, minimalistic UI
- Amber/gold primary color (barangay theme)
- Dark mode support
- Responsive design

## 🏫 Academic Context

- **Institution**: Cavite State University – Imus Campus
- **Program**: BSCS Research Prototype
