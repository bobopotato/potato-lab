import { AxiosError } from "axios";

export const getErrorMessage = (
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again."
) => {
  if (error instanceof AxiosError) {
    return String(error.response?.data?.message) || fallbackMessage;
  }
  return fallbackMessage;
};
