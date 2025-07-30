/**
 * Generic API response wrapper.
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message: string
  error?: string
  errors?: Record<string, string[]>
}

/**
 * API response for paginated data.
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * API error structure.
 */
export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}
