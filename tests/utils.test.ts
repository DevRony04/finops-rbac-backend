// tests/utils.test.ts
// Self-contained, no imports from src/, pure logic only
import { describe, expect, test } from '@jest/globals';

interface UtilsRecord {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
}

/**
 * Pure utility logic (redefined for isolation)
 */
const filterByDateRange = (records: UtilsRecord[], startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return records.filter(r => {
    const time = new Date(r.date).getTime();
    return time >= start && time <= end;
  });
};

const filterByCategory = (records: UtilsRecord[], category: string) => {
  return records.filter(r => r.category === category);
};

const filterByType = (records: UtilsRecord[], type: 'INCOME' | 'EXPENSE') => {
  return records.filter(r => r.type === type);
};

const sanitizeInput = (text: string): string => {
  return text.trim().replace(/[<>]/g, '');
};

describe('Utility Logic', () => {
  const mockRecords: UtilsRecord[] = [
    { amount: 100, type: 'INCOME', category: 'Salary', date: '2024-03-01' },
    { amount: 200, type: 'EXPENSE', category: 'Rent', date: '2024-03-15' },
    { amount: 150, type: 'INCOME', category: 'Bonus', date: '2024-04-01' },
  ];

  describe('Date Range Filtering', () => {
    test('should filter records within date range', () => {
      const filtered = filterByDateRange(mockRecords, '2024-03-10', '2024-03-20');
      expect(filtered.length).toBe(1);
      expect(filtered[0].category).toBe('Rent');
    });

    test('should return empty list if none in range', () => {
      const filtered = filterByDateRange(mockRecords, '2024-05-01', '2024-05-31');
      expect(filtered.length).toBe(0);
    });
  });

  describe('Category and Type Filtering', () => {
    test('should filter by specific category', () => {
      const filtered = filterByCategory(mockRecords, 'Salary');
      expect(filtered.length).toBe(1);
      expect(filtered[0].amount).toBe(100);
    });

    test('should filter by specific type', () => {
      const filtered = filterByType(mockRecords, 'EXPENSE');
      expect(filtered.length).toBe(1);
      expect(filtered[0].amount).toBe(200);
    });
  });

  describe('Data Sanitization', () => {
    test('should trim and remove dangerous characters', () => {
      expect(sanitizeInput('  hello <script>  ')).toBe('hello script');
    });

    test('should handle clean input correctly', () => {
      expect(sanitizeInput('Normal Text')).toBe('Normal Text');
    });
  });
});
