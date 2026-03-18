import axios from 'axios';
import { SignupRequest, LoginRequest, SuccessResponse, LoginResponse } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  signup: async (data: SignupRequest): Promise<SuccessResponse<any>> => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },
  login: async (data: LoginRequest): Promise<SuccessResponse<LoginResponse>> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
};
