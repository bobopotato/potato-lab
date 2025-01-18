import { useQuery } from "@tanstack/react-query";
import { axiosAuth } from "../lib/axios";
import { selectSchedulerSchema } from "@potato-lab/shared-types";
import { toast } from "sonner";
import { getErrorMessage } from "../utils/error.util";

export const useJobsScrapperQuery = () => {
  return useQuery({
    queryKey: ["jobs-scrapper"],
    queryFn: async () => {
      const res = await axiosAuth.get("/scheduler");
      const result = selectSchedulerSchema.array().safeParse(res.data.data);

      if (result.error) {
        toast.error(getErrorMessage(result.error));
        throw result.error;
      }
      return result.data;
    }
  });
};
