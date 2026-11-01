// hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAppSelector } from '@/store/hooks';
import { API_BASE_URL } from '@/lib/api';

export const useDashboard = () => {
    const token = useAppSelector((state) => state.auth.token);

  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/auth/`, {
        headers: {
          Authorization: `Bearer ${token}`, // replace later
        },
      });
      return res.data.result;
    },
  });
};