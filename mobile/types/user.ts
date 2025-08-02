
/**
 * Represents a user in the system.
 */
export interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'USER' | 'ADMIN'

  status: string
  createdAt:string
}