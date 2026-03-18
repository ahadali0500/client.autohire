import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';
import { LoginRequest } from '@/types/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onError: (error) => {
      console.error('Login error:', error);
    },
    onSuccess: (data) => {
      console.log('Login successful:', data);
    },
  });
};