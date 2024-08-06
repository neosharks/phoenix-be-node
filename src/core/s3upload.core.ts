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

const bucketName = config.aws.bucketName;
const region = config.aws.region;
const accessKeyId = config.aws.accessId;
const secretAccessKey = config.aws.accessSecret;

const storage = multer.memoryStorage();

export const uploadFileMiddleware = multer({ storage: storage });

export const uploadAllFileMiddleware = multer({ storage: storage }).fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "document", maxCount: 1 },
]);

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
  const seconds = 180;
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

export async function GetUploadedVideo(video: any) {
  try {
    if (!video || !video.buffer || !video.mimetype) {
      throw new Error("Invalid video file provided or unsupported format.");
    }
    const videoName = generateFileName();
    await uploadFile(video.buffer, videoName, video.mimetype);
    return videoName;
  } catch (err) {
    console.log("Error in video upload", err);
    throw err;
  }
}

export async function GetUploadedDocument(document: any) {
  try {
    if (!document || !document.buffer || !document.mimetype) {
      throw new Error("Invalid document data provided.");
    }
    const documentName = generateFileName();
    await uploadFile(document.buffer, documentName, document.mimetype);
    return documentName;
  } catch (err) {
    console.log("Error in document upload", err);
    throw err;
  }
}
