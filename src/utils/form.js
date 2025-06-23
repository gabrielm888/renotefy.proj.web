import { useState, useCallback } from 'react';

/**
 * Custom hook for form state management
 * @param {Object} initialValues - Initial form values
 * @param {Function} validate - Validation function
 * @param {Function} onSubmit - Submit handler
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues = {}, validate, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({}); // Track touched fields
  const [submitCount, setSubmitCount] = useState(0);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    
    // Handle different input types
    let finalValue;
    if (type === 'checkbox') {
      finalValue = checked;
    } else if (type === 'file') {
      finalValue = files[0];
    } else if (type === 'number' || type === 'range') {
      finalValue = value === '' ? '' : Number(value);
    } else {
      finalValue = value;
    }

    setValues(prevValues => ({
      ...prevValues,
      [name]: finalValue
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle blur event
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur if validate function is provided
    if (validate) {
      const fieldErrors = validate(values, { [name]: true });
      if (fieldErrors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: fieldErrors[name]
        }));
      }
    }
  }, [values, validate]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Mark all fields as touched
    const newTouched = {};
    Object.keys(values).forEach(key => {
      newTouched[key] = true;
    });
    setTouched(newTouched);
    
    // Validate form
    const formErrors = validate ? validate(values) : {};
    setErrors(formErrors);
    
    // If no errors, submit the form
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
    
    setSubmitCount(prev => prev + 1);
  }, [values, validate, onSubmit]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitCount(0);
  }, [initialValues]);

  // Set form values manually
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Set field error manually
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  // Set field touched manually
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched
    }));
  }, []);

  // Check if a field has an error and has been touched
  const getFieldError = useCallback((name) => {
    return touched[name] ? errors[name] : '';
  }, [errors, touched]);

  // Check if a field has been touched
  const isFieldTouched = useCallback((name) => {
    return !!touched[name];
  }, [touched]);

  // Check if a field has an error
  const hasError = useCallback((name) => {
    return !!errors[name];
  }, [errors]);

  // Check if the form is valid
  const isValid = useCallback(() => {
    if (!validate) return true;
    const formErrors = validate(values);
    return Object.keys(formErrors).length === 0;
  }, [values, validate]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    getFieldError,
    isFieldTouched,
    hasError,
    isValid,
  };
};

/**
 * Validates that a field is required
 * @param {string} value - The field value
 * @param {string} fieldName - The name of the field (for error message)
 * @returns {string} Error message if validation fails, otherwise empty string
 */
export const required = (value, fieldName = 'This field') => {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`;
  }
  return '';
};

/**
 * Validates that a field has a minimum length
 * @param {number} min - The minimum length
 * @returns {Function} A validation function
 */
export const minLength = (min) => (value, fieldName = 'This field') => {
  if (value && value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return '';
};

/**
 * Validates that a field has a maximum length
 * @param {number} max - The maximum length
 * @returns {Function} A validation function
 */
export const maxLength = (max) => (value, fieldName = 'This field') => {
  if (value && value.length > max) {
    return `${fieldName} must be at most ${max} characters`;
  }
  return '';
};

/**
 * Validates that a field matches a regular expression
 * @param {RegExp} regex - The regular expression to test against
 * @param {string} message - The error message to return if validation fails
 * @returns {Function} A validation function
 */
export const pattern = (regex, message) => (value, fieldName = 'This field') => {
  if (value && !regex.test(value)) {
    return message || `${fieldName} is not valid`;
  }
  return '';
};

/**
 * Validates that a field is a valid email address
 * @param {string} value - The email address to validate
 * @param {string} fieldName - The name of the field (for error message)
 * @returns {string} Error message if validation fails, otherwise empty string
 */
export const email = (value, fieldName = 'Email') => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value && !emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return '';
};

/**
 * Composes multiple validation functions into a single function
 * @param {...Function} validators - The validation functions to compose
 * @returns {Function} A single validation function that runs all validators
 */
export const composeValidators = (...validators) => (value, fieldName) => {
  return validators.reduce((error, validator) => {
    return error || validator(value, fieldName);
  }, '');
};

export default {
  useForm,
  required,
  minLength,
  maxLength,
  pattern,
  email,
  composeValidators,
};
