import { useQuery } from "@tanstack/react-query";
import { axiosAuth } from "../lib/axios";
import { jobSchema } from "@potato-lab/shared-types";
import { toast } from "sonner";
import { getErrorMessage } from "../utils/error.util";

export const useFavouriteJobsQuery = (query: {
  schedulerId: string;
  page?: number;
  pageSize?: number;
}) => {
  const { schedulerId, page, pageSize } = query;
  return useQuery({
    queryKey: ["favourite-jobs", schedulerId, page, pageSize],
    queryFn: async () => {
      const res = await axiosAuth.get(`/job/favourite`, { params: query });
      const result = jobSchema.array().safeParse(res.data.data);

      if (result.error) {
        toast.error(getErrorMessage(result.error));
        throw result.error;
      }
      return result.data;
    }
  });
};
