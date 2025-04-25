/**
 * Authentication-related interfaces
 */

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
  /** Whether the user is authenticated */
  isAuthenticated: boolean;

  /** Whether authentication is being checked */
  isLoading: boolean;

  /** User information if authenticated */
  user: {
    id: string;
    email: string;
  } | null;

  /** Error message if authentication failed */
  error: string | null;
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
