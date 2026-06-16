// hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAppSelector } from '@/store/hooks';

export const useDashboard = () => {
    const token = useAppSelector((state) => state.auth.token);

  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await axios.get("http://127.0.0.1:8002/auth/", {
        headers: {
          Authorization: `Bearer ${token}`, // replace later
        },
      });
      return res.data.result;
    },
  });
};