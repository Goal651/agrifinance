
/**
 * Represents a user in the system.
 */
export interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  farmType: string
  farmSize: number
  location: string
  role: 'USER' | 'ADMIN'

  status: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
}

