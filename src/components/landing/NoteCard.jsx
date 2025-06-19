import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const NoteCard = ({ delay }) => {
  const [text, setText] = useState('');
  const fullText = 'The gentle rustle of leaves in the breeze created a soothing melody as sunlight filtered through the canopy above. In that moment, time seemed to stand still.';
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px 0px" });
  
  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        if (text.length < fullText.length) {
          setText(fullText.substring(0, text.length + 1));
        }
      }, 70);
      return () => clearTimeout(timeout);
    }
  }, [text, isInView]);

  return (
    <motion.div
      ref={ref}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-[0_15px_35px_-15px_rgba(0,0,0,0.25),0_5px_20px_-5px_rgba(219,39,119,0.2)] border border-white/20 dark:border-gray-700/30 p-5 transform -rotate-3 z-10 w-full max-w-md"
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5, rotate: -2, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3), 0 10px 30px -5px rgba(219,39,119,0.25)" }}
    >
      <div className="flex items-center mb-3">
        <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm ml-3">Literature Notes</h3>
      </div>
      <div className="prose prose-sm dark:prose-invert mt-2">
        <p>{text}<span className="animate-pulse">|</span></p>
      </div>
    </motion.div>
  );
};

export default NoteCard;
