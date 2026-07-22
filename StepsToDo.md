# Step-by-Step Implementation Guide: Google OAuth Integration

This document outlines **everything you need to do, file by file**, to add **"Sign in with Google" / "Sign up with Google"** to your Expense Tracker application using **Google Identity Services (GIS)**.

---

## Step 1: Google Cloud Console Setup (Get your Client ID)

Before writing code, you need a Google OAuth Client ID:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click **Select a project** (top bar) > **New Project**, name it `Expense Tracker`, and click **Create**.
3. In the left sidebar, navigate to **APIs & Services** > **OAuth consent screen**:
   - Choose **External** and click **Create**.
   - Fill in **App name** (`Expense Tracker`) and **User support email** (your email).
   - Fill in **Developer contact information** (your email).
   - Click **Save and Continue** through Scopes and Test Users.
4. Navigate to **APIs & Services** > **Credentials**:
   - Click **+ Create Credentials** > **OAuth client ID**.
   - Select Application type: **Web application**.
   - Set Name to `Expense Tracker Web Client`.
   - Under **Authorized JavaScript origins**, click **+ Add URI** and enter:
     `http://localhost:5173`
   - Under **Authorized redirect URIs**, click **+ Add URI** and enter:
     `http://localhost:5173`
   - Click **Create**.
5. Copy your **Client ID** (it will look like `1234567890-abcdefg...apps.googleusercontent.com`).

---

## Step 2: Set Environment Variables

### 1. Backend Environment Variable
Open `expenseTrackerBackend/.env` and add:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

### 2. Frontend Environment Variable
Create or open `expenseTrackerFrontend/.env` and add:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

---

## Step 3: Install Required Packages

Run these commands in your terminal:

**In `expenseTrackerBackend`:**
```bash
npm install google-auth-library
```

**In `expenseTrackerFrontend`:**
```bash
npm install @react-oauth/google
```

---

## Step 4: Backend Code Updates (`expenseTrackerBackend`)

### File 1: [expenseTrackerBackend/src/models/users.js](file:///Users/saikrishnamac/Desktop/expenseTracker/expenseTrackerBackend/src/models/users.js)
Update the User model to make `password` optional for Google users and add `googleId` / `authProvider` fields.

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false // Changed from true to false for Google OAuth users
    },
    googleId: {
        type: String,
        default: null
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    income: {
        type: Number,
        default: 0
    },
    remindersEnabled: {
        type: Boolean,
        default: true
    },
    notificationTime: {
        type: String, // format 'HH:MM'
        default: '09:00'
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
```

---

### File 2: [expenseTrackerBackend/src/controllers/authController.js](file:///Users/saikrishnamac/Desktop/expenseTracker/expenseTrackerBackend/src/controllers/authController.js)
Add the `googleLoginUser` function to verify the Google ID token and return your app's JWT token.

```javascript
import User from "../models/users.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10d' });
};

// ... existing registerUser and loginUser functions remain unchanged ...

// Google OAuth Login / Register Controller
export const googleLoginUser = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: "Google Token is required" });
        }

        // Verify Google ID Token with Google servers
        const ticket = await googleClient.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // New user -> Register via Google
            user = await User.create({
                name,
                email,
                googleId,
                authProvider: 'google',
                password: '' // No password needed for Google Auth
            });
        } else if (!user.googleId) {
            // Existing local user -> Link Google ID
            user.googleId = googleId;
            await user.save();
        }

        // Return user data and your custom app JWT token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error(`Error in googleLoginUser: ${error.message}`);
        res.status(400).json({ message: "Invalid Google Token" });
    }
};
```

---

### File 3: [expenseTrackerBackend/src/routes/authRoutes.js](file:///Users/saikrishnamac/Desktop/expenseTracker/expenseTrackerBackend/src/routes/authRoutes.js)
Import `googleLoginUser` and expose the `POST /google` route.

```javascript
import { registerUser, loginUser, googleLoginUser } from "../controllers/authController.js";
import express from 'express';

const router = express.Router();

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLoginUser); // New Google Auth route

export default router;
```

---

## Step 5: Frontend Code Updates (`expenseTrackerFrontend`)

### File 1: [expenseTrackerFrontend/src/main.jsx](file:///Users/saikrishnamac/Desktop/expenseTracker/expenseTrackerFrontend/src/main.jsx)
Wrap the app with `<GoogleOAuthProvider>`.

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
```

---

### File 2: [expenseTrackerFrontend/src/pages/Login.jsx](file:///Users/saikrishnamac/Desktop/expenseTracker/expenseTrackerFrontend/src/pages/Login.jsx)
Add the `<GoogleLogin />` component to `Login.jsx`.

```jsx
import { useState } from "react";
import API from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext.jsx";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const res = await API.post("/auth/login", { email, password });
            login(res?.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Login Failed. Please check credentials");
        } finally {
            setIsLoading(false);
        }
    };

    // Google Login Success Handler
    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        setError(null);
        try {
            // credentialResponse.credential is the Google ID Token
            const res = await API.post("/auth/google", {
                idToken: credentialResponse.credential
            });
            login(res?.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Google Login Failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <form onSubmit={handleLogin} className="flex flex-col gap-3 w-full">
                <input type="email" placeholder="Email" id="email" onChange={(e) => setEmail(e.target.value)} className="border p-2"/>
                <div className="relative w-full">
                    <input type={showPassword ? 'text' : 'password'} placeholder="password" onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 pr-10"/>
                    <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {showPassword ? <FaEyeSlash/> : <FaEye/>}
                    </button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {isLoading && <p className="text-blue-500">Loading...</p>}
                <button className="bg-blue-500 text-white p-2 cursor-pointer">Login</button>
            </form>

            <div className="flex items-center my-2 w-full">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Sign-In Button */}
            <div className="w-full flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Google Login Failed")}
                />
            </div>
        </div>
    );
}

export default Login;
```

---

### File 3: [expenseTrackerFrontend/src/pages/Register.jsx](file:///Users/saikrishnamac/Desktop/expenseTracker/expenseTrackerFrontend/src/pages/Register.jsx)
Similarly, add the `<GoogleLogin />` button to `Register.jsx` for "Sign up with Google".

```jsx
import { useState } from "react";
import API from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext.jsx";
import { GoogleLogin } from '@react-oauth/google';

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const res = await API.post("/auth/register", { name, email, password });
            login(res?.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Registration Failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await API.post("/auth/google", {
                idToken: credentialResponse.credential
            });
            login(res?.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Google Registration Failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <form onSubmit={handleRegister} className="flex flex-col gap-3 w-full">
                <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} className="border p-2" required />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="border p-2" required />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="border p-2" required />
                {error && <p className="text-red-500">{error}</p>}
                {isLoading && <p className="text-blue-500">Loading...</p>}
                <button className="bg-green-500 text-white p-2 cursor-pointer">Register</button>
            </form>

            <div className="flex items-center my-2 w-full">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="w-full flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Google Registration Failed")}
                    text="signup_with"
                />
            </div>
        </div>
    );
}

export default Register;
```

---

## Step 6: Testing & Verification Checklist

1. Start backend dev server: `npm run dev` in `expenseTrackerBackend`.
2. Start frontend dev server: `npm run dev` in `expenseTrackerFrontend`.
3. Go to `http://localhost:5173/login`.
4. Click **Sign in with Google**. A Google popup will open.
5. Select your Google account.
6. Verify that you are redirected to `/dashboard` and your token is saved in `localStorage`.
7. Check MongoDB database to see the user created with `authProvider: 'google'`.
