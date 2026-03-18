import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';
import { SignupRequest } from '@/types/auth';

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupRequest) => authAPI.signup(data),
    onError: (error) => {
      console.error('Signup error:', error);
    },
    onSuccess: (data) => {
      console.log('Signup successful:', data);
    },
  });
};
