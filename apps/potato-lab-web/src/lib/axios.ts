import axios, { HttpStatusCode } from "axios";
import { refreshToken as refreshTokenApi } from "../utils/api.util";
import {
  forceUserSignOut,
  getUserCookies,
  updateAccessTokenCookie
} from "../components/auth/actions";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosBase = axios.create({
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

axiosBase.interceptors.response.use(async (res) => {
  // foward the cookie from server components
  if (isServerSide() && res.headers["set-cookie"]?.length) {
    const { cookies } = await import("next/headers");
    const cookieStore = cookies();
    // reset cookie
    res.headers["set-cookie"].forEach((cookie) => {
      const [nameValue, ...attributes] = cookie.split(";");
      const [name, value] = nameValue.split("=");

      if (name !== "refreshToken") {
        return;
      }

      const attributesValue = attributes.map((attr) => attr.split("=")?.[1]);
      const [maxAge, path, expires, , sameSite] = attributesValue;

      cookieStore.set(name.trim(), value.trim(), {
        maxAge: Number(maxAge),
        path: path.trim(),
        expires: new Date(expires),
        httpOnly: true,
        sameSite: sameSite?.trim()?.toLowerCase() as "lax" | "strict" | "none"
      });
    });
  }
  return res;
});

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
      error.response.status === HttpStatusCode.Forbidden &&
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

export default axiosBase;
export { axiosAuth };
