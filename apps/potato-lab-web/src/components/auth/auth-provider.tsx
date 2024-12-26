"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { User } from "@potato-lab/shared-types";
import { useRouter } from "next/navigation";
import {
  getUserCookies,
  clearUserCookies,
  setUserCookies
} from "../../server/cookies-actions";
import { signIn as signInApi } from "../../utils/api.util";

import { SignInReq } from "@potato-lab/shared-types";
import { toast } from "sonner";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "../../utils/error.util";

interface AuthContext {
  error: string | null;
  user: Omit<User, "password"> | null;
  isLoggedIn: boolean;
  signIn: UseMutateFunction<void, Error, SignInReq>;
  isLoadingSignIn: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContext>({} as AuthContext);

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);

  const isLoggedIn = useMemo(() => !!user?.id, [user]);

  useEffect(() => {
    if (!user) {
      initUser();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("accessToken");
      router.refresh();
    }
  }, [user, router]);

  const initUser = async () => {
    const result = await getUserCookies();

    if (result.error || !result.data) {
      setUser(null);
      router.refresh();
      return;
    }

    const { accessToken, user } = result.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("isLoggedIn", "true");
    setUser(user);
  };

  const { isPending: isLoadingSignIn, mutate: signIn } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (data: SignInReq) => {
      const { userData, accessToken } = await signInApi(data);
      await setUserCookies(userData, accessToken);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Something went wrong"));
    },
    onSuccess: async () => {
      await initUser();
      router.push("/");
    }
  });

  const signOut = async () => {
    await clearUserCookies();
    localStorage.removeItem("isLoggedIn");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        error: "aa",
        user,
        isLoggedIn,
        signIn,
        isLoadingSignIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { useAuth };
