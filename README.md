# Todoshi: Real-time Team Collaboration Platform

![Todoshi Banner](./path-to-your-banner-image.png)

## Table of Contents

* [About Todoshi](#about-todoshi)
* [Features](#features)
* [Technology Stack](#technology-stack)

  * [Frontend](#frontend)
  * [Backend](#backend)
  * [Database & Cloud Services](#database--cloud-services)
* [System Architecture](#system-architecture)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Environment Variables](#environment-variables)
  * [Running the Application](#running-the-application)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## About Todoshi

Todoshi is a full-stack, real-time collaboration platform meticulously designed for small teams and individual developers. It streamlines project management by integrating essential functionalities—task management, real-time chat, and secure file sharing—into one intuitive interface. The platform eliminates fragmented workflows and provides a centralized hub for teams to organize, track, and execute tasks efficiently, enhancing productivity and team cohesion.

## Features

**Project Management:**

* Create and manage multiple projects with specific deadlines.
* Upload and attach System Requirements Specification (SRS) documents and project-related images.
* Track project status (Active/Completed).

**Task Management (TODOs):**

* Add daily tasks (TODOs) for each project.
* Assign tasks to collaborators.
* Track task completion status.

**Real-time Communication:**

* Dedicated real-time chat for each project powered by WebSockets (Socket.IO).
* Facilitate instant messaging and media sharing among collaborators.

**User Authentication:**

* Secure user registration and login using Firebase Authentication.
* Support for email/password and social logins (Google, GitHub).
* Backend verification via Firebase Admin SDK.

**User Profiles & Roles:**

* Manage personal profiles including basic information, profile pictures, banners, skills, and social media links.
* Role-based access control for project owners and contributors.

**File Sharing & Document Management:**

* Securely upload and share various file types within projects (images, documents).
* Leverages Cloudinary for efficient cloud storage.

**Responsive Design:**

* Clean, modern, fully responsive UI for desktop, tablet, and mobile.

**Theme Switching:**

* Light and dark themes for personalized experience.

**Robust Error Handling:**

* Comprehensive error handling and loading states.

## Technology Stack

### Frontend

* **React:** JavaScript library for building UIs.
* **Vite:** Fast build tool with instant development server.
* **TailwindCSS:** Utility-first CSS framework.
* **React Router Dom:** Declarative routing.
* **Redux Toolkit / Zustand:** Efficient global state management.
* **Socket.IO Client:** Real-time communication.
* **Axios:** HTTP client for API requests.

### Backend

* **Node.js:** JavaScript runtime.
* **Express:** Minimalist web framework.
* **Socket.IO:** Real-time, bidirectional communication.
* **Mongoose:** MongoDB ODM.
* **Multer:** File upload handling.

### Database & Cloud Services

* **MongoDB:** NoSQL database.
* **Firebase Authentication:** User management.
* **Firebase Admin SDK:** Backend token verification.
* **Cloudinary:** Cloud-based media management.

## System Architecture

```text
+----------------+       HTTP/REST API       +---------------------+        WebSocket          +-------------------+
|                | <-----------------------> |                     | <-----------------------> |                   |
|  User (Client) |                           |  Backend (Node.js)  |                           | Real-time (Socket.io) |
|   (Browser/App)| <-----------------------> |   (Express Server)  |                           |       Server      |
|                |       File Upload/Download  |                     |                           |                   |
+----------------+                           +----------+----------+                           +-------------------+
                                                        |
                                                        | MongoDB / Cloudinary
                                                        v
                                                  +-----------+
                                                  |  Database |
                                                  | (MongoDB) |
                                                  +-----------+
```

* **Client:** React + Vite frontend communicating via REST API and WebSockets.
* **Backend:** Node.js/Express handling API logic and Socket.IO.
* **Database:** MongoDB stores all data.
* **Cloudinary:** Media storage.
* **Firebase:** Authentication.

## Getting Started

### Prerequisites

* Node.js v18.x+
* npm or Yarn
* MongoDB (local or Atlas cluster)
* Git
* Firebase Project (Authentication enabled)
* Cloudinary Account

### Installation

```bash
# Clone the repository
git clone https://github.com/ayushrawat2122/workgrid.git
cd workgrid/WorkGrid-61983357e5d186ed21775084d31b5aed1f7794f2

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create `.env` files in backend and frontend directories.

**Backend `.env`**

```env
PORT=8000
MONGODB_URI="your_mongodb_connection_string"
CORS_ORIGIN="http://localhost:5173"
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_CLIENT_EMAIL="your_firebase_client_email"
FIREBASE_PROJECT_ID="your_firebase_project_id"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
ACCESS_TOKEN_SECRET="a_very_secret_key"
REFRESH_TOKEN_SECRET="another_very_secret_key"
```

**Frontend `.env`**

```env
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
VITE_FIREBASE_APP_ID="your_firebase_app_id"
VITE_FIREBASE_MEASUREMENT_ID="your_firebase_measurement_id"
VITE_BACKEND_URL="http://localhost:8000/api/v1"
VITE_SOCKET_URL="http://localhost:8000"
```

### Running the Application

```bash
# Backend server
cd backend
npm run dev

# Frontend server
cd ../frontend
npm run dev
```

## Contributing

We welcome contributions!

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes.
4. Commit: `git commit -m 'Add new feature'`
5. Push: `git push origin feature/your-feature-name`
6. Open a Pull Request.

Ensure adherence to coding standards and include appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Contact

**Ayush Rawat**

* GitHub: [ayushrawat2122](https://github.com/ayushrawat2122)
* Project Repository: [WorkGrid](https://github.com/ayushrawat2122/workgrid/WorkGrid-61983357e5d186ed21775084d31b5aed1f7794f2)

Feel free to reach out with any questions or feedback!
