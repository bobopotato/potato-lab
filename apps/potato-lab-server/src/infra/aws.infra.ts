import { S3Client } from "@aws-sdk/client-s3";

export const AWS_REGION = "ap-southeast-1";

export const s3Client = new S3Client({
  region: AWS_REGION
});
