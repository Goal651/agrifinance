export interface AuthRequest {
    email: string
    password: string
}


export interface AuthResponse {
    token: string
    role:'USER'|'ADMIN'
    userId:string
}



export interface RefreshTokenRequest {
    refreshToken: string
}

export interface ForgotPasswordRequest {
    email: string
}

export interface ResetPasswordRequest {
    token: string
    password: string
    confirmPassword: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface SignupRequest {
    firstName: string
    lastName: string
    email: string
    password: string
}