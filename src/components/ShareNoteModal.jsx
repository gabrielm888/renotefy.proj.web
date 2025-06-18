import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotes } from '../contexts/NotesContext';

const ShareNoteModal = ({ isOpen, onClose, noteId, currentSharedWith = [] }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('viewer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { shareNote, removeNoteSharing } = useNotes();

  if (!isOpen) return null;

  const handleShare = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter an email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await shareNote(noteId, email, permission);
      setSuccess(`Note shared with ${email} successfully`);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to share note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSharing = async (email) => {
    setIsLoading(true);
    
    try {
      await removeNoteSharing(noteId, email);
      setSuccess(`Sharing removed for ${email}`);
    } catch (err) {
      setError(err.message || 'Failed to remove sharing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePublic = async () => {
    setIsLoading(true);
    
    try {
      await toggleNotePublic(noteId);
      setSuccess('Note visibility updated');
    } catch (err) {
      setError(err.message || 'Failed to update note visibility');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAllowCopy = async () => {
    setIsLoading(true);
    
    try {
      await toggleAllowCopy(noteId);
      setSuccess('Copy permission updated');
    } catch (err) {
      setError(err.message || 'Failed to update copy permission');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-dark-light rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 p-4">
          <h3 className="text-lg font-medium">Share Note</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleShare} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Share with email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full p-2 border rounded bg-white dark:bg-dark text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="permission" className="block text-sm font-medium mb-1">
                Permission level
              </label>
              <select
                id="permission"
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="w-full p-2 border rounded bg-white dark:bg-dark text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="viewer">Can view</option>
                <option value="editor">Can edit</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Sharing...' : 'Share'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded text-sm">
              {success}
            </div>
          )}

          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Visibility Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Public note</p>
                  <p className="text-xs text-gray-500">Anyone with the link can view</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isPublic}
                    onChange={handleTogglePublic}
                    disabled={isLoading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Allow copy as template</p>
                  <p className="text-xs text-gray-500">Others can use as template</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={allowCopy}
                    onChange={handleToggleAllowCopy}
                    disabled={isLoading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Shared with section */}
        {currentSharedWith.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <h4 className="text-sm font-medium mb-2">Shared with</h4>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {currentSharedWith.map((item) => (
                <li key={item.email} className="flex justify-between items-center text-sm p-2 rounded bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <span>{item.email}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700">
                      {item.permission === 'editor' ? 'Can edit' : 'Can view'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveSharing(item.email)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareNoteModal;
