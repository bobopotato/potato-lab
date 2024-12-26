import axios, { HttpStatusCode } from "axios";
import { refreshToken as refreshTokenApi } from "../utils/api.util";
import {
  forceUserSignOut,
  getUserCookies,
  updateAccessTokenCookie
} from "../server/cookies-actions";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

const isServerSide = () => typeof window === "undefined";

axiosAuth.interceptors.request.use(async (config) => {
  let accessToken;

  if (isServerSide()) {
    const { data } = await getUserCookies();
    accessToken = data?.accessToken;
  } else {
    accessToken = localStorage.getItem("accessToken");
  }

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosAuth.interceptors.response.use(
  async (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === HttpStatusCode.Forbidden &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const accessToken = await refreshTokenApi();
        await updateAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosAuth(originalRequest);
      } catch {
        await forceUserSignOut();
        window.location.reload();
        return;
      }
    }
    return Promise.reject(error);
  }
);

const updateAccessToken = async (accessToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  await updateAccessTokenCookie(accessToken);
};

export { axiosAuth };
