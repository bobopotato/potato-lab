import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown, fallbackMessage?: string) => {
  if (error instanceof AxiosError) {
    return String(error.response?.data?.message) || fallbackMessage;
  }
  return fallbackMessage;
};
