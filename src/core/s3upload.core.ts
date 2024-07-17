import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import Jimp from "jimp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import crypto from "crypto";
import config from "../../config";
import logger from "./logger.core";

const bucketName = config.aws.bucketName;
const region = config.aws.region;
const accessKeyId = config.aws.accessId;
const secretAccessKey = config.aws.accessSecret;

const storage = multer.memoryStorage();

export const uploadFileMiddleware = multer({
  storage: storage,
  fileFilter: (req, file, cb: any) => {
    const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

export const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

const s3Client = new S3Client({
  region: region as string,
  credentials: {
    accessKeyId: accessKeyId as string,
    secretAccessKey: secretAccessKey as string,
  },
});

export function uploadFile(fileBuffer: any, fileName: string, mimetype: string) {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype,
  };

  return s3Client.send(new PutObjectCommand(uploadParams));
}

export function deleteFile(fileName: string) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };
  return s3Client.send(new DeleteObjectCommand(deleteParams));
}

export async function getObjectSignedUrl(key: string) {
  if (key.includes("phoenix-test-bucket")) return key;
  const params = {
    Bucket: bucketName,
    Key: key,
  };
  const command = new GetObjectCommand(params);
  const seconds = 60;
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

  return url;
}

export async function GetUploadedFile(image: any) {
  try {
    if (!image || !image.buffer || !image.mimetype) {
      throw new Error("Invalid image data provided.");
    }
    const imageName = generateFileName();
    const jimpImage = await Jimp.read(image.buffer);
    const buffer = await jimpImage.getBufferAsync(image.mimetype);
    await uploadFile(buffer, imageName, image.mimetype);
    return imageName;
  } catch (err) {
    console.log("Error in image upload", err);
    throw err;
  }
}

export async function GetUploadedFiles(file: any) {
  try {
    if (!file || !file.buffer || !file.mimetype) {
      throw new Error("Invalid file data provided.");
    }
    const fileName = generateFileName();

    if (file.mimetype.startsWith("image/")) {
      const jimpImage = await Jimp.read(file.buffer);
      const buffer = await jimpImage.getBufferAsync(file.mimetype);
      await uploadFile(buffer, fileName, file.mimetype);
    } else {
      await uploadFile(file.buffer, fileName, file.mimetype);
    }

    return fileName;
  } catch (err) {
    console.log("Error in file upload", err);
    throw err;
  }
}
