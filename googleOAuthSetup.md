# Google OAuth Setup (Google Cloud Console) - Complete Notes

This document summarizes everything from creating a Google Cloud project to obtaining the OAuth Client ID for a React/MERN application.

---

# Why Google Cloud?

Google Cloud Console is used to create OAuth credentials (Client ID and Client Secret) required for Google Sign-In.

Google verifies the user's identity and securely returns user information to your application.

---

# Step 1: Open Google Cloud Console

Visit:

https://console.cloud.google.com/

---

# Step 2: Create a New Project

1. Click **Select Project** (top-left).
2. Click **New Project**.
3. Enter:

```
Project Name: ExpenseTracker
```

4. Click **Create**.
5. Wait until the project is created.
6. Select your new project.

---

# Step 3: Open Google Auth Platform

From the left sidebar, navigate to:

```
Google Auth Platform
```

If it is your first time, you'll see:

```
Google Auth Platform not configured yet
```

Click:

```
Get Started
```

---

# Step 4: Configure OAuth

Google will ask for some information.

## Branding

Fill the following:

```
App Name:
Expense Tracker

User Support Email:
your-email@gmail.com

Developer Contact Email:
your-email@gmail.com
```

Click:

```
Next
```

---

## Audience

Choose

```
External
```

This allows anyone with a Google account to sign in.

Click:

```
Create
```

or

```
Continue
```

depending on the screen.

---

# Step 5: OAuth Configuration

After completing Branding and Audience, you'll see:

```
OAuth configuration created!
```

Now you're ready to create your OAuth Client.

---

# Step 6: Create OAuth Client

Click

```
Create OAuth Client
```

---

## Application Type

Choose

```
Web Application
```

---

## Client Name

Example:

```
Expense Tracker Web Client
```

---

# Step 7: Authorized JavaScript Origins

Click

```
Add URI
```

Add:

```
http://localhost:5173
```

If you deploy later, you can also add:

```
https://your-vercel-app.vercel.app
```

You **do not need to add the Vercel URL now**. It can be added later after deployment.

Multiple origins are allowed.

Example:

```
http://localhost:5173

https://expense-tracker.vercel.app
```

---

# Step 8: Authorized Redirect URIs

### If using @react-oauth/google (Popup Login)

Usually you can leave this empty because the library uses a popup instead of redirect.

If Google requires one, add:

```
http://localhost:5173
```

---

# Step 9: Create Client

Click

```
Create
```

Google will generate:

```
Client ID

1234567890-xxxxxxxxxxxxxxxx.apps.googleusercontent.com

Client Secret

GOCSPX-xxxxxxxxxxxxxxxxxx
```

---

# Step 10: Save Client ID

Create a `.env` file in your React project.

```
VITE_GOOGLE_CLIENT_ID=1234567890-xxxxxxxxxxxxxxxx.apps.googleusercontent.com
```

Restart your Vite server after creating or updating the `.env` file.

---

# Folder Structure

```
frontend
│
├── src
├── .env
├── package.json
└── vite.config.js
```

---

# Important Notes

## JavaScript Origins

These specify which websites are allowed to use your Google Client ID.

Examples:

```
http://localhost:5173

https://expense-tracker.vercel.app
```

---

## Redirect URI

Required only for redirect-based OAuth flows.

Not generally required when using popup login with:

```
@react-oauth/google
```

---

# Difference

## Authorized JavaScript Origin

Where your frontend is hosted.

Example:

```
http://localhost:5173
```

---

## Redirect URI

Where Google sends the user after login (used in redirect OAuth flow).

Example:

```
http://localhost:5173
```

---

# Development Setup

Current setup:

```
Origin:
http://localhost:5173

Redirect URI:
(Optional for popup login)
```

---

# Production Setup

Later, after deploying to Vercel:

Add:

```
https://expense-tracker.vercel.app
```

to the Authorized JavaScript Origins.

---

# Final Result

After clicking **Create**, you should have:

✅ Google Cloud Project

✅ OAuth Configuration

✅ OAuth Client

✅ Client ID

The Client ID is now ready to be used in your React application for Google Sign-In.

---

# Next Step

Use the Client ID in your React application with:

```
@react-oauth/google
```

and connect it to your Express backend, where you'll verify the Google login and issue your own JWT for authenticated API access.