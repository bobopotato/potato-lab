"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { User } from "@potato-lab/shared-types";
import { useRouter } from "next/navigation";
import { clearUserCookies, setUserCookies } from "../../server/cookies-actions";
import { signIn as signInApi } from "../../utils/api.util";

import { SignInReq } from "@potato-lab/shared-types";
import { toast } from "sonner";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "../../utils/error.util";

type UserData = { user: Omit<User, "password">; accessToken: string };

interface AuthContext {
  userData: UserData | undefined;
  isLoggedIn: boolean;
  signIn: UseMutateFunction<void, Error, SignInReq>;
  isLoadingSignIn: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContext>({} as AuthContext);

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({
  children,
  userData
}: {
  children: React.ReactNode;
  userData?: { user: Omit<User, "password">; accessToken: string };
}) => {
  const router = useRouter();
  const [_userData, setUserData] = useState<
    { user: Omit<User, "password">; accessToken: string } | undefined
  >(userData);

  useEffect(() => {
    // force logout
    if (!_userData) {
      localStorage.removeItem("accessToken");
      // router.refresh();
      router.push("/sign-in");
    }
  }, [_userData, router]);

  const { isPending: isLoadingSignIn, mutate: signIn } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (data: SignInReq) => {
      const userData = await signInApi(data);
      await setUserCookies(userData.userData, userData.accessToken);
      setUserData({
        user: userData.userData,
        accessToken: userData.accessToken
      });
      localStorage.setItem("accessToken", userData?.accessToken);
      localStorage.setItem("isLoggedIn", "true");
      router.push("/");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Something went wrong"));
    }
  });

  const signOut = async () => {
    await clearUserCookies();
    localStorage.removeItem("isLoggedIn");
    setUserData(undefined);
  };

  const value = useMemo(
    () => ({
      userData: _userData,
      isLoggedIn: !!_userData?.user?.id,
      isLoadingSignIn,
      signIn,
      signOut
    }),
    [_userData, signIn, isLoadingSignIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
export { useAuth };
