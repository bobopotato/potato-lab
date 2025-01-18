import { z, ZodType } from "zod";

export const booleanSchema = z
  .union([z.boolean(), z.literal("true"), z.literal("false")])
  .transform((value) => {
    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }

    return !!value;
  });

export const paginationResponseSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPage: z.number()
});

const MAX_FILE_SIZE = 1000000;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
];

export const getImageSchema = (isOptional = false) => {
  return z.any().superRefine((file, ctx) => {
    if (file.size !== 0) {
      // continue next step
      if (file.size > MAX_FILE_SIZE) {
        console.log(file.size);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Max file size is ${MAX_FILE_SIZE / 1000000}MB.`,
          fatal: true
        });
        return z.NEVER;
      }

      // Multer.File only got mimetype
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type || file.mimetype)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Only ${ACCEPTED_IMAGE_TYPES.map(
            (type) => type.split("/")[1]
          ).join(",")} files are accepted.`,
          fatal: true
        });
        return z.NEVER;
      }

      return z.NEVER;
    }

    if (isOptional) {
      // skip whole check
      return z.NEVER;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Image is required.",
      fatal: true
    });
    return z.NEVER;
  });
};

export const uniqueArray = (schema: ZodType, isOptional = false) => {
  if (isOptional) {
    return z
      .array(schema)
      .optional()
      .refine((items) => new Set(items).size === items?.length, {
        message: "All items must be unique, no duplicate values allowed"
      });
  }

  return z
    .array(schema)
    .nonempty()
    .refine((items) => new Set(items).size === items.length, {
      message: "All items must be unique, no duplicate values allowed"
    });
};
