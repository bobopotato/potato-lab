import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { axiosAuth } from "../lib/axios";
import { jobQuerySchema } from "@potato-lab/shared-types";
import { toast } from "sonner";
import { getErrorMessage } from "../utils/error.util";

export const useJobsQuery = (query: {
  schedulerId?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}) => {
  const { schedulerId, keyword, page, pageSize } = query;

  return useQuery({
    queryKey: ["jobs", schedulerId, keyword, page, pageSize],
    queryFn: async () => {
      if (!schedulerId) return null;

      const res = await axiosAuth.get(`/job`, { params: query });
      const result = jobQuerySchema.safeParse(res.data.data);

      if (result.error) {
        toast.error(getErrorMessage(result.error));
        throw result.error;
      }
      return result.data;
    },
    placeholderData: keepPreviousData
  });
};
