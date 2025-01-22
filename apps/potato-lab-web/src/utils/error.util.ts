import { AxiosError } from "axios";

export const getErrorMessage = (
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again."
) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message
      ? String(error.response.data.message)
      : fallbackMessage;
  }
  return fallbackMessage;
};
