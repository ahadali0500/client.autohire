export interface UserSchema {
  id: number;
  name: string;
  email: string;
  phone?: string;
  industry?: string;
  company_size?: string;
  website?: string;
  country?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: UserSchema;
}

export interface SuccessResponse<T> {
  success: boolean;
  message: string;
  errors?: string;
  result: T;
}

export interface ErrorResponse {
  success: boolean;
  errors?: string;
  message?: string;
}
