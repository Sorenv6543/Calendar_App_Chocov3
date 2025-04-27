/**
 * Authentication-related interfaces
 */

import type { User } from './user'

/**
 * User credentials for login/registration
 */
export interface UserCredentials {
  /** User email address */
  email: string;

  /** User password */
  password: string;
}

/**
 * Registration data
 */
export interface RegistrationData extends UserCredentials {
  /** User's full name */
  fullName: string;
}

/**
 * Auth state
 */
export interface AuthState {
  /** Current authenticated user */
  user: User | null

  /** Authentication loading state */
  loading: boolean

  /** Authentication error */
  error: string | null
}

/**
 * Authentication service interface
 */
export interface AuthService {
  /** Login with email and password */
  login(credentials: UserCredentials): Promise<void>;

  /** Register a new user */
  register(data: RegistrationData): Promise<void>;

  /** Logout the current user */
  logout(): Promise<void>;

  /** Get the current authenticated user */
  getCurrentUser(): Promise<{ id: string; email: string } | null>;
}

export interface LoginCredentials {
  /** User's email address */
  email: string

  /** User's password */
  password: string

  /** Whether to remember the user */
  rememberMe: boolean
}

export interface RegisterData {
  /** User's email address */
  email: string

  /** User's password */
  password: string

  /** User's display name */
  displayName: string

  /** User's phone number */
  phoneNumber?: string
}

export interface PasswordResetRequest {
  /** User's email address */
  email: string
}

export interface PasswordResetData {
  /** New password */
  newPassword: string

  /** Password reset code */
  code: string
}

export interface AuthResponse {
  /** Authentication token */
  token: string

  /** Token expiration time */
  expiresIn: number

  /** Refresh token */
  refreshToken: string

  /** User data */
  user: User
}

export interface AuthError {
  /** Error code */
  code: string

  /** Error message */
  message: string

  /** Additional error details */
  details?: Record<string, unknown>
}
