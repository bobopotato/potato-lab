import { useQuery } from "@tanstack/react-query";
import { axiosAuth } from "../lib/axios";
import { jobWithCompanyInfoQuerySchema } from "@potato-lab/shared-types";
import { toast } from "sonner";
import { getErrorMessage } from "../utils/error.util";

export const useJobsCompanyInfoQuery = (query: {
  schedulerId?: string;
  keyword?: string;
}) => {
  const { schedulerId, keyword } = query;

  return useQuery({
    queryKey: ["jobs", schedulerId, keyword],
    queryFn: async () => {
      if (!schedulerId) return null;

      const res = await axiosAuth.get(`/job/jobs-company-info`, {
        params: query
      });
      const result = jobWithCompanyInfoQuerySchema.safeParse(res.data.data);

      if (result.error) {
        toast.error(getErrorMessage(result.error));
        throw result.error;
      }
      return result.data;
    }
  });
};
