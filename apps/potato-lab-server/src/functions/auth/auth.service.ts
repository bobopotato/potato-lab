import { db } from "../../../drizzle/db";
import { encryptPassword } from "./auth.util";
import { s3UploadFile } from "../../utils/aws.util";
import { userTable } from "../../../drizzle/db/schema";
import { eq } from "drizzle-orm";
import { User } from "@potato-lab/shared-types";

export const getUserByEmail = async (
  email: string
): Promise<typeof userTable.$inferSelect | undefined> => {
  const users = await db
    .selectDistinct()
    .from(userTable)
    .where(eq(userTable.email, email));
  return users[0];
};

const _uploadProfileImage = async (
  newUser: User,
  imageBuffer?: Buffer,
  imageMimeType?: string
) => {
  try {
    if (!imageBuffer || !imageMimeType) {
      throw Error("Invalid image data");
    }

    const imageType = imageMimeType.split("/")?.at(-1);
    const profileImageUrl = await s3UploadFile(
      imageBuffer,
      `profileImages/${newUser.id}.${imageType}`
    );

    await db
      .update(userTable)
      .set({
        imageUrl: profileImageUrl
      })
      .where(eq(userTable.id, newUser.id));
  } catch (err) {
    console.log("Image Upload Error");
    console.error(err);
  }
};

export const createUser = async (
  email: string,
  password: string,
  name: string,
  imageBuffer?: Buffer,
  imageMimeType?: string
) => {
  const encryptedPassword = await encryptPassword(password);

  try {
    const newUser = (
      await db
        .insert(userTable)
        .values({
          email,
          name,
          password: encryptedPassword
        })
        .returning()
    )[0];

    await _uploadProfileImage(newUser, imageBuffer, imageMimeType);

    return newUser;
  } catch (err: unknown) {
    if ((err as Error)?.message?.includes('unique constraint "email_idx"')) {
      throw new Error("Email already exists. Please use another email");
    }
    throw err;
  }
};
