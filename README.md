# 🚀 MaintainIQ Backend

Backend API for **MaintainIQ – AI-Powered QR Maintenance & Asset History Platform** built with Node.js, Express.js, MongoDB, and JWT Authentication.

## 📖 About

MaintainIQ is a maintenance management platform that gives every physical asset a digital identity through QR Codes. Users can report issues, administrators can assign technicians, and technicians can manage the complete maintenance workflow while preserving a permanent asset history.

---

## ✨ Features

- JWT Authentication
- Role-Based Authorization (Admin & Technician)
- Asset Management
- QR Code Support
- Public Asset Page API
- Issue Reporting
- AI Issue Triage
- Maintenance Workflow
- Asset History
- Dashboard Analytics
- Cloudinary Image Upload
- Search & Filtering
- Secure REST API

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cloudinary
- Multer
- Gemini AI API
- bcrypt
- dotenv

---

## 📂 Folder Structure

```
src/
│
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── services/
└── app.js
```

---

## 🔐 User Roles

### Admin

- Manage Assets
- Manage Users
- Assign Technicians
- View Dashboard
- Update Asset Status
- Manage Issues

### Technician

- View Assigned Issues
- Update Issue Status
- Add Maintenance Notes
- Record Parts & Cost
- Resolve Issues

### Public User

- View Public Asset Page
- Report Issues

---

## 🔄 Workflow

Asset Created

↓

QR Code Generated

↓

User Reports Issue

↓

AI Generates Suggestions

↓

Admin Assigns Technician

↓

Technician Performs Maintenance

↓

Issue Resolved

↓

Asset History Updated

---

## 📦 Installation

```bash
git clone https://github.com/dayyanfahad2010/Hackathon_Project_Backend.git

cd Hackathon_Project_Backend

npm install
```

---

## ⚙ Environment Variables

Create a `.env` file.

```env
PORT=

MONGODB_URI=

JWT_SECRET=

JWT_EXPIRES=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

GEMINI_API_KEY=
```

---

## ▶ Running Project

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

## 📡 API Modules

- Authentication
- Assets
- Issues
- Users
- Dashboard
- History

---

## 🔒 Security

- Password Hashing
- JWT Authentication
- Protected Routes
- Role Authorization
- Environment Variables
- Input Validation

---

## 👨‍💻 Author

**Dayyan Fahad**

GitHub:
https://github.com/dayyanfahad2010

LinkedIn:
https://www.linkedin.com/in/dayyan-fahad/
