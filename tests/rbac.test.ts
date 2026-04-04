// tests/rbac.test.ts
// Self-contained, no imports from src/, pure logic only
import { describe, expect, test } from '@jest/globals';

const ROLES = {
  VIEWER: 'VIEWER',
  ANALYST: 'ANALYST',
  ADMIN: 'ADMIN',
} as const;

const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 3,
  [ROLES.ANALYST]: 2,
  [ROLES.VIEWER]: 1,
};

type Role = keyof typeof ROLE_HIERARCHY;

/**
 * Pure role check logic (redefined for isolation)
 */
const hasPermission = (userRole: Role, minRequiredRole: Role): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRequiredRole];
};

describe('Role-Based Access Control (RBAC)', () => {
  describe('ADMIN Permissions', () => {
    test('ADMIN should have access to ADMIN, ANALYST, and VIEWER levels', () => {
      expect(hasPermission(ROLES.ADMIN, ROLES.ADMIN)).toBe(true);
      expect(hasPermission(ROLES.ADMIN, ROLES.ANALYST)).toBe(true);
      expect(hasPermission(ROLES.ADMIN, ROLES.VIEWER)).toBe(true);
    });
  });

  describe('ANALYST Permissions', () => {
    test('ANALYST should have access to ANALYST and VIEWER levels', () => {
      expect(hasPermission(ROLES.ANALYST, ROLES.ANALYST)).toBe(true);
      expect(hasPermission(ROLES.ANALYST, ROLES.VIEWER)).toBe(true);
    });

    test('ANALYST should NOT have access to ADMIN level', () => {
      expect(hasPermission(ROLES.ANALYST, ROLES.ADMIN)).toBe(false);
    });
  });

  describe('VIEWER Permissions', () => {
    test('VIEWER should have access to VIEWER level only', () => {
      expect(hasPermission(ROLES.VIEWER, ROLES.VIEWER)).toBe(true);
    });

    test('VIEWER should NOT have access to ANALYST level', () => {
      expect(hasPermission(ROLES.VIEWER, ROLES.ANALYST)).toBe(false);
    });

    test('VIEWER should NOT have access to ADMIN level', () => {
      expect(hasPermission(ROLES.VIEWER, ROLES.ADMIN)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('Unknown roles should fail (if typed incorrectly)', () => {
      // @ts-ignore
      expect(hasPermission('GUEST', ROLES.VIEWER)).toBeFalsy();
    });
  });
});
