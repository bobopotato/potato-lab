"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { User } from "@prisma/client";
import { useRouter, usePathname } from "next/navigation";
import {
  signIn as _signIn,
  getUserCookies,
  signOut as _signOut,
  forceUserSignOut
} from "./actions";
import { SignInReq } from "@potato-lab/shared-types";
import { toast } from "sonner";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";

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

  const { isPending: isLoadingSignIn, mutateAsync: signIn } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: _signIn,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: async () => {
      await initUser();
      router.push("/");
    }
  });

  const signOut = async () => {
    await _signOut();
    setUser(null);
    localStorage.removeItem("isLoggedIn");
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
