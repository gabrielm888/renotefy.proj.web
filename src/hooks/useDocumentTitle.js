import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom hook to update document title and meta description
 * @param {string} title - The page title to set
 * @param {Object} [options] - Additional options
 * @param {string} [options.prefix] - Optional prefix for the title
 * @param {string} [options.suffix] - Optional suffix for the title
 * @param {string} [options.description] - Optional meta description
 * @param {boolean} [options.includeAppName=true] - Whether to include the app name in the title
 * @param {string} [options.appName='Renotefy'] - The app name to include in the title
 */
const useDocumentTitle = (title, options = {}) => {
  const {
    prefix = '',
    suffix = '',
    description = '',
    includeAppName = true,
    appName = 'Renotefy',
  } = options;

  const prevTitleRef = useRef(document.title);
  const prevDescriptionRef = useRef(
    document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  );

  useEffect(() => {
    // Store the original title and description to restore them on unmount
    const originalTitle = document.title;
    const originalMetaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    
    // Update the title
    const newTitle = [
      prefix,
      title,
      includeAppName ? appName : null,
      suffix,
    ]
      .filter(Boolean)
      .join(' | ');

    document.title = newTitle;
    
    // Update the meta description if provided
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      
      metaDescription.content = description;
    }

    // Restore the original title and description on unmount
    return () => {
      document.title = originalTitle;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.content = originalMetaDescription;
      }
    };
  }, [title, prefix, suffix, description, includeAppName, appName]);

  // No need to return anything, this hook only handles side effects
  return null;
};

useDocumentTitle.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.shape({
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    description: PropTypes.string,
    includeAppName: PropTypes.bool,
    appName: PropTypes.string,
  }),
};

export default useDocumentTitle;
