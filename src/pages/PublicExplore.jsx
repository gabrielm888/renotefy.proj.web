import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';

const PublicExplore = () => {
  const { getPublicNotes } = useNotes();
  const navigate = useNavigate();
  const [publicNotes, setPublicNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    const loadPublicNotes = async () => {
      try {
        const notes = await getPublicNotes();
        setPublicNotes(notes);
        setFilteredNotes(notes);
      } catch (error) {
        console.error('Error loading public notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPublicNotes();
  }, [getPublicNotes]);

  // Filter notes when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNotes(publicNotes);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = publicNotes.filter(note => 
      note.title.toLowerCase().includes(searchTermLower) || 
      (note.content && note.content.toLowerCase().includes(searchTermLower))
    );
    
    setFilteredNotes(filtered);
  }, [searchTerm, publicNotes]);

  // Open note in study mode
  const handleNoteClick = (note) => {
    navigate(`/study/${note.id}`);
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
            <h1 className="text-3xl font-bold mb-2">Explore Public Notes</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover notes shared by the Renotify community
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search public notes..."
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
                  isPublic={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No public notes found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try different search terms' : 'Be the first to share a public note!'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PublicExplore;
