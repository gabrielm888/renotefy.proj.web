import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom hook for managing modal/dialog state and animations
 * @param {Object} options - Configuration options
 * @param {boolean} [options.initialOpen=false] - Whether the modal is initially open
 * @param {boolean} [options.closeOnEsc=true] - Whether to close the modal when pressing Escape
 * @param {boolean} [options.closeOnOverlayClick=true] - Whether to close when clicking outside the modal
 * @param {boolean} [options.preventBodyScroll=true] - Whether to prevent body scroll when modal is open
 * @param {Function} [options.onOpen] - Callback when modal opens
 * @param {Function} [options.onClose] - Callback when modal closes
 * @returns {Object} - Modal state and control functions
 */
const useModal = ({
  initialOpen = false,
  closeOnEsc = true,
  closeOnOverlayClick = true,
  preventBodyScroll = true,
  onOpen,
  onClose,
} = {}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isVisible, setIsVisible] = useState(initialOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);
  const lastFocusedElement = useRef(null);

  // Handle opening the modal
  const openModal = useCallback(() => {
    if (isOpen) return;
    
    // Store the currently focused element
    lastFocusedElement.current = document.activeElement;
    
    // Set states
    setIsOpen(true);
    setIsVisible(true);
    setIsAnimating(true);
    
    // Call onOpen callback
    if (onOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  // Handle closing the modal
  const closeModal = useCallback((event) => {
    if (event && event.key === 'Escape' && !closeOnEsc) {
      return;
    }
    
    if (!isOpen) return;
    
    // Start exit animation
    setIsAnimating(false);
    
    // Wait for animation to complete before hiding the modal
    const animationDuration = 300; // Should match your CSS transition duration
    
    setTimeout(() => {
      setIsVisible(false);
      setIsOpen(false);
      
      // Restore focus to the element that was focused before the modal opened
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
      
      // Call onClose callback
      if (onClose) {
        onClose();
      }
    }, animationDuration);
  }, [isOpen, closeOnEsc, onClose]);

  // Toggle modal open/close
  const toggleModal = useCallback(() => {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  }, [isOpen, openModal, closeModal]);

  // Handle click outside the modal
  const handleOverlayClick = useCallback((event) => {
    if (
      closeOnOverlayClick && 
      modalRef.current && 
      !modalRef.current.contains(event.target)
    ) {
      closeModal();
    }
  }, [closeOnOverlayClick, closeModal]);

  // Handle Escape key press
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      closeModal(event);
    }
  }, [closeModal]);

  // Effect for adding/removing event listeners
  useEffect(() => {
    if (isOpen) {
      // Add event listeners
      if (closeOnEsc) {
        document.addEventListener('keydown', handleKeyDown);
      }
      
      if (closeOnOverlayClick) {
        document.addEventListener('mousedown', handleOverlayClick);
      }
      
      // Prevent body scroll when modal is open
      if (preventBodyScroll) {
        document.body.style.overflow = 'hidden';
      }
      
      // Set focus to the modal when it opens
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOverlayClick);
      
      // Re-enable body scroll when modal closes
      if (preventBodyScroll) {
        document.body.style.overflow = '';
      }
    };
  }, [
    isOpen, 
    closeOnEsc, 
    closeOnOverlayClick, 
    preventBodyScroll, 
    handleKeyDown, 
    handleOverlayClick
  ]);

  // Handle animation end
  const handleAnimationEnd = useCallback(() => {
    setIsAnimating(false);
  }, []);

  return {
    isOpen,
    isVisible,
    isAnimating,
    modalRef,
    openModal,
    closeModal,
    toggleModal,
    handleAnimationEnd,
    getModalProps: () => ({
      ref: modalRef,
      role: 'dialog',
      'aria-modal': true,
      'aria-hidden': !isOpen,
      tabIndex: -1,
      onAnimationEnd: handleAnimationEnd,
    }),
    getOverlayProps: () => ({
      onClick: handleOverlayClick,
      style: {
        display: isVisible ? 'block' : 'none',
      },
    }),
  };
};

useModal.propTypes = {
  initialOpen: PropTypes.bool,
  closeOnEsc: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  preventBodyScroll: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

export default useModal;
