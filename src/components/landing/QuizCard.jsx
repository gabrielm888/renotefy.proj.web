import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const QuizCard = ({ delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px 0px" });
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const quizData = {
    question: "Which organelle is known as the powerhouse of the cell?",
    answers: [
      { id: 1, text: 'Nucleus', isCorrect: false },
      { id: 2, text: 'Mitochondria', isCorrect: true },
      { id: 3, text: 'Endoplasmic Reticulum', isCorrect: false },
      { id: 4, text: 'Golgi Apparatus', isCorrect: false },
    ]
  };

  const handleSelectAnswer = (id) => {
    setSelectedAnswer(id);
  };

  return (
    <motion.div
      ref={ref}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-[0_15px_35px_-15px_rgba(0,0,0,0.25),0_5px_20px_-5px_rgba(79,70,229,0.2)] border border-white/20 dark:border-gray-700/30 p-5 transform rotate-2 w-full max-w-sm overflow-hidden"
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5, rotate: 1, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3), 0 10px 30px -5px rgba(79,70,229,0.25)" }}
    >
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm ml-3">Biology Quiz</h3>
      </div>
      
      <h4 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">
        {quizData.question}
      </h4>
      
      <div className="space-y-2">
        {quizData.answers.map((answer) => (
          <motion.button
            key={answer.id}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedAnswer === answer.id 
                ? answer.isCorrect 
                  ? 'bg-green-100/90 dark:bg-green-800/90 border border-green-300 dark:border-green-600 shadow-lg shadow-green-500/20'
                  : 'bg-red-100/90 dark:bg-red-900/90 border border-red-300 dark:border-red-700 shadow-lg shadow-red-500/20'
                : 'bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200/90 dark:hover:bg-gray-600/90 border border-gray-200 dark:border-gray-600'
            }`}
            onClick={() => handleSelectAnswer(answer.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={
              selectedAnswer === answer.id && answer.isCorrect 
                ? { 
                    y: [0, -5, 0, -5, 0],
                    transition: { duration: 0.5, delay: 0.1 }
                  } 
                : {}
            }
          >
            {answer.text}
          </motion.button>
        ))}
      </div>
      
      {selectedAnswer && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-sm mt-4 pt-3 border-t dark:border-gray-600"
        >
          {quizData.answers.find(a => a.id === selectedAnswer)?.isCorrect 
            ? "Correct! Mitochondria generate most of the cell's energy through ATP."
            : "Not quite. Mitochondria are responsible for generating the cell's energy."}
        </motion.p>
      )}
    </motion.div>
  );
};

export default QuizCard;
