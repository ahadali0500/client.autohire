import { useQuery } from "@tanstack/react-query";
import { agentAPI } from "@/lib/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useGetAllAgents = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return useQuery({
    queryKey: ["agents", "all"],
    queryFn: () => agentAPI.getAllAgents(token as string),
    enabled: !!token,
  });
};
