import { motion } from 'framer-motion';

// Fade in animation
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

// Slide up animation
export const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    y: 20, 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

// Scale in animation
export const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    scale: 0.95, 
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

// Stagger children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Fade in with slide up for list items
export const listItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// Hover animation for buttons and cards
export const hoverScale = {
  scale: 1.03,
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const tapScale = {
  scale: 0.98,
  transition: { duration: 0.1, ease: 'easeInOut' },
};

// Animated container component
export const AnimatedContainer = ({ children, className, ...props }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={fadeIn}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Animated page wrapper component
export const AnimatedPage = ({ children, className, ...props }) => (
  <motion.main
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className={className}
    {...props}
  >
    {children}
  </motion.main>
);

// Animated list component
export const AnimatedList = ({ children, className, ...props }) => (
  <motion.ul
    variants={staggerContainer}
    initial="hidden"
    animate="visible"
    className={className}
    {...props}
  >
    {children}
  </motion.ul>
);

// Animated list item component
export const AnimatedListItem = ({ children, className, ...props }) => (
  <motion.li
    variants={listItem}
    whileHover={hoverScale}
    whileTap={tapScale}
    className={className}
    {...props}
  >
    {children}
  </motion.li>
);

// Animated button component
export const AnimatedButton = ({ children, className, ...props }) => (
  <motion.button
    whileHover={hoverScale}
    whileTap={tapScale}
    className={className}
    {...props}
  >
    {children}
  </motion.button>
);

export default {
  fadeIn,
  slideUp,
  scaleIn,
  staggerContainer,
  listItem,
  hoverScale,
  tapScale,
  AnimatedContainer,
  AnimatedPage,
  AnimatedList,
  AnimatedListItem,
  AnimatedButton,
};
