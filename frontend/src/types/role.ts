import type { PermissionListItem } from './permission'

export interface Role {
  id: string
  name: string
  category: string
  description: string
  expand?: { permission: PermissionListItem }
}

export interface RoleListItem {
  id: string
  name: string
  category: string
}
