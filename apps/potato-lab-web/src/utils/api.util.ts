import axios from "../lib/axios";
import { SignInReq, SignUpReq } from "@potato-lab/shared-types";

export const signUp = async (data: SignUpReq) => {
  await axios.post("/auth/sign-up", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const signIn = async (data: SignInReq) => {
  const res = await axios.post("/auth/sign-in", data, {
    withCredentials: true
  });
  return res.data.data;
};

export const setCookie = async () => {
  const res = await axios.get("/auth/set-cookie", {
    withCredentials: true
  });
  console.dir(res);
  return;
};

export const refreshToken = async () => {
  const res = await axios.post(
    "/auth/refreshToken",
    {},
    {
      withCredentials: true
    }
  );
  const { data: newAccessToken } = res.data;
  return newAccessToken;
};
