import { z } from "zod";
import { imageSchema } from "./common.schema";

export const signInReqSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const signUpReqSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(6),
  image: imageSchema
});

export const signUpReqForBackendSchema = z
  .instanceof(FormData)
  .transform((formData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const image = formData.get("image") as File;
    const obj = { email, password, name, image };

    const parseResult = signUpReqSchema.parse(obj);
    return parseResult;
  });

export const publicUserDataSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.union([z.date(), z.string().transform((d) => new Date(d))])
});

export type SignInReq = z.infer<typeof signInReqSchema>;
export type SignUpReq = z.infer<typeof signUpReqSchema>;
export type PublicUserData = z.infer<typeof publicUserDataSchema>;
