"use client";

import Link from "next/link";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  ImageUploader,
  ImageUploaderComponentRef,
  Input
} from "@potato-lab/ui";
import React, { Ref, useRef } from "react";
import CardForm from "../../../components/auth/card-form";
import { signUpReqSchema } from "@potato-lab/shared-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp as signUpApi } from "../../../utils/api.util";
import { toast } from "sonner";
import { getErrorMessage } from "../../../utils/error.util";
import { z } from "zod";
import PasswordField from "../../../components/auth/password-field";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

const schemaWithConfirmPassword = signUpReqSchema
  .extend({
    confirmPassword: signUpReqSchema.shape.password
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"]
  });

type SignUpReqWithConfirmPassword = z.infer<typeof schemaWithConfirmPassword>;

const SignUp = () => {
  const imageRef = useRef<ImageUploaderComponentRef>();

  const { isPending: loadingSignUp, mutateAsync: signUp } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: signUpApi,
    onSuccess: () => {
      form.reset();
      imageRef.current?.removeImage();
      toast.success("Sign up successful! You may proceed to sign in.", {
        action: (
          <Button variant="outline">
            <Link href="./sign-in">Sign in</Link>
          </Button>
        )
      });
    },
    onError: (error: AxiosError) => {
      toast.error("Something went wrong. Please try again.", {
        description: getErrorMessage(error)
      });
    }
  });

  const form = useForm<SignUpReqWithConfirmPassword>({
    resolver: zodResolver(schemaWithConfirmPassword),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      image: new File([""], "filename")
    }
  });

  return (
    <CardForm<SignUpReqWithConfirmPassword>
      title="Sign Up"
      description="Register a new account & start new journey!"
      onSubmit={(e) => signUp(e)}
      form={form}
      isLoading={loadingSignUp}
      previousPage="./sign-in"
      footer={
        <>
          <Button
            asChild
            variant="link"
            className="p-0"
            disabled={loadingSignUp}
          >
            <Link href="./sign-in">Have account already?</Link>
          </Button>
          <Button type="submit" isLoading={loadingSignUp}>
            Sign Up
          </Button>
        </>
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
      <PasswordField form={form} isConfirmPassword />

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-1.5">
            <FormLabel htmlFor="name">Username</FormLabel>
            <FormControl>
              <Input id="name" placeholder="johndoe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ImageUploader<SignUpReqWithConfirmPassword>
        form={form}
        ref={imageRef as Ref<ImageUploaderComponentRef>}
        imageRef="image"
        title="Profile Image (Optional)"
        className="max-h-[200px] rounded-full"
        imgCropShape="round"
      />
    </CardForm>
  );
};

export default SignUp;
