"use client";

import Link from "next/link";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator
} from "@potato-lab/ui";
import React, { useEffect } from "react";
import CardForm from "../../../components/auth/card-form";
import { useAuth } from "../../../components/auth/auth-provider";
import { SignInReq, signInReqSchema } from "@potato-lab/shared-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordField from "../../../components/auth/password-field";
import { z } from "zod";
import { toast } from "sonner";

const SignIn = () => {
  const { isLoadingSignIn, signIn } = useAuth();

  useEffect(() => {
    (async () => {
      // mimic componentDidMount
      await new Promise((resolve) => {
        resolve(true);
      });
      const isLoggedInBefore = localStorage.getItem("isLoggedIn");
      if (isLoggedInBefore) {
        localStorage.removeItem("isLoggedIn");
        toast.error("Your session has expired. Please sign in again.");
      }
    })();
  }, []);

  const schema = signInReqSchema.extend({
    password: z.string().min(1, {
      message: "Invalid password"
    })
  });

  const form = useForm<SignInReq>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  return (
    <CardForm<SignInReq>
      title="Sign in"
      description="Sign in to your account"
      onSubmit={(e) => signIn(e)}
      form={form}
      isLoading={isLoadingSignIn}
      footer={
        <div className="flex flex-col w-full gap-5">
          <div className="flex flex-row justify-between align-">
            <Button asChild variant="link" className="p-0">
              <Link href="./forgot-password">Forgot password?</Link>
            </Button>
            <Button type="submit" isLoading={isLoadingSignIn}>
              Sign in
            </Button>
          </div>
          <div className="flex flex-row items-center justify-evenly gap-5">
            <Separator
              orientation="vertical"
              className="flex-auto h-[1px] bg-gray-800"
            />
            <span className="text-gray-500">or</span>
            <Separator
              orientation="vertical"
              className="flex-auto h-[1px] bg-gray-800"
            />
          </div>
          <Button asChild variant="ghost" className="outline outline-[1px]">
            <Link href="./sign-up">Create new account</Link>
          </Button>
        </div>
      }
    >
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-1.5">
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormControl>
              <Input id="email" placeholder="johndoe@gmail.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <PasswordField form={form} />
    </CardForm>
  );
};

export default SignIn;
