import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroButtons = () => {
  return (
    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
      <Link to="/register">
        <motion.button 
          className="px-8 py-3.5 rounded-full bg-[#4F84F1] text-white font-medium text-base w-full sm:w-auto shadow-md relative overflow-hidden"
          initial={{scale: 1}}
          animate={{
            boxShadow: ["0 0 12px rgba(79, 130, 246, 0.25)", "0 0 15px rgba(79, 130, 246, 0.35)", "0 0 12px rgba(79, 130, 246, 0.25)"],
            transition: {
              boxShadow: {
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
                repeatType: "reverse"
              }
            }
          }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 0 20px rgba(79, 130, 246, 0.5)",
            transition: { 
              duration: 0.2, 
              ease: "easeOut" 
            } 
          }}
          whileTap={{ 
            scale: 0.97,
            boxShadow: "0 5px 15px rgba(59, 130, 246, 0.4)"
          }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 12
          }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/20 to-blue-500/0"
            animate={{
              x: ["-100%", "100%"],
              transition: {
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.5
              }
            }}
          />
          <span className="relative z-10">Get Started</span>
        </motion.button>
      </Link>
      <Link to="/login">
        <motion.button 
          className="px-8 py-3.5 rounded-full bg-slate-800/60 backdrop-blur-sm text-white font-medium text-base border border-white/5 w-full sm:w-auto mt-3 sm:mt-0 relative overflow-hidden"
          initial={{scale: 1}}
          animate={{
            borderColor: ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"],
            boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 10px rgba(255,255,255,0.1)", "0 0 0px rgba(255,255,255,0)"],
            transition: {
              borderColor: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              },
              boxShadow: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }
            }
          }}
          whileHover={{ 
            scale: 1.05, 
            backgroundColor: "rgba(255,255,255,0.15)", 
            borderColor: "rgba(255,255,255,0.3)",
            boxShadow: "0 0 15px rgba(255, 255, 255, 0.15)",
            transition: { 
              duration: 0.2, 
              ease: "easeOut" 
            } 
          }}
          whileTap={{ 
            scale: 0.97
          }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 12 
          }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ["-100%", "100%"],
              transition: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 1
              }
            }}
          />
          <span className="relative z-10">Login</span>
        </motion.button>
      </Link>
    </div>
  )
}

export default HeroButtons;
