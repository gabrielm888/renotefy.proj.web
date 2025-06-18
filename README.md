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
- Node.js 16.x or higher
- npm or yarn
- Firebase account
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

This project is configured for easy deployment to Netlify. The repository can be connected directly to Netlify for continuous deployment.

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
