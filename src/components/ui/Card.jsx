import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  padding = 'p-6',
  ...props
}) => {
  return (
    <motion.div
      className={`
        rounded-2xl backdrop-blur-lg border border-white/20 dark:border-dark-700/30
        bg-white/80 dark:bg-dark-800/70 shadow-lg overflow-hidden
        transition-all duration-300 ease-out
        ${hoverEffect ? 'hover:shadow-xl hover:-translate-y-0.5' : ''}
        ${glow ? 'relative after:absolute after:inset-0 after:rounded-2xl after:p-px after:bg-gradient-to-r after:from-primary-500/30 after:to-secondary-500/30 after:-z-10' : ''}
        ${padding} ${className}
      `}
      whileHover={hoverEffect ? { y: -2 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`border-b border-white/10 dark:border-dark-700/50 pb-4 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`mt-1 text-sm text-gray-600 dark:text-gray-400 ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`mt-6 pt-4 border-t border-white/10 dark:border-dark-700/50 ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
