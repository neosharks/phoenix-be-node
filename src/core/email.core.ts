import nodemailer from "nodemailer";
import logger from "./logger.core";

const sendEmail = async (receiverEmail: any) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.zohomail.in",
    port: 587,
    secure: false,
    auth: {
      user: "thakurzapezzy@zohomail.in",
      pass: "Dominaque$6",
    },
  });

  try {
    const info = await transporter.sendMail({
      from: "thakurzapezzy@zohomail.in",
      to: "thakursatyam9415@gmail.com",
      subject: "Hello from Nodemailer",
      text: "Hello, this is a test email from Nodemailer!",
    });
    logger.info("Success ", info);
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
};

export default sendEmail;
