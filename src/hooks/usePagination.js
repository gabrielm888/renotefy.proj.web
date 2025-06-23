import { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom hook for handling pagination logic
 * @param {Object} options - Pagination options
 * @param {number} options.totalItems - Total number of items
 * @param {number} [options.initialPage=1] - Initial page number (1-based)
 * @param {number} [options.pageSize=10] - Number of items per page
 * @param {boolean} [options.autoResetPage=false] - Whether to reset to page 1 when totalItems changes
 * @returns {Object} - Pagination state and controls
 */
const usePagination = ({
  totalItems,
  initialPage = 1,
  pageSize = 10,
  autoResetPage = false,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  // Reset to first page if totalItems changes and autoResetPage is true
  useEffect(() => {
    if (autoResetPage) {
      setCurrentPage(1);
    }
  }, [totalItems, autoResetPage]);
  
  // Calculate the range of items for the current page
  const paginationRange = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    
    return {
      start: startIndex,
      end: endIndex,
      size: endIndex - startIndex,
    };
  }, [currentPage, pageSize, totalItems]);
  
  // Navigate to a specific page
  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
    return pageNumber;
  }, [totalPages]);
  
  // Go to the next page
  const nextPage = useCallback(() => {
    return goToPage(currentPage + 1);
  }, [currentPage, goToPage]);
  
  // Go to the previous page
  const prevPage = useCallback(() => {
    return goToPage(currentPage - 1);
  }, [currentPage, goToPage]);
  
  // Go to the first page
  const firstPage = useCallback(() => {
    return goToPage(1);
  }, [goToPage]);
  
  // Go to the last page
  const lastPage = useCallback(() => {
    return goToPage(totalPages);
  }, [goToPage, totalPages]);
  
  // Check if there's a next page
  const hasNextPage = currentPage < totalPages;
  
  // Check if there's a previous page
  const hasPrevPage = currentPage > 1;
  
  // Generate an array of page numbers to display in the pagination controls
  const getPageNumbers = useCallback(({ maxButtons = 5 } = {}) => {
    const buttons = [];
    const maxLeft = Math.floor((maxButtons - 1) / 2);
    const maxRight = Math.ceil((maxButtons - 1) / 2);
    
    let startPage = Math.max(1, currentPage - maxLeft);
    let endPage = Math.min(totalPages, currentPage + maxRight);
    
    // Adjust if we're near the start or end
    if (currentPage - maxLeft < 1) {
      endPage = Math.min(totalPages, endPage + (maxLeft - currentPage + 1));
    }
    
    if (currentPage + maxRight > totalPages) {
      startPage = Math.max(1, startPage - (currentPage + maxRight - totalPages));
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      buttons.push(1);
      if (startPage > 2) {
        buttons.push('...');
      }
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }
    
    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push('...');
      }
      buttons.push(totalPages);
    }
    
    return buttons;
  }, [currentPage, totalPages]);
  
  // Get the current page items from an array
  const getCurrentPageItems = useCallback((items) => {
    if (!Array.isArray(items)) return [];
    return items.slice(paginationRange.start, paginationRange.end);
  }, [paginationRange]);
  
  return {
    // State
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage,
    hasPrevPage,
    
    // Navigation methods
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    
    // Utility methods
    getPageNumbers,
    getCurrentPageItems,
    
    // Range info
    startIndex: paginationRange.start,
    endIndex: paginationRange.end,
    itemCount: paginationRange.size,
  };
};

usePagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number,
  autoResetPage: PropTypes.bool,
};

export default usePagination;
