import Jimp from "jimp";
import logger from "../core/logger.core";
import { getObjectSignedUrl } from "../core/s3upload.core";

const BLUR_NUMBER = 70;

export const getBlurredImage = async (incomingImage: any) => {
  try {
    const signedUrl = await getObjectSignedUrl(incomingImage);
    const image = await Jimp.read(signedUrl);
    image.blur(BLUR_NUMBER);
    const blurredImageBase64 = await image.getBase64Async(Jimp.AUTO);
    return blurredImageBase64;
  } catch (err) {
    console.log("Error in blurring", err);
    return "";
  }
};
