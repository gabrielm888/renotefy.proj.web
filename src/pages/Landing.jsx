import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import AppPreviewCards from './AppPreviewCards';
import HeroButtons from '../components/HeroButtons';

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    // Function to handle scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        document.querySelector('nav')?.classList.add('bg-opacity-90');
      } else {
        document.querySelector('nav')?.classList.remove('bg-opacity-90');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Make content visible after a small delay for animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Features section data
  const features = [
    {
      title: 'Fast Learning, All Digital',
      description: 'Transform how you learn with our intuitive digital workspace that makes capturing and retaining information effortless',
      icon: (
        <motion.div
          initial="hidden"
          whileHover="visible"
          animate="visible"
          className="scale-110 hover:scale-125 transition-transform duration-300"
        >
          <motion.svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <motion.path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              variants={{
                hidden: { pathLength: 0.8 },
                visible: {
                  pathLength: 1,
                  transition: {
                    duration: 0.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }
              }}
            />
            <motion.path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5}
              d="M12 6.253v13" 
              variants={{
                hidden: { pathLength: 0.5, opacity: 0.7 },
                visible: {
                  pathLength: 1,
                  opacity: 1,
                  transition: {
                    duration: 0.6,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }
              }}
            />
          </motion.svg>
        </motion.div>
      )
    },
    {
      title: 'Your Notes, Secured Privately',
      description: 'Rest easy knowing your intellectual property is protected with top-tier encryption and security measures',
      icon: (
        <motion.div
          initial="hidden"
          whileHover="visible"
          animate="visible"
          className="scale-110 hover:scale-125 transition-transform duration-300"
        >
          <motion.svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              variants={{
                hidden: { opacity: 1 },
                visible: {
                  opacity: 1,
                  transition: { duration: 0.2 }
                }
              }}
            />
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4"
              variants={{
                hidden: { pathLength: 1, y: 0 },
                visible: {
                  pathLength: 1,
                  y: -2,
                  transition: {
                    y: {
                      duration: 0.3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }
                  }
                }
              }}
            />
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 12a1 1 0 100-2 1 1 0 000 2z"
              variants={{
                hidden: { scale: 1 },
                visible: {
                  scale: 1.2,
                  fill: "#3b82f6",
                  transition: {
                    duration: 0.3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }
              }}
            />
          </motion.svg>
        </motion.div>
      )
    },
    {
      title: 'Every AI Feature, All in One',
      description: 'Unlock your productivity with seamlessly integrated AI tools that summarize, organize, and enhance your notes automatically',
      icon: (
        <motion.div
          initial="hidden"
          whileHover="visible"
          animate="visible"
          className="scale-110 hover:scale-125 transition-transform duration-300"
        >
          <motion.svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <motion.path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              variants={{
                hidden: { pathLength: 1 },
                visible: {
                  pathLength: 1,
                  transition: { duration: 0.2 }
                }
              }}
            />
            <motion.circle
              cx="12"
              cy="8.5"
              r="2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              variants={{
                hidden: { scale: 1 },
                visible: {
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }
              }}
            />
            <motion.path 
              d="M8 11h8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              variants={{
                hidden: { pathLength: 0, opacity: 0.2 },
                visible: {
                  pathLength: 1,
                  opacity: 1,
                  transition: {
                    pathLength: {
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }
                  }
                }
              }}
            />
          </motion.svg>
        </motion.div>
      )
    },
    {
      title: 'Collaboration at Your Fingertips',
      description: 'Share and co-edit notes in real-time with colleagues and classmates, making teamwork smooth and efficient',
      icon: (
        <motion.div
          initial="hidden"
          whileHover="visible"
          animate="visible"
          className="scale-110 hover:scale-125 transition-transform duration-300"
        >
          <motion.svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <motion.path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
              variants={{
                hidden: { pathLength: 1 },
                visible: {
                  pathLength: 1,
                }
              }}
            />
            <motion.circle 
              cx="12" 
              cy="7" 
              r="3" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="none"
              variants={{
                hidden: { scale: 1 },
                visible: {
                  scale: [1, 1.1, 1],
                  transition: {
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }
              }}
            />
            <motion.circle 
              cx="19" 
              cy="10" 
              r="2" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="none"
              variants={{
                hidden: { x: 0 },
                visible: {
                  x: [-1, 1, -1],
                  transition: {
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2
                  }
                }
              }}
            />
            <motion.circle 
              cx="5" 
              cy="10" 
              r="2" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="none"
              variants={{
                hidden: { x: 0 },
                visible: {
                  x: [1, -1, 1],
                  transition: {
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2
                  }
                }
              }}
            />
          </motion.svg>
        </motion.div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-gray-900 to-black text-white font-[SF-Pro-Display,system-ui,sans-serif] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-opacity-50 backdrop-blur-md bg-gray-900/60 border-b border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400 italic tracking-wide" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.5px' }}>
                renotefy
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link to="/register">
                  <motion.span 
                    className="text-sm text-gray-300 hover:text-white cursor-pointer px-5 py-1.5 relative overflow-hidden group"
                    initial={{}}
                    animate={{
                      textShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 2px rgba(255,255,255,0.2)', '0 0 0px rgba(255,255,255,0)'],
                      transition: {
                        textShadow: {
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeInOut"
                        }
                      }
                    }}
                    whileHover={{ 
                      color: '#ffffff', 
                      scale: 1.05, 
                      textShadow: '0 0 8px rgba(59, 130, 246, 0.5)' 
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 600, damping: 10 }}
                  >
                    <motion.span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-pink-400 group-hover:w-full" 
                      transition={{ duration: 0.3 }}
                    />
                    Sign Up
                  </motion.span>
                </Link>
                <Link to="/login">
                  <motion.span 
                    className="text-sm bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full border border-white/5 relative overflow-hidden"
                    initial={{}}
                    animate={{
                      boxShadow: ['0 0 0px rgba(59, 130, 246, 0)', '0 0 8px rgba(59, 130, 246, 0.2)', '0 0 0px rgba(59, 130, 246, 0)'],
                      transition: {
                        boxShadow: {
                          repeat: Infinity,
                          duration: 2.5,
                          ease: "easeInOut"
                        }
                      }
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: "rgba(255,255,255,0.15)", 
                      borderColor: "rgba(255,255,255,0.4)",
                      boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 600, damping: 10 }}
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
                  </motion.span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div ref={heroRef} className="relative pt-28 pb-16 md:pt-36 md:pb-24 flex flex-col items-center justify-center px-4">
        {/* Subtle background accent */}
        <div className="absolute top-24 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-48 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full filter blur-3xl"></div>
        
        <motion.div 
          className="text-center max-w-4xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Making your notes{' '}
            <span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              smarter
            </span>
            <br />with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>renotefy</span>
          </h1>
          <p className="text-base md:text-xl mt-6 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your personal space for notes, ideas, and everything in between.
          </p>
          <HeroButtons />
        </motion.div>

        {/* App Preview Cards */}
        <div className="mt-20 pb-10 relative z-10">
          <AppPreviewCards isVisible={isVisible} />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-b from-slate-900 via-gray-900 to-gray-950 relative">
        {/* Accent background elements */}
        <div className="absolute top-40 left-20 w-48 h-48 bg-blue-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-64 h-64 bg-pink-600/10 rounded-full filter blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">Why choose Renotefy?</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Streamline your note-taking experience with these powerful features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.5 + (index * 0.1) }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.25)",
                  borderColor: "rgba(255,255,255,0.2)", 
                  backgroundColor: "rgba(17, 24, 39, 0.65)",
                  transition: { duration: 0.2 } 
                }}
              >
                <div className="text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="py-16 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">Ready to upgrade your note-taking?</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400 font-medium">thousands</span> of users who are already enhancing their productivity with Renotefy
            </p>
            <div className="mt-10">
              <Link to="/register">
                <motion.button 
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-lg shadow-lg shadow-blue-500/20 relative overflow-hidden"
                  initial={{scale: 1}}
                  animate={{
                    boxShadow: ["0 10px 15px -3px rgba(59, 130, 246, 0.3)", "0 15px 20px -3px rgba(59, 130, 246, 0.4)", "0 10px 15px -3px rgba(59, 130, 246, 0.3)"],
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
                    boxShadow: "0 20px 30px -5px rgba(59, 130, 246, 0.55)",
                    transition: { 
                      duration: 0.2, 
                      ease: "easeOut" 
                    } 
                  }}
                  whileTap={{ 
                    scale: 0.97,
                    boxShadow: "0 5px 15px -5px rgba(59, 130, 246, 0.4)"
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
                  <span className="relative z-10">Get Started Now</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Renotefy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
