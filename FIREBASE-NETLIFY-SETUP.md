# Firebase Authentication Setup for Netlify Deployment

## Fixing the "Failed to register with Google: Firebase: Error (auth/internal-error)" Issue

When you encounter authentication errors on your Netlify deployment (https://renotefy.netlify.app), you need to configure a few settings in Firebase.

## 1. Authorize Your Netlify Domain

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (re-notefy-539da)
3. Navigate to Authentication → Sign-in method → Authorized domains
4. Add your Netlify domain: `renotefy.netlify.app`

![Firebase Authorized Domains](https://i.imgur.com/7ZjGJpU.png)

## 2. Configure Environment Variables in Netlify

1. Go to your [Netlify Dashboard](https://app.netlify.com/)
2. Select your Renotefy site
3. Navigate to Site settings → Build & deploy → Environment variables
4. Add the following environment variables:

```
VITE_FIREBASE_API_KEY=AIzaSyDtn4cyumqwwlmjV2wiVj3MfI1t2sG8Lkw
VITE_FIREBASE_AUTH_DOMAIN=renotefy.netlify.app
VITE_FIREBASE_PROJECT_ID=re-notefy-539da
VITE_FIREBASE_STORAGE_BUCKET=re-notefy-539da.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=914474493268
VITE_FIREBASE_APP_ID=1:914474493268:web:77b9dd56ef7b875876d4c1
VITE_FIREBASE_MEASUREMENT_ID=G-9837DEYRQQ
VITE_FIREBASE_DATABASE_URL=https://re-notefy-539da-default-rtdb.firebaseio.com
```

**Important**: Make sure to set `VITE_FIREBASE_AUTH_DOMAIN` to your Netlify domain, not the default Firebase domain.

## 3. Verify Google Authentication Configuration

Make sure Google Sign-In is properly enabled:

1. In Firebase Console → Authentication → Sign-in method
2. Find "Google" in the provider list
3. Ensure it's enabled (toggle is turned on)
4. Verify the support email is correct

## 4. Deploy and Test

After making these changes:

1. Commit and push your code to GitHub
2. Netlify will automatically redeploy your site
3. Try signing in with Google at https://renotefy.netlify.app/login

## Troubleshooting

If you're still facing issues:

1. Check the browser console for specific error messages
2. Verify that both localhost and your Netlify domain are in the authorized domains list
3. Ensure your Firebase project's API restrictions allow your domain
4. Clear your browser cache and cookies before testing again
5. Try using Incognito/Private browser mode for testing
