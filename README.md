<div align="center">

# ☕ Bean & Brew

### A coffee ordering mobile app built with React Native, Expo and Firebase

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Firestore](https://img.shields.io/badge/Cloud_Firestore-FF6F00?style=for-the-badge&logo=firebase&logoColor=white)
![REST API](https://img.shields.io/badge/REST_API-fetch()-009688?style=for-the-badge&logo=postman&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

![Status](https://img.shields.io/badge/status-completed-success?style=flat-square)
![Course](https://img.shields.io/badge/course-Mobile_App_Development-blueviolet?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Web-informational?style=flat-square)

</div>

---

## 📖 About the Project

**Bean & Brew** is a mobile app where users can sign up, browse a coffee menu, add items to a cart, apply a promo code and place orders. User accounts and orders are stored online in **Firebase**, so the data stays safe even when the app is closed or the user logs in from another device.

This project was made for the **Mobile App Development (MAD)** semester project.

---

## ✨ Features

- 🔐 **Firebase Authentication**: sign up, log in and log out with email and password
- 👤 **User Profile**: view and update name, saved in Firestore
- ☕ **Menu**: browse and search coffee items
- 🛒 **Cart**: add or remove items and apply a promo code
- 📦 **Orders**: place an order, which is saved in Cloud Firestore, and view past orders after login
- 💬 **REST API (fetch)**: a "Quote of the Day" card on the Menu screen, with backup APIs
- 🛡️ **Firestore Security Rules**: each user can read and write only their own data
- 👥 **Guest mode**: guest data stays on the device only

---

## 🔥 Firebase Features Used

| Feature | What it does | Where in code |
|---|---|---|
| **Authentication** | Signup, login, logout and keeping the user logged in | `src/context/AuthContext.tsx` |
| **Firestore Write** | Saves user profile in `users/{uid}` and orders in `users/{uid}/orders` | `AuthContext.tsx`, `StoreContext.tsx` |
| **Firestore Read** | Loads the user's profile and past orders after login | `AuthContext.tsx`, `StoreContext.tsx` |
| **Security Rules** | A user can access only their own `users/{uid}` data | Firebase Console |
| **Firebase setup** | Initializes the Firebase app, Auth and Firestore | `src/services/firebase.ts` |

> The Firebase `apiKey` for web apps is a public identifier. Real protection comes from the Firestore Security Rules.

---

## 🌐 API (fetch)

`src/services/api.ts` uses `fetch()` to load a short quote or advice from `https://dummyjson.com/quotes/random`. If the first API is down, it tries backup APIs (`https://api.adviceslip.com/advice` and `https://jsonplaceholder.typicode.com/posts/{id}`). The result is shown as the **"Quote of the Day"** card on the Menu screen (`src/components/BaristaPick.tsx`). While loading it shows "Loading…", and if every API fails it shows a friendly message, so the app never crashes.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native + Expo | Cross-platform mobile app |
| TypeScript | Type-safe code |
| Expo Router | Screen navigation (tabs) |
| Firebase Authentication | User login system |
| Cloud Firestore | Online database |
| fetch() + REST API | Loading data from the internet |

---

## 📁 Project Structure

```
BeanAndBrew/
├── src/
│   ├── app/
│   │   └── (tabs)/            # Menu, Cart, Orders, Profile screens
│   ├── components/
│   │   └── BaristaPick.tsx    # Quote of the Day card (API)
│   ├── context/
│   │   ├── AuthContext.tsx    # Firebase Auth + user data
│   │   └── StoreContext.tsx   # Cart and orders (Firestore)
│   ├── services/
│   │   ├── firebase.ts        # Firebase setup
│   │   └── api.ts             # fetch() API calls
│   └── constants/
│       └── theme.ts           # Colors and theme
├── assets/                    # Images and icons
├── package.json
└── README.md
```

---

## 🚀 How to Run

```bash
# 1. Clone the repository
git clone https://github.com/alishbahumar/bean-and-brew-mad.git

# 2. Go into the project folder
cd bean-and-brew-mad

# 3. Install dependencies
npm install

# 4. Start the app
npx expo start -c
```

- Scan the QR code with **Expo Go** on your phone (phone and laptop on the same Wi-Fi), or
- Press **`w`** in the terminal to open the app in the browser.

---

## 👥 Team

| Member | Responsibility |
|---|---|
| **Alishbah Umar** | Login, Signup, Profile and Firebase Authentication |
| **Adina Sultan** | Menu, Cart, Orders, Firestore orders and API card |

---

## 🔗 Links

- 📂 **GitHub Repository:** https://github.com/alishbahumar/bean-and-brew-mad

---

<div align="center">

Made with ☕ and ❤️ for the MAD Semester Project

</div>
