import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const NotesListCard = ({ delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px 0px" });
  
  const notesData = [
    { 
      id: 1, 
      title: 'Airport Arrival', 
      icon: '✈️', 
      date: 'Jun 15', 
      color: 'bg-blue-100 dark:bg-blue-900',
      excerpt: 'Flight AA307 arrives at Terminal 3. Remember to check baggage claim area B.',
      tags: ['Travel', 'Important']
    },
    { 
      id: 2, 
      title: 'Scheduled Meeting', 
      icon: '🗓️', 
      date: 'Jun 17', 
      color: 'bg-green-100 dark:bg-green-900',
      excerpt: 'Marketing team presentation at 2:30 PM. Prepare slides for Q2 performance review.',
      tags: ['Work', 'Meeting']
    },
    { 
      id: 3, 
      title: 'Biology Class', 
      icon: '🧬', 
      date: 'Jun 18', 
      color: 'bg-yellow-100 dark:bg-yellow-900',
      excerpt: 'Chapter 7: Cell structure and function. Remember to review mitochondria functions.',
      tags: ['Study', 'Science']
    },
  ];

  return (
    <motion.div
      ref={ref}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-[0_15px_35px_-15px_rgba(0,0,0,0.3),0_5px_20px_-5px_rgba(59,130,246,0.2)] border border-white/20 dark:border-gray-700/30 p-5 z-20 w-full max-w-lg"
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3), 0 10px 30px -5px rgba(59,130,246,0.25)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">My Notes</h3>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">+</div>
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mt-4">
        {notesData.map((note) => (
          <motion.div 
            key={note.id}
            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
            whileHover={{ x: 5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start">
              <div className={`w-10 h-10 ${note.color} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                <span className="text-base">{note.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white">{note.title}</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{note.date}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{note.excerpt}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotesListCard;
