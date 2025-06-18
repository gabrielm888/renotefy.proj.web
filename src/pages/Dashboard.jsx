import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../contexts/NotesContext';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { notes, sharedNotes, publicNotes, loading } = useNotes();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('my-notes');
  
  const handleCreateNote = () => {
    navigate('/editor/new');
  };

  const handleNoteClick = (noteId) => {
    navigate(`/editor/${noteId}`);
  };

  // Tab content components
  const renderMyNotes = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <motion.div 
        className="h-56 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary dark:hover:border-primary transition-colors duration-200"
        onClick={handleCreateNote}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <p className="mt-2 font-medium text-gray-700 dark:text-gray-300">Create new note</p>
      </motion.div>

      {notes.map((note, index) => (
        <NoteCard 
          key={note.id} 
          note={note} 
          onClick={() => handleNoteClick(note.id)}
          delay={index * 0.05}
        />
      ))}
    </div>
  );

  const renderSharedNotes = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sharedNotes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">
          No shared notes yet. When someone shares a note with you, it will appear here.
        </p>
      ) : (
        sharedNotes.map((note, index) => (
          <NoteCard 
            key={note.id} 
            note={note} 
            onClick={() => handleNoteClick(note.id)}
            delay={index * 0.05}
          />
        ))
      )}
    </div>
  );

  const renderPublicNotes = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {publicNotes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">
          No public notes available. Discover notes when users make them public.
        </p>
      ) : (
        publicNotes.map((note, index) => (
          <NoteCard 
            key={note.id} 
            note={note} 
            onClick={() => handleNoteClick(note.id)}
            delay={index * 0.05}
            isPublic
          />
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-dark flex">
      <Sidebar />
      
      <div className="flex-grow p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Welcome back, {currentUser?.displayName || currentUser?.email}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your notes, studies, and AI tools all in one place
            </p>
          </motion.div>

          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('my-notes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-notes'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                }`}
              >
                My Notes
              </button>
              <button
                onClick={() => setActiveTab('shared')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'shared'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                }`}
              >
                Shared Notes
              </button>
              <button
                onClick={() => setActiveTab('public')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'public'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                }`}
              >
                Public Explore
              </button>
            </nav>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="py-4"
            >
              {activeTab === 'my-notes' && renderMyNotes()}
              {activeTab === 'shared' && renderSharedNotes()}
              {activeTab === 'public' && renderPublicNotes()}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
