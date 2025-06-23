import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom hook for implementing infinite scroll functionality
 * @param {Object} options - Configuration options
 * @param {Function} options.loadMore - Function to load more items
 * @param {boolean} [options.hasMore=true] - Whether there are more items to load
 * @param {number} [options.threshold=100] - Distance from bottom of container to trigger loading
 * @ {HTMLElement} [options.scrollContainer=window] - The scrollable container element
 * @param {boolean} [options.initialLoad=false] - Whether to load items on initial mount
 * @param {boolean} [options.resetDeps=[]] - Dependencies to reset the page counter
 * @returns {Object} - Object containing ref and loading state
 */
const useInfiniteScroll = ({
  loadMore,
  hasMore = true,
  threshold = 100,
  scrollContainer = typeof window !== 'undefined' ? window : null,
  initialLoad = false,
  resetDeps = [],
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerTarget = useRef(null);
  const isMounted = useRef(true);

  // Reset page when dependencies change
  useEffect(() => {
    setPage(1);
  }, [...resetDeps]);

  // Handle loading more items
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    
    try {
      await loadMore(page);
      if (isMounted.current) {
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [hasMore, isLoading, loadMore, page]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    isMounted.current = true;
    
    const target = observerTarget.current;
    if (!target || !scrollContainer) return;
    
    const options = {
      root: scrollContainer === window ? null : scrollContainer,
      rootMargin: `0px 0px ${threshold}px 0px`,
      threshold: 0.1,
    };
    
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        handleLoadMore();
      }
    }, options);
    
    observer.observe(target);
    
    // Initial load if needed
    if (initialLoad && page === 1) {
      handleLoadMore();
    }
    
    // Clean up
    return () => {
      isMounted.current = false;
      if (target) {
        observer.unobserve(target);
      }
      observer.disconnect();
    };
  }, [handleLoadMore, hasMore, isLoading, initialLoad, page, scrollContainer, threshold]);

  return {
    observerTarget,
    isLoading,
    resetPage: () => setPage(1),
  };
};

useInfiniteScroll.propTypes = {
  loadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  threshold: PropTypes.number,
  scrollContainer: PropTypes.instanceOf(Element),
  initialLoad: PropTypes.bool,
  resetDeps: PropTypes.array,
};

export default useInfiniteScroll;
