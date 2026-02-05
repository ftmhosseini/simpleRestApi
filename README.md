# Simple REST API 🚀

A robust <b>Node.js</b> and <b>Express</b> backend designed to manage personal finances, including users, income tracking, and expense management. This API leverages Firebase <b>Realtime Database</b> for persistence.


## 🛠 Features

- <b>RESTful CRUD Operations</b>: Full support for creating, reading, updating, and deleting records.

- <b>MVC Architecture</b>: Separated concerns between routes, controllers, and data models for scalability.

- <b>Firebase Integration</b>: Real-time data synchronization using the Firebase Admin/SDK.

- <b>Sequential Atomic IDs</b>: Uses Firebase transactions to generate consistent 3-digit user IDs (100,101,…).

- <b>Defensive Data Merging</b>: Intelligent "Patch" logic for updates to prevent data loss or overwriting nested objects.

- <b>Normalized Data</b>: Middleware implementation to ensure case-insensitivity across keys for reliable database querying.

- <b>Middleware Parsing</b>: Uses express.json() and express.urlencoded() to handle complex JSON payloads.

## 📂 Project Structure

```bash
├── config/       # Firebase configuration and initialization
├── controllers/  # Business logic for Users, Income, and Expenses
├── routes/       # API endpoint definitions
├── models/       # Data classes (e.g., User Class)
├── index.js      # Entry point of the application
└── package.json  # Dependencies and scripts
```

## 🏗 System Architecture

This project follows the MVC (Model-View-Controller) pattern to ensure a clean separation of concerns. Below is the request lifecycle:

1. Client Request: The user sends a REST request (e.g., `POST /api/users`).

2. Middleware: The request passes through `express.json()` and my custom Normalization Middleware to ensure consistent data formatting.

3. Router: The request is routed to the specific resource handler.

4. Controller: Business logic is applied (e.g., calculating transactions or merging data).

5. Firebase SDK: The controller communicates with the Firebase Realtime Database using the Admin SDK.

6. Response: A structured JSON response is sent back to the client.

## 🔐 Environment Variables & Security

To keep sensitive Firebase credentials secure, this project utilizes environment variables. Private keys are never hardcoded or committed to GitHub.

For local development, create a `.env` file in the root directory. On Render, these are configured in the Environment tab of your dashboard.

## 🚀 Getting Started

1. <b>Installation</b>

Clone the repository and install the dependencies:
```bash
npm install
```
or
```bash
npm install express firebase dotenv
```
2. <b>Configuration</b>

Ensure your `config/firebase.js` is set up with your `Firebase` credentials to establish a connection.

3. <b>Running the Server</b>
```bash
node server.js
```
or
```bash
nodemon server.js
```

## 🛣 API Endpoints

<b>👤 Users</b>

Handles user profiles and contact information.

- <b>GET</b> `/api/users` — Retrieve a list of all registered users.

- <b>GET</b> `/api/users/:id` — Fetch detailed information for a specific user by their unique 3-digit ID.

- <b>POST</b> `/api/users` - Create a new user (with sequential digit IDs).

- <b>PATCH/PUT</b> `/api/users/:id` - Update user details.

- <b>DELETE</b> `/api/users/:id` - Remove a user (with 404 validation).

<b>💰 Income & 💸 Expenses</b>

Manages sources of revenue and savings.

- <b>Endpoints:</b> `GET`, `POST`, `DELETE`, `PUT`

- <b>Path:</b> `/api/income` or `/api/expenses`.

- <b>Note:</b> Supports full CRUD operations for financial tracking..

<b>User Data Format:</b>
```json
{
  "name": "Fatemeh",
  "username": "Fati",
  "email": "sali@gmail.com",
  "address": {
    "street": "Oakfield Dr",
    "suite": "10511",
    "city": "Calgary",
    "zipcode": "T2W 2G5"
  }
}
```
<b>Income Data Format:</b>
```json
{
  "wages": 1400,
  "secondary income": 700,
  "Interest": 120,
  "support payment": 40,
  "others": 100
}
```
<b>Expenses Data Format:</b>
```json
{
  "Savings": {
    "RRSP": "500.50$",
    "Investment Savings": "2000",
    "Long-term savings": "0",
    "Bonds": "N/A",
    "others": 5.75
  },
  "Payment Obligations": {
    "credit card": "Overdue",
    "Loan": 0,
    "vehicle lease": "Paid Off",
    "Line of credit": 0
  },
  "Insurance": {
    "life insurance": 550,
    "health insurance": 800,
    "others": 450
  },
  "Housing": {
    "Rent": 1800,
    "rent insurance": 50,
    "storage and parking": 150,
    "utilities": 300,
    "maintainance": 250
  },
  "Utilities": {
    "phone": 120,
    "Internet": 95,
    "water": 60,
    "Heat": 180,
    "Electricity": 210,
    "Cable": 0,
    "others": 20
  },
  "Personal": {
    "transportation": 300,
    "clothing": 200,
    "gifts -family": 150,
    "Personal grooming": 80,
    "dining out": 600,
    "Hobbies": 400,
    "others": 100
  }
}
```


