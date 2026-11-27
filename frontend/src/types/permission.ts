export interface Permission {
  id: string
  slug: string
  name: string
  description?: string
}

export interface PermissionListItem {
  slug: string
  name: string
}
