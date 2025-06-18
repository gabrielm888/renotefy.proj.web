import React from 'react';
import { motion } from 'framer-motion';

const NoteCard = ({ note, onClick, delay = 0, isPublic = false }) => {
  // Format date to a readable string
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    // Handle Firebase Timestamp or string date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Truncate content for preview
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    
    // Remove HTML tags for plain text preview
    const plainText = content.replace(/<[^>]*>/g, '');
    
    if (plainText.length <= maxLength) return plainText;
    return `${plainText.substring(0, maxLength)}...`;
  };

  return (
    <motion.div
      onClick={onClick}
      className="h-56 bg-white dark:bg-dark-light rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-primary shadow-sm hover:shadow transition-all duration-200 overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <span className="text-2xl mr-2" role="img" aria-label="Note emoji">
              {note.emoji || '📝'}
            </span>
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {note.title || 'Untitled Note'}
            </h3>
          </div>
          
          {/* Visibility indicators */}
          <div className="flex space-x-1">
            {note.isPublic && (
              <span title="Public note" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full">
                Public
              </span>
            )}
            {isPublic && (
              <span title={`Created by ${note.userName}`} className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full truncate max-w-[100px]">
                {note.userName}
              </span>
            )}
            {note.sharedWith && note.sharedWith.length > 0 && (
              <span title="Shared note" className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-0.5 rounded-full">
                Shared
              </span>
            )}
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 flex-grow overflow-hidden">
          {truncateContent(note.content)}
        </div>
        
        <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>Last updated: {formatDate(note.updatedAt)}</span>
          
          {note.allowCopy && (
            <span title="Can be copied as template" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
              </svg>
              Template
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;
