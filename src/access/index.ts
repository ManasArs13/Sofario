import type { Access, FieldAccess } from 'payload'

type Role = 'admin' | 'manager'

const hasRole = (user: unknown, role: Role): boolean =>
  Boolean(user && typeof user === 'object' && (user as { role?: Role }).role === role)

export const anyone: Access = () => true

export const loggedIn: Access = ({ req: { user } }) => Boolean(user)

export const isAdmin: Access = ({ req: { user } }) => hasRole(user, 'admin')

export const isAdminField: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin')

// Админ видит всех пользователей, менеджер — только себя
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasRole(user, 'admin')) return true
  return { id: { equals: user.id } }
}

// Опубликованное — всем, черновики — только сотрудникам
export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
