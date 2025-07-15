// import { permissions } from "./permissions"

export type role = "super_admin" | "admin" | "employee"
export const permissions = {
    view_users: "view_users",
    manage_users: "manage_users",
    view_teams: "view_teams",
    manage_teams: "manage_teams",
    view_organizations: "view_organizations",
    manage_organizations: "manage_organizations",
    view_roles: "view_roles",
    manage_roles: "manage_roles",
    view_audit_trail: "view_audit_trail"
} as const


export type User = {
    id?: string
    email: string
    password: string
    role: role
    organizationId?: string
    permissions?: (keyof typeof permissions)[]
}

export type Organization = {
    name: string
    id: string
    users: User[]
}

export type ActivityLog = {
    action: string
    timestamp?: Date | undefined;
    id?: number
    organizationId: number
    userId: number
}

export type AuditTrail = {
    action: string
    createdAt?: Date
    userId: string
    organizationId?: string
    id?: string
}