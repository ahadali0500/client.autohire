import axios from "axios";
import {
  SignupRequest,
  LoginRequest,
  SuccessResponse,
  LoginResponse,
} from "@/types/auth";
import {
  AgentDetailResponse,
  AllAgentsResponse,
  AgentSummary,
} from "@/types/agent";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAPI = {
  signup: async (data: SignupRequest): Promise<SuccessResponse<unknown>> => {
    const response = await apiClient.post("/auth/signup", data);
    return response.data;
  },
  login: async (
    data: LoginRequest,
  ): Promise<SuccessResponse<LoginResponse>> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },
  saveGoogleCredentials: async (
    data: GoogleClientCredentialsRequest,
    token: string,
  ): Promise<SuccessResponse<unknown>> => {
    const response = await apiClient.post("/auth/google/credentials", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  connectGoogle: async (
    data: GoogleConnectRequest,
    token: string,
  ): Promise<SuccessResponse<GoogleConnectResponse>> => {
    const response = await apiClient.post("/auth/google/connect", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  getGoogleStatus: async (
    token: string,
  ): Promise<SuccessResponse<GoogleIntegrationStatusResponse>> => {
    const response = await apiClient.get("/auth/google/status", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  disconnectGoogle: async (
    token: string,
  ): Promise<SuccessResponse<GoogleDisconnectResponse>> => {
    const response = await apiClient.delete("/auth/google/disconnect", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export type GoogleClientCredentialsRequest = {
  client_id: string;
  client_secret: string;
};

export type GoogleConnectRequest = {
  redirect_uri: string;
  frontend_redirect_url?: string | null;
};

export type GoogleConnectResponse = {
  authorization_url?: string;
};

export type GoogleIntegrationStatusResponse = {
  connected?: boolean;
  status?:
    | "not_configured"
    | "missing_client_credentials"
    | "credentials_saved_not_connected"
    | "connected";
  email?: string | null;
  client_id_exists?: boolean;
  client_secret_exists?: boolean;
  google_user_token_exists?: boolean;
  has_client_credentials?: boolean;
};

export type GoogleDisconnectResponse = {
  disconnected: boolean;
};

export type CreateAgentPayload = Record<string, unknown>;

export type CreateAgentResponse = SuccessResponse<AgentSummary>;

export const agentAPI = {
  getAgentById: async (
    agentId: string,
    token: string,
  ): Promise<AgentDetailResponse> => {
    const response = await apiClient.get(`/agent/${agentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  getAllAgents: async (token: string): Promise<AllAgentsResponse> => {
    const response = await apiClient.get("/agent/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export const getPresignedUrl = async (
  file_name: string,
  content_type: string,
  token: string,
) => {
  const response = await apiClient.post(
    "/home/presigned-url",
    { file_name, content_type },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data.result;
};

export const uploadToS3 = async (url: string, file: File) => {
  await axios.put(url, file, {
    headers: { "Content-Type": file.type },
  });
};

export const createAgent = async (
  data: CreateAgentPayload,
  token: string,
): Promise<CreateAgentResponse> => {
  const response = await apiClient.post("/agent/create", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