## 🧠 Technical Highlights

1. <b>Atomic Transactional IDs</b>

To avoid ID collisions in a multi-user environment, this API uses runTransaction to ensure that every new user receives a unique, sequential ID starting from 100.
```bash
const result = await runTransaction(counterRef, (current) => {
    return (current === null) ? 100 : current + 1;
});
```

2. <b>Intelligent Merging (The "Patch" Logic)</b>

The API uses a sophisticated merging strategy for updates. When updating a user, the system ensures that if you only change the email, the address remains intact:

merge income data:
```bash
 const mergedData = {
    wages: req.body['wages']?? existingData['wages'],
    secondaryIncome: req.body['secondary income'] ?? existingData['secondary income'],
    interest: req.body['interest'] ?? existingData['interest'],
    supportPayment: req.body['support payment'] ?? existingData['support payment'],
    others: req.body['others'] ?? existingData['others']
};
Object.keys(mergedData).forEach((item)=>{
    if(mergedData[item] === undefined)
        delete mergedData[item]
})
```
3. <b>Case-Insensitive Key Normalization</b>

To ensure database consistency and prevent duplicate nodes (e.g., `Housing` vs `housing`), the API implements a recursive normalization layer.

<b>The Evolution of the Logic:</b> Initially, I used a global string transformation:

```bash
// ❌ Problematic: This lowercases BOTH keys and values (e.g., "Calgary" becomes "calgary")
    req.body = JSON.parse(JSON.stringify(req.body).toLowerCase());
```
To preserve the integrity of user data (like names and addresses) while keeping database keys consistent, I upgraded this to a recursive key-normalization function. This ensures that only the structural keys are modified:

```bash
/**
 * Recursively lowercases all object keys while preserving value casing.
 * @param {Object} obj - The request body or nested object
 */
static lowercaseKeys = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    if (Array.isArray(obj)) {
        return obj.map(this.lowercaseKeys);
    }

    return Object.keys(obj).reduce((acc, key) => {
        // Lowercase the current key and recurse for nested objects
        acc[key.toLowerCase()] = this.lowercaseKeys(obj[key]);
        return acc;
    }, {});
};
```
and we call this `req.body = Expense.lowercaseKeys(req.body);`

<strong>Why this matters:</strong>

- Data Integrity: User names like "Fatemeh" or city names like "Calgary" retain their proper capitalization.

- Query Reliability: Prevents the database from creating separate entries for `Rent` and `rent`, making data retrieval predictable.

- Deep Nesting Support: The recursive nature handles complex objects like the `Expenses` structure, ensuring sub-keys like `RRSP` or `Rent` are also normalized.

4. <b>Middleware Usage</b>

To handle various incoming data formats, the following middleware are implemented:
```bash
app.use(express.json()); // To read JSON bodies
app.use(express.urlencoded({ extended: true })); // To handle URL encoded data
```


## 🔗 Live Demo

I chose to deploy the API on Render (or Vercel) because it supports Continuous Deployment (CD). Every time I push a bug fix or a new feature to my GitHub main branch, the live demo updates automatically. This ensures the recruiters and frontend team always have access to the latest, stable version of the service.

Check out the live API here: [https://your-app-name.onrender.com](https://your-app-name.onrender.com)

# 🚀 Deployment Steps (using Render)
1. Prepare your code for the Web

Before you deploy, make sure your code isn't "locked" to your local computer. Check two things:

    The Port: In index.js (or server.js), make sure you are using an environment variable for the port. Render will assign its own port to your app.
    JavaScript

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    Start Script: Open package.json and ensure you have a start script:
    JSON

    "scripts": {
      "start": "node index.js"
    }

2. Connect to Render

    Go to Render.com and create a free account using your GitHub login.

    Click the "New +" button and select "Web Service".

    Connect your GitHub repository to Render.

    Select your "Simple REST API" repository.

3. Configure the Deployment

Render will ask for a few details:

    Runtime: Node

    Build Command: npm install

    Start Command: npm start (or node index.js)

4. Set Environment Variables (Crucial!)

Since you (hopefully) didn't push your Firebase credentials to GitHub for security, you need to tell Render what they are:

    In the Render dashboard for your app, go to the "Environment" tab.

    Add your keys (e.g., FIREBASE_DATABASE_URL, FIREBASE_PROJECT_ID, etc.).

    Your config/firebase.js should be set up to read these via process.env.

5. Deploy

Click "Create Web Service". Render will pull your code from GitHub, install the dependencies, and give you a URL like https://simple-rest-api-xyz.onrender.com.


