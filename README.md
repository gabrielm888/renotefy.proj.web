# Renotify

A modern, AI-powered note-taking web application with a sleek, minimalist design inspired by Apple's aesthetics. Built with React, Firebase, and Google's Generative AI (Gemini).

## Features

### Core Functionality
- **User Authentication**: Secure login/register with email/password or Google Sign-In
- **Rich Text Editor**: Full-featured editor with formatting, lists, links, and image uploads
- **Note Management**: Create, edit, delete, and organize notes with real-time updates
- **Responsive Design**: Beautiful UI that works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: System-aware theme with manual toggle option

### AI-Powered Tools (via Gemini API)
- **Smart Summarization**: Generate concise summaries of your notes with adjustable length
- **Mind Mapping**: Create visual knowledge maps from your notes
- **Quiz Generation**: Auto-generate study quizzes from your notes (multiple choice or short answer)
- **Grammar & Style Review**: Get AI-powered suggestions to improve your writing
- **Smart Emoji Generation**: Automatically suggest relevant emojis for your notes
- **Translation**: Translate your notes to and from multiple languages
- **AI Study Assistant**: Chat with an AI that understands your notes

### Collaborative Features
- **Note Sharing**: Share notes with other users via email
- **Public Notes**: Publish notes for anyone to view
- **Study Mode**: Distraction-free reading environment with AI assistant

## Tech Stack

### Frontend
- **React 18** with Hooks
- **Vite** for blazing fast development
- **React Router** for SPA routing
- **Tailwind CSS** for styling
- **Framer Motion** for smooth animations
- **Radix UI** components for accessible UI elements

### Backend & Services
- **Firebase Authentication** for user management
- **Firebase Firestore** for database
- **Firebase Realtime Database** for collaborative features
- **Firebase Storage** for image uploads
- **Google Generative AI (Gemini)** for AI features

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Firebase account
- Vercel account (for deployment)

### Environment Setup

1. Copy the example environment file and update with your Firebase config:
   ```bash
   cp .env.example .env.local
   ```

2. Update the following environment variables in `.env.local` with your Firebase project credentials:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Under "Your apps", add a new web app if you haven't already
5. Copy the configuration object and update your environment variables

### Vercel Deployment

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click "Add New" > "Project"
3. Import your repository
4. Configure project settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Add environment variables (from your `.env.local` file):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID` (optional)
6. Click "Deploy"

#### Firebase Configuration for Vercel
After deployment:
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Authentication > Settings > Authorized domains
4. Add your Vercel domain (e.g., `your-app.vercel.app`)

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Firebase Authentication Issues
- Ensure your domain is added to Firebase Authorized Domains
- Check browser console for any CORS or configuration errors
- Verify that all required Firebase services are enabled in the Firebase Console

### Environment Variables
- Make sure all required environment variables are set in both `.env.local` (development) and Netlify (production)
- Never commit `.env.local` to version control

## License

MIT
- Google Generative AI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/renotify.git
cd renotify
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## Deployment

This project is configured for easy deployment to Vercel. The repository can be connected directly to Vercel for continuous deployment. The application is built as a static site with client-side routing and Firebase integration.

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and other assets
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Application pages
│   ├── services/          # Firebase and AI service configurations
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main application component with routing
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
└── package.json           # Project dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from Apple's products and interfaces
- Google's Generative AI team for Gemini API access

---

Built with ❤️ using React and Firebase
