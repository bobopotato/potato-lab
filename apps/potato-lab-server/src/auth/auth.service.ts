import prisma from "../infra/prisma.infra";
import { Prisma, User } from "@prisma/client";
import { encryptPassword } from "./auth.util";
import { s3UploadFile } from "../utils/aws.util";

export const getUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  console.log(process.env.DATABASE_URL);
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  return user;
};

export const createUser = async (
  email: string,
  password: string,
  name: string,
  imageBuffer: Buffer,
  imageMimeType: string
) => {
  const encryptedPassword = await encryptPassword(password);

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password: encryptedPassword,
        name
      }
    });

    try {
      const imageType = imageMimeType.split("/")?.at(-1);
      const profileImageUrl = await s3UploadFile(
        imageBuffer,
        `profileImages/${newUser.id}.${imageType}`
      );

      await prisma.user.update({
        where: {
          id: newUser.id
        },
        data: {
          imageUrl: profileImageUrl
        }
      });
    } catch (err) {
      console.log("Image Upload Error");
      console.error(err);
    }

    return newUser;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code == "P2002"
    ) {
      throw new Error("Email already exists. Please use another email");
    }
    throw err;
  }
};
