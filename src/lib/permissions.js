// Role-based access control utilities

export const ROLES = {
  FREE: 'Free',
  STUDENT: 'Student', 
  TEACHER: 'Teacher',
  ADMIN: 'Admin'
}

export const canAccessCourses = (role) => {
  return role === ROLES.STUDENT || role === ROLES.TEACHER || role === ROLES.ADMIN
}

export const canAccessCommunity = (role) => {
  return role === ROLES.STUDENT || role === ROLES.TEACHER || role === ROLES.ADMIN
}

export const canAccessAnalytics = (role) => {
  return role === ROLES.STUDENT || role === ROLES.TEACHER || role === ROLES.ADMIN
}

export const canCreateContent = (role) => {
  return role === ROLES.TEACHER || role === ROLES.ADMIN
}

export const isAdmin = (role) => {
  return role === ROLES.ADMIN
}

export const isTeacher = (role) => {
  return role === ROLES.TEACHER || role === ROLES.ADMIN
}

export const isStudent = (role) => {
  return role === ROLES.STUDENT
}

export const isFree = (role) => {
  return role === ROLES.FREE
}

export const hasActiveSubscription = (role) => {
  return role === ROLES.STUDENT || role === ROLES.TEACHER || role === ROLES.ADMIN
}

export const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.FREE]: 'Free User',
    [ROLES.STUDENT]: 'Student',
    [ROLES.TEACHER]: 'Teacher',
    [ROLES.ADMIN]: 'Administrator'
  }
  return roleNames[role] || 'Unknown'
}

export const getRoleBadgeVariant = (role) => {
  const variants = {
    [ROLES.FREE]: 'secondary',
    [ROLES.STUDENT]: 'default',
    [ROLES.TEACHER]: 'default',
    [ROLES.ADMIN]: 'destructive'
  }
  return variants[role] || 'secondary'
}

export const getUpgradeMessage = (currentRole, requiredRole) => {
  const messages = {
    [ROLES.FREE]: {
      [ROLES.STUDENT]: 'Upgrade to Student to access courses and community features',
      [ROLES.TEACHER]: 'Upgrade to Teacher to create content and access advanced features',
      [ROLES.ADMIN]: 'Admin access is granted by invitation only'
    },
    [ROLES.STUDENT]: {
      [ROLES.TEACHER]: 'Upgrade to Teacher to create content and access advanced features',
      [ROLES.ADMIN]: 'Admin access is granted by invitation only'
    },
    [ROLES.TEACHER]: {
      [ROLES.ADMIN]: 'Admin access is granted by invitation only'
    }
  }
  
  return messages[currentRole]?.[requiredRole] || 'Access denied'
}
