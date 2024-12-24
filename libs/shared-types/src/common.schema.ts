import { z } from "zod";

const MAX_FILE_SIZE = 1000000;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
];

export const imageSchema = z
  .any()
  .refine((file) => file.size !== 0, "Image is required.")
  .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 1MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type || file.mimetype), // Multer.File only got mimetype
    "Only .jpg, .jpeg, .png and .webp files are accepted."
  );
