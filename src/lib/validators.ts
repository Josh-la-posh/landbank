// Validation helper functions
import { z } from 'zod';


export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
export const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6) });

export const validators = {
  // Email validation
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation (min 8 chars, at least one letter and one number)
  isValidPassword: (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  },

  // Phone number validation (basic US format)
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[\d\s()+-]{10,}$/;
    return phoneRegex.test(phone);
  },

  // Required field validation
  isRequired: (value: string): boolean => {
    return value.trim().length > 0;
  },

  // Number validation
  isValidNumber: (value: string | number): boolean => {
    return !isNaN(Number(value)) && Number(value) >= 0;
  },

  // Price validation
  isValidPrice: (price: number): boolean => {
    return price > 0 && price < 999999999;
  },

  // Area validation
  isValidArea: (area: number): boolean => {
    return area > 0 && area < 100000;
  },
};

// Validation error messages
export const validationMessages = {
  email: 'Please enter a valid email address',
  password: 'Password must be at least 8 characters with at least one letter and one number',
  required: 'This field is required',
  phone: 'Please enter a valid phone number',
  number: 'Please enter a valid number',
  price: 'Please enter a valid price',
  area: 'Please enter a valid area',
};

// Form validation helper
export function validateForm(
  fields: Record<string, any>,
  rules: Record<string, (value: any) => boolean>
): Record<string, string> {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((field) => {
    if (!rules[field](fields[field])) {
      errors[field] = validationMessages[field as keyof typeof validationMessages] || 'Invalid input';
    }
  });

  return errors;
}
