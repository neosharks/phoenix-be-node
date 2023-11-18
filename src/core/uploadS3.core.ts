import aws from "aws-sdk";
import crypto from "crypto";
import { promisify } from "util";
import config from "../../config";
const randomBytes = promisify(crypto.randomBytes);

const region = config.aws.region;
const bucketName = config.aws.bucketName;
const accessKeyId = config.aws.accessId;
const secretAccessKey = config.aws.accessSecret;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

export async function generateUploadURL() {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
}
