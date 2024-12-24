import { z } from "zod";

export const baseApiUrl = z.string().parse(process.env.NEXT_PUBLIC_API_URL);
