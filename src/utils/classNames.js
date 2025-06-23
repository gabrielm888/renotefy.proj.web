/**
 * Combines class names with conditional logic
 * @param {...(string|Object|Array<string|Object>)} classes - Class names to combine
 * @returns {string} Combined class names string
 */
function classNames(...classes) {
  return classes
    .flat()
    .filter(Boolean)
    .map((item) => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item !== null) {
        return Object.entries(item)
          .filter(([key, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
}

export default classNames;
