import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import logger from "./logger.core";
import config from "../../config";

const extractTemplate = (template: string) => {
  switch (template) {
    case "SIGNUP":
      return "signup.mail.html";
    case "FORGET_PASSWORD":
      return "forgetPassword.mail.html";
    case "APPLY_CREATOR":
      return "applyForCreator.mail.html";
    case "APPROVE_CREATOR":
      return "approvalForCreator.mail.html";
    default:
      return "default.mail.html";
  }
};

const sendEmail = async (
  receiverEmail: string,
  subject: string,
  template: string,
  variables: object = {},
): Promise<boolean> => {
  try {
    const mailTransport: nodemailer.Transporter = nodemailer.createTransport({
      host: config.nodemailer.host,
      port: config.nodemailer.port,
      secure: true, // Ensure secure configuration matches your provider's recommendation
      connectionTimeout: 5000,
      auth: {
        user: config.nodemailer.email,
        pass: config.nodemailer.password,
      },
    } as nodemailer.TransportOptions);

    const templatePath = path.join(__dirname, `../mailTemplates/${extractTemplate(template)}`);
    logger.info(`Reading email template from ${templatePath}`);
    console.log(templatePath, "emailSent42");
    let foundTemplate = await fs.readFile(templatePath, "utf8");

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      foundTemplate = foundTemplate.replace(regex, value as string);
    }

    const mailOptions = {
      from: `admin@qalakar.com`,
      to: receiverEmail,
      subject: subject,
      html: foundTemplate,
    };
    console.info(`Sending email to ${receiverEmail} with subject ${subject}`);
    await mailTransport.sendMail(mailOptions);
    logger.info(`Email sent to ${receiverEmail}`);
    return true;
  } catch (err) {
    console.error("Failed to send email", err);
    return false;
  }
};

export default sendEmail;
