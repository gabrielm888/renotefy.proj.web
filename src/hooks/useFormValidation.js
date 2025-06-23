import { useState, useCallback } from 'react';
import * as Yup from 'yup';

/**
 * Custom hook for form validation using Yup
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationSchema - Yup validation schema
 * @param {Function} onSubmit - Form submission handler
 * @returns {Object} - Form state and handlers
 */
const useFormValidation = (initialValues, validationSchema, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Validate form fields
  const validateForm = useCallback(async () => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      
      if (validationErrors.inner) {
        validationErrors.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
      } else {
        console.error('Validation error:', validationErrors);
      }
      
      setErrors(newErrors);
      return false;
    }
  }, [values, validationSchema]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: newValue,
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  }, [errors]);

  // Handle blur event
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    // Mark field as touched
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true,
    }));
    
    // Validate the field that lost focus
    validateField(name);
  }, [validateField]);

  // Validate a single field
  const validateField = useCallback(async (fieldName) => {
    try {
      await Yup.reach(validationSchema, fieldName).validate(values[fieldName]);
      
      setErrors(prevErrors => ({
        ...prevErrors,
        [fieldName]: undefined,
      }));
      
      return true;
    } catch (error) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [fieldName]: error.message,
      }));
      
      return false;
    }
  }, [validationSchema, values]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    setSubmitCount(prevCount => prevCount + 1);
    
    // Mark all fields as touched
    const newTouched = {};
    Object.keys(values).forEach(key => {
      newTouched[key] = true;
    });
    setTouched(newTouched);
    
    // Validate the entire form
    const isValid = await validateForm();
    
    if (isValid) {
      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateForm, onSubmit]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitCount(0);
  }, [initialValues]);

  // Set field value manually
  const setFieldValue = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);

  // Set field touched manually
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: isTouched,
    }));
  }, []);

  // Get field error
  const getFieldError = useCallback((name) => {
    return touched[name] ? errors[name] : undefined;
  }, [errors, touched]);

  // Check if field has been touched
  const isFieldTouched = useCallback((name) => {
    return !!touched[name];
  }, [touched]);

  // Check if field has an error
  const hasError = useCallback((name) => {
    return !!errors[name];
  }, [errors]);

  // Check if the form is valid
  const isValid = useCallback(async () => {
    return await validateForm();
  }, [validateForm]);

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
    setFieldTouched,
    getFieldError,
    isFieldTouched,
    hasError,
    isValid,
    validateField,
    validateForm,
  };
};

export default useFormValidation;
