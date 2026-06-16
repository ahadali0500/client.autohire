import axios from 'axios';
import { SignupRequest, LoginRequest, SuccessResponse, LoginResponse } from '@/types/auth';
import { AgentDetailResponse, AllAgentsResponse } from '@/types/agent';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

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

export const agentAPI = {
  getAgentById: async (agentId: string, token: string): Promise<AgentDetailResponse> => {
    const response = await apiClient.get(`/agent/${agentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  getAllAgents: async (token: string): Promise<AllAgentsResponse> => {
    const response = await apiClient.get('/agent/all', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export const getPresignedUrl = async (file_name: string, content_type: string, token: string) => {
    const response = await apiClient.post('/home/presigned-url', { file_name, content_type }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.result;
};

export const uploadToS3 = async (url: string, file: File) => {
    await axios.put(url, file, {
        headers: { 'Content-Type': file.type }
    });
};

export const createAgent = async (data: any, token: string) => {
    const response = await apiClient.post('/agent/create', data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
