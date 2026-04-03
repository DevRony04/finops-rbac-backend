export const ROLES = {
  VIEWER: 'VIEWER',
  ANALYST: 'ANALYST',
  ADMIN: 'ADMIN',
} as const;

// Define permissions (Hierarchy: ADMIN > ANALYST > VIEWER)
export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 3,
  [ROLES.ANALYST]: 2,
  [ROLES.VIEWER]: 1,
};
