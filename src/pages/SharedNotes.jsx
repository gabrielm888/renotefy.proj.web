import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';

const SharedNotes = () => {
  const { getSharedNotes } = useNotes();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    const loadSharedNotes = async () => {
      if (!currentUser) return;
      
      try {
        const notes = await getSharedNotes();
        setSharedNotes(notes);
        setFilteredNotes(notes);
      } catch (error) {
        console.error('Error loading shared notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSharedNotes();
  }, [getSharedNotes, currentUser]);

  // Filter notes when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNotes(sharedNotes);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = sharedNotes.filter(note => 
      note.title.toLowerCase().includes(searchTermLower) || 
      (note.content && note.content.toLowerCase().includes(searchTermLower))
    );
    
    setFilteredNotes(filtered);
  }, [searchTerm, sharedNotes]);

  // Open note in editor or study mode
  const handleNoteClick = (note) => {
    // Open in editor if the user has edit permissions, otherwise study mode
    const canEdit = note.sharedWithPermissions?.[currentUser.uid] === 'editor';
    if (canEdit) {
      navigate(`/editor/${note.id}`);
    } else {
      navigate(`/study/${note.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark flex">
      <Sidebar />
      
      <div className="flex-grow p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Shared with Me</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Notes that others have shared with you
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search shared notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-dark-light border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 absolute left-3 top-2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>

          {/* Notes grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-primary">Loading notes...</div>
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note, index) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => handleNoteClick(note)}
                  delay={index * 0.05}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No shared notes yet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Notes shared with you will appear here
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SharedNotes;
