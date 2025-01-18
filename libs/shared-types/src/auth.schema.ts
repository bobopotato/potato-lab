import { z } from "zod";
import { getImageSchema } from "./common.schema";

export const signInReqSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const signUpReqSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(6),
  image: getImageSchema(true)
});

export const publicUserDataSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.union([z.date(), z.string().transform((d) => new Date(d))]),
  updatedAt: z.union([z.date(), z.string().transform((d) => new Date(d))])
});

export type SignInReq = z.infer<typeof signInReqSchema>;
export type SignUpReq = z.infer<typeof signUpReqSchema>;
export type PublicUserData = z.infer<typeof publicUserDataSchema>;
