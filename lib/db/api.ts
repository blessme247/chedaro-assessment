
// export type role = 'admin' | 'user' | 'manager' | 'viewer'

import { AuditTrail, role, User  } from "./data.types"
// import { permissions } from "./permissions"

// export const permissions = {
//   read: 'read',
//   write: 'write',
//   delete: 'delete',
//   admin: 'admin'
// } as const

// export type User = {
//   id?: string
//   email: string
//   password: string
//   role: role
//   organization_id?: number
//   permissions: (keyof typeof permissions)[]
// }

 const permissions = {
    view_users: "view_users",
    manage_users: "manage_users",
    view_teams: "view_teams",
    manage_teams: "manage_teams",
    view_organizations: "view_organizations",
    manage_organizations: "manage_organizations",
    view_roles: "view_roles",
    manage_roles: "manage_roles",
    view_audit_trail: "view_audit_trail"
} 

export type Organization = {
  id?: string
  name: string
  members?: User[]
}

const API_BASE = '/api'

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}

// Organization API functions
export const organizationApi = {
  getAll: () => apiRequest<{ organizations: Organization[] }>('/organizations'),
  
  getById: (id: string) => apiRequest<{ organization: Organization }>(`/organizations/${id}`),
  
  getMembers: (id: string) => apiRequest<{ users: User[] }>(`/organizations/${id}/members`),
  
  create: (orgData: Omit<Organization, 'id'>) =>
    apiRequest<{ organization: Organization }>('/organizations', {
      method: 'POST',
      body: JSON.stringify(orgData),
    }),
}

// User API functions
export const userApi = {
  getAll: () => apiRequest<{ users: User[] }>('/users'),
  
  getUserById: (id: string) => apiRequest<{ user: User }>(`/users/${id}`),
  getUserByEmail: (email: string) => apiRequest<{ user: User }>(`/users/${email}`),

  
  getByOrganization: (organizationId: string) =>
    apiRequest(`/organizations/${organizationId}/users`),
  
  create: (userData: any) =>
    apiRequest<{ user: User }>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  update: (id: string, userData: Partial<User>) =>
    apiRequest<{ user: User }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  delete: (id: string) =>
    apiRequest<{}>(`/users/${id}`, {
      method: 'DELETE',
    }),
}

// auth endpoint 
export const authApi = {
  login: (data: {email: string, password: string})=> 
     apiRequest<{ user: any }>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Audit endpoints 
export const auditTrailApi = {
   getAll: () => apiRequest<{ trails: AuditTrail[] }>('/audit-trails'),
   create: (trailData: AuditTrail) =>
    apiRequest<{ trails: AuditTrail }>('/audit-trails', {
      method: 'POST',
      body: JSON.stringify(trailData),
    }),
   getByOrganization: (organizationId: string) =>
    apiRequest<{ users: User[] }>(`/organizations/${organizationId}/users`),
}



// Helper functions
export const userHelpers = {
  getUsersByRole: (users: User[], role: role): User[] =>
    users.filter(user => user.role === role),
  
  getUsersWithPermission: (users: User[], permission: keyof typeof permissions): User[] =>
    users.filter(user => Array.isArray(user.permissions) && user.permissions.includes(permission)),
  
  getAdmins: (users: User[]): User[] =>
    users.filter(user => user.role === 'admin'),
}