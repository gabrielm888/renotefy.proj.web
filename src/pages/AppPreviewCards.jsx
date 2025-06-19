import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import QuizCard from '../components/landing/QuizCard';
import NotesListCard from '../components/landing/NotesListCard';
import NoteCard from '../components/landing/NoteCard';

const AppPreviewCards = ({ isVisible }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-200px 0px" });
  
  // Add scroll animation effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["-0.2 1", "1.1 1"]
  });
  
  // Create different scroll values for each card for parallax effect
  const y1 = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const y2 = useTransform(scrollYProgress, [0, 1], [150, 0]);
  const y3 = useTransform(scrollYProgress, [0, 1], [200, 0]);
  
  return (
    <div ref={containerRef} className="relative">
      {/* Enhanced Background gradient - stronger blue-to-pink */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/40 via-indigo-600/30 to-pink-500/40 blur-3xl rounded-3xl -z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 0.9, scale: 1.5 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />
      
      <div className="max-w-6xl mx-auto py-10">
        <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8">
          {/* Quiz Card - Takes up 4 columns with Y-animation */}
          <motion.div 
            className="col-span-12 md:col-span-4 flex justify-center"
            style={{ y: y1 }}
          >
            <QuizCard delay={0.1} />
          </motion.div>
          
          {/* Notes List Card - Takes up 5 columns with Y-animation */}
          <motion.div 
            className="col-span-12 md:col-span-5 flex justify-center mt-10 md:mt-0"
            style={{ y: y2 }}
          >
            <NotesListCard delay={0.3} />
          </motion.div>
          
          {/* Literature Note Card - Takes up 3 columns with Y-animation */}
          <motion.div 
            className="col-span-12 md:col-span-3 flex justify-center mt-10 md:mt-20"
            style={{ y: y3 }}
          >
            <NoteCard delay={0.5} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AppPreviewCards;
