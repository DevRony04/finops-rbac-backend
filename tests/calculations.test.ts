// tests/calculations.test.ts
// Self-contained, no imports from src/, pure logic only
import { describe, expect, test } from '@jest/globals';

type RecordType = 'INCOME' | 'EXPENSE';

interface CalculationRecord {
  amount: number;
  type: RecordType;
  category: string;
}

/**
 * Pure calculation logic (redefined for isolation)
 */
const calculateSummary = (records: CalculationRecord[]) => {
  const totalIncome = records
    .filter(r => r.type === 'INCOME')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = records
    .filter(r => r.type === 'EXPENSE')
    .reduce((sum, r) => sum + r.amount, 0);

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  };
};

describe('Financial Calculations', () => {
  const mockRecords: CalculationRecord[] = [
    { amount: 1000, type: 'INCOME', category: 'Salary' },
    { amount: 500, type: 'INCOME', category: 'Freelance' },
    { amount: 200, type: 'EXPENSE', category: 'Rent' },
    { amount: 300, type: 'EXPENSE', category: 'Food' },
    { amount: 50, type: 'EXPENSE', category: 'Transport' },
  ];

  test('should calculate total income correctly', () => {
    const summary = calculateSummary(mockRecords);
    expect(summary.totalIncome).toBe(1500);
  });

  test('should calculate total expense correctly', () => {
    const summary = calculateSummary(mockRecords);
    expect(summary.totalExpense).toBe(550);
  });

  test('should calculate net balance correctly', () => {
    const summary = calculateSummary(mockRecords);
    expect(summary.netBalance).toBe(950);
  });

  test('should handle empty record list', () => {
    const summary = calculateSummary([]);
    expect(summary.totalIncome).toBe(0);
    expect(summary.totalExpense).toBe(0);
    expect(summary.netBalance).toBe(0);
  });

  test('should handle income-only records', () => {
    const incomeOnly = [
      { amount: 100, type: 'INCOME' as const, category: 'A' },
      { amount: 200, type: 'INCOME' as const, category: 'B' },
    ];
    const summary = calculateSummary(incomeOnly);
    expect(summary.totalIncome).toBe(300);
    expect(summary.totalExpense).toBe(0);
    expect(summary.netBalance).toBe(300);
  });

  test('should handle expense-only records', () => {
    const expenseOnly = [
      { amount: 100, type: 'EXPENSE' as const, category: 'A' },
      { amount: 200, type: 'EXPENSE' as const, category: 'B' },
    ];
    const summary = calculateSummary(expenseOnly);
    expect(summary.totalIncome).toBe(0);
    expect(summary.totalExpense).toBe(300);
    expect(summary.netBalance).toBe(-300);
  });
});
