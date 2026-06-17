export const ROLES = {
  ADMIN: 'ADMIN',
  PARTNER: 'PARTNER',
  PARENT: 'PARENT',
};

export const BACKEND_ROLE_MAP = {
  admin: ROLES.ADMIN,
  partner: ROLES.PARTNER,
  institute: ROLES.PARTNER,
  parent: ROLES.PARENT,
};

export const normalizeRole = (role) => {
  if (!role) return null;
  const upper = role.toUpperCase();
  if (Object.values(ROLES).includes(upper)) return upper;
  return BACKEND_ROLE_MAP[role.toLowerCase()] || upper;
};
