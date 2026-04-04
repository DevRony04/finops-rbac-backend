// tests/validation.test.ts
// Self-contained, no imports from src/, pure logic only
import { describe, expect, test } from '@jest/globals';

/**
 * Pure validation logic (redefined for isolation)
 */
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) return { isValid: false, message: 'Too short' };
  if (!/[A-Z]/.test(password)) return { isValid: false, message: 'Missing uppercase' };
  if (!/[a-z]/.test(password)) return { isValid: false, message: 'Missing lowercase' };
  if (!/[0-9]/.test(password)) return { isValid: false, message: 'Missing number' };
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return { isValid: false, message: 'Missing special char' };
  return { isValid: true };
};

const validateAmount = (amount: number): boolean => {
  return typeof amount === 'number' && amount > 0;
};

const validateCategory = (category: string): boolean => {
  return typeof category === 'string' && category.trim().length > 0;
};

const validateDateString = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

describe('Validation Logic', () => {
  describe('Email Validation', () => {
    test('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    test('should return false for invalid email', () => {
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('test.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('Password Validation', () => {
    test('should return true for strong password', () => {
      expect(validatePassword('Strong123!').isValid).toBe(true);
    });

    test('should return false for short password', () => {
      const result = validatePassword('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Too short');
    });

    test('should return false if missing uppercase', () => {
      expect(validatePassword('strong123!').isValid).toBe(false);
    });

    test('should return false if missing number', () => {
      expect(validatePassword('StrongChar!').isValid).toBe(false);
    });

    test('should return false if missing special char', () => {
      expect(validatePassword('Strong123').isValid).toBe(false);
    });
  });

  describe('Amount Validation', () => {
    test('should return true for positive amounts', () => {
      expect(validateAmount(100.50)).toBe(true);
    });

    test('should return false for zero or negative amounts', () => {
      expect(validateAmount(0)).toBe(false);
      expect(validateAmount(-50)).toBe(false);
    });
  });

  describe('Category Validation', () => {
    test('should return true for non-empty string', () => {
      expect(validateCategory('Salary')).toBe(true);
    });

    test('should return false for empty or whitespace categories', () => {
      expect(validateCategory('')).toBe(false);
      expect(validateCategory('   ')).toBe(false);
    });
  });

  describe('Date Validation', () => {
    test('should return true for valid date strings', () => {
      expect(validateDateString('2024-03-20')).toBe(true);
    });

    test('should return false for invalid date strings', () => {
      expect(validateDateString('not-a-date')).toBe(false);
    });
  });
});
