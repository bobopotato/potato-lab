"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { publicUserDataSchema, PublicUserData } from "@potato-lab/shared-types";

export const getUserCookies = async (): Promise<{
  data?: { user: PublicUserData; accessToken: string };
  error?: string;
}> => {
  const cookieStore = cookies();
  const user = JSON.parse(cookieStore.get("user")?.value || "{}");
  const accessToken = cookieStore.get("accessToken")?.value;

  const schema = z.object({
    user: publicUserDataSchema,
    accessToken: z.string()
  });

  const result = schema.safeParse({ user, accessToken });

  if (!result.success) {
    return { error: "User session is expired. Please sign in again" };
  }

  return result;
};

export const setUserCookies = async (
  userData: PublicUserData,
  accessToken: string
) => {
  const cookieStore = cookies();
  cookieStore.set("user", JSON.stringify(userData), {
    expires: new Date(8640000000000000)
  });
  cookieStore.set("accessToken", accessToken, {
    expires: new Date(8640000000000000)
  });
};

export const clearUserCookies = async () => {
  const cookieStore = cookies();
  cookieStore.delete("user");
  cookieStore.delete("accessToken");
};

export const updateAccessTokenCookie = async (accessToken: string) => {
  const cookieStore = cookies();
  cookieStore.set("accessToken", accessToken);
};

export const forceUserSignOut = async () => {
  const cookieStore = cookies();
  cookieStore.delete("user");
  cookieStore.delete("accessToken");
};
