# 📱 Real-time Chat App

A **real-time chat application** with a React Native mobile frontend and a Node.js backend.  
Features include messaging, image sharing, online/offline status, and seen/delivered indicators.


LIVE DEMO:https://vedaz-assignment-react-native-chat-app-wj74.onrender.com
---

## 📂 Project Structure

```
chat/
├─ /mobile        # React Native mobile app
├─ /server        # Node.js + Express backend
├─ README.md
└─ .gitignore
```

---

## ✨ Features

- 🔐 User authentication (JWT-based)  
- 💬 Real-time 1:1 chat using Socket.IO  
- 🖼️ Send text and image messages  
- 📩 Message delivery and seen status  
- 🟢 Online/offline user presence  
- 🗂️ Media gallery in chat  
- 📱 Mobile-first responsive UI  

---

## ⚙️ Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/<your-username>Vedaz_Assignment_react-native-chat-app
/.git
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file (copy from `.env.example`) and fill in your values:

```env
MONGODB_URI=<your_mongodb_connection_string>
PORT=5000
JWT_SECRET=<your_jwt_secret>

CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
```

Run backend:

```bash
npm run dev
```

The backend will be available at:  
👉 `http://localhost:5000`

---

### 3️⃣ Mobile Frontend Setup (React Native)

```bash
cd ../mobile
npm install
```

Create a `.env` file (copy from `.env.example`) and fill in your values:

```env
VITE_BACKEND_URL=http://localhost:5000
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
```

Run the app (Expo CLI or React Native CLI):

```bash
npm run start
```

---

## 🔑 Environment Variables

### Backend (`/server/.env`)

```env
MONGODB_URI=<your_mongodb_connection_string>
PORT=5000
JWT_SECRET=<your_jwt_secret>

CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
```

### Frontend (`/mobile/.env`)

```env
VITE_BACKEND_URL=http://localhost:5000
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
```

⚠️ **Important:** Do **not** push `.env` files to GitHub. Always commit `.env.example`.

---

## 🎥 Demo Video

- Record a **short demo video (≤5 min)** showing:
  - Login & Signup  
  - Real-time chat  
  - Image sharing  
  - Seen/delivered status  
  - Media gallery  
- Upload to **YouTube** or attach the file with your submission.

---

## 👥 Sample Users for Testing

| Name  | Email            | Password |
|-------|------------------|----------|
| Jagan | jagan@gmail.com  | 123456   |
| Gex   | gex@gmail.com    | 123456   |
| Kran  | kran@gmail.com   | 123456   |

---

## 📌 GitHub Repo Structure

```
/mobile      # React Native frontend
/server      # Node.js backend
.env.example # Example env files
README.md
```

---

## 🛠️ Technologies Used

- **Frontend:** React Native, Tailwind CSS, Expo  
- **Backend:** Node.js, Express, MongoDB, Mongoose  
- **Real-time:** Socket.IO  
- **Cloud Storage:** Cloudinary  
- **Authentication:** JWT  

---
