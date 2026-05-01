# Payment Web Application

A full-stack payment web application built with a React/Redux frontend, a Node.js/Express backend, and MongoDB for state persistence. It seamlessly integrates a PHP-based payment processing script (simulating the pawaPay SDK) to handle direct mock payments, track transaction history, and manage user and owner balances.

## Features

- **Dynamic Premium UI:** A beautifully designed frontend using React, Redux, and modern vanilla CSS (glassmorphism, dark mode, animations).
- **Mock Payment Processing:** End-to-end integration mapping Node.js requests to a PHP payment wrapper (`process_payment.php`).
- **User Balance Management:** Deducts pseudo-money from the user's wallet when payments are made.
- **System Owner Dashboard:** Tracks and increments total system earnings for the owner.
- **Payment History:** Records and displays every transaction in a comprehensive table.

---

## Tech Stack

- **Frontend:** React, Vite, Redux Toolkit, React-Redux, Axios, Lucide React, Vanilla CSS.
- **Backend:** Node.js, Express.js, Mongoose, Dotenv, Child Process (to execute PHP scripts).
- **Database:** MongoDB.
- **Payment Script:** PHP.

---

## Prerequisites

Before running this project, ensure you have the following installed on your local machine:
- **Node.js** (v16.x or higher)
- **MongoDB** (running locally on port `27017`)
- **PHP** (installed and added to your system's PATH)

---

## Installation & Setup

### 1. Clone the repository & enter the directory
```bash
cd pawa-pay-integration
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (if it doesn't already exist) and add the following:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/payment_app
PORT=5000
```

### 3. Install Backend Dependencies
Run the following command in the root `pawa-pay-integration` folder:
```bash
npm install
```

### 4. Install Frontend Dependencies
Navigate to the `frontend` folder and install its dependencies:
```bash
cd frontend
npm install
```

---

## Running the Application

### 1. Start MongoDB
Ensure your local MongoDB instance is running. If you're using MongoDB Compass or a local Windows service, verify it is active and listening on port `27017`.

### 2. Seed the Database (Initial Setup Only)
From the root directory (`pawa-pay-integration`), run the seed script to populate the database with a dummy user and system owner:
```bash
node seed.js
```
*Note: This will clear existing data and insert the default mocked data.*

### 3. Start the Backend Server
From the root directory, start the Express.js server:
```bash
node server.js
```
The backend API will run on `http://localhost:5000`.

### 4. Start the Frontend Development Server
Open a new terminal window, navigate to the `frontend` folder, and start Vite:
```bash
cd frontend
npm run dev
```
The React application will be accessible at `http://localhost:5173`.

---

## Project Structure

```plaintext
pawa-pay-integration/
├── frontend/                  # React & Redux application
│   ├── src/
│   │   ├── components/        # Dashboard, Forms, History views
│   │   ├── store/             # Redux slices (User, History)
│   │   ├── App.jsx            # Main Layout
│   │   └── index.css          # Premium Custom Styling
├── DB_connect/
│   └── index.js               # MongoDB connection logic
├── schema/
│   ├── user.js                # Mongoose schema for User
│   ├── owner.js               # Mongoose schema for Owner
│   └── paymentHistory.js      # Mongoose schema for Transactions
├── process_payment.php        # PHP wrapper executing payment logic
├── server.js                  # Express API server
├── seed.js                    # Database seeder script
├── package.json               # Backend dependencies
└── README.md                  # Project documentation
```

---

## How the Payment Integration Works
1. The user initiates a **Direct Payment** from the React frontend.
2. An Axios `POST` request is sent to the Express backend (`/api/pay`).
3. The Express backend spawns a `child_process` and executes `process_payment.php` using the PHP CLI.
4. The PHP script processes the input, simulates the payment (with a network delay and generated transaction ID), and outputs a JSON success response.
5. The Express server parses the PHP output, subtracts the amount from the User's balance, adds it to the Owner's earnings, and saves a `PaymentHistory` record in MongoDB.
6. The frontend Redux state is updated dynamically to reflect the new balances.
