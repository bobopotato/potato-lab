import { s3Client } from "../infra/aws.infra";
import { Upload, Progress } from "@aws-sdk/lib-storage";

export const s3UploadFile = async (file: File | Buffer, path: string) => {
  const parallelUploadS3 = new Upload({
    client: s3Client,
    params: {
      Bucket: "potato-lab-bucket",
      Key: path, // desired path to directory
      Body: file
    }
  });

  parallelUploadS3.on("httpUploadProgress", (progress: Progress) => {
    console.log("Uploading file into S3 bucket. Progress :", progress);
  });

  try {
    const { Location: path } = await parallelUploadS3.done();
    console.log("File uploaded into S3 bucket successfully", path);
    return path;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
