import { useQuery } from '@tanstack/react-query';
import { agentAPI } from '@/lib/api';
import { AgentDetailResponse } from '@/types/agent';
import { useAppSelector } from '@/store/hooks';

export const useGetAgent = (agentId: string) => {
  const token = useAppSelector((state) => state.auth.token);

  return useQuery<AgentDetailResponse, Error>({
    queryKey: ['agent', agentId],
    queryFn: () => agentAPI.getAgentById(agentId, token || ''),
    enabled: !!agentId && !!token,
  });
};
