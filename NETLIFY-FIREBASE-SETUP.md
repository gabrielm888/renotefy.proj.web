# Renotefy Firebase & Netlify Authentication Setup

This guide explains how to configure Firebase and Netlify to ensure smooth authentication for your deployed site.

## Firebase Configuration

### Add Authorized Domains
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`re-notefy-539da`)
3. Navigate to **Authentication → Settings → Authorized domains**
4. Add the following domains:
   - Your Netlify domain (e.g., `renotefy.netlify.app`)
   - Your custom domain if configured

### Check Authentication Methods
1. In Firebase Console, go to **Authentication → Sign-in method**
2. Ensure **Email/Password** and **Google** providers are enabled

## Netlify Configuration

### Environment Variables
Add the following environment variables to your Netlify site settings:

1. Go to **Site settings → Build & deploy → Environment**
2. Add the following variables (get values from your Firebase project settings):

```
VITE_FIREBASE_API_KEY=AIzaSyDtn4cyumqwwlmjV2wiVj3MfI1t2sG8Lkw
VITE_FIREBASE_AUTH_DOMAIN=re-notefy-539da.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://re-notefy-539da-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=re-notefy-539da
VITE_FIREBASE_STORAGE_BUCKET=re-notefy-539da.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=914474493268
VITE_FIREBASE_APP_ID=1:914474493268:web:77b9dd56ef7b875876d4c1
VITE_FIREBASE_MEASUREMENT_ID=G-9837DEYRQQ
```

### OAuth Redirect Settings
For Google authentication to work properly:

1. In Firebase Console, go to **Authentication → Sign-in method → Google**
2. Under **Authorized domains**, add your Netlify domain
3. In **OAuth redirect domains**, add your Netlify domain

## Troubleshooting

If you encounter authentication issues:

1. **Check browser console** for CORS or authorization errors
2. Verify that your Netlify domain is added to Firebase authorized domains
3. Confirm that environment variables are correctly set in Netlify
4. Try clearing browser cache and cookies if testing changes

## Local Development

Copy `.env.example` to `.env.local` and use the following command to run the development server:

```bash
npm run dev
```

Your authentication should now work seamlessly between development and production environments.
