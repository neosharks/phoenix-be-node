import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import logger from "./logger.core";
import config from "../../config";

const extractTemplate = (template: string) => {
  switch (template) {
    case "SIGNUP":
      return "signup.mail.ejs";
    case "FORGET_PASSWORD":
      return "forgetPassword.mail.ejs";
    default:
      return "default.mail.ejs";
  }
};

const sendEmail = async (
  receiverEmail: any,
  subject: string,
  template: string,
  variables: object,
): Promise<boolean> => {
  try {
    const mailTransport: nodemailer.Transporter = nodemailer.createTransport({
      host: config.nodemailer.host,
      port: config.nodemailer.port,
      secure: true,
      connectionTimeout: 5000,
      auth: {
        user: config.nodemailer.email,
        pass: config.nodemailer.password,
      },
    } as nodemailer.TransportOptions);

    const templatePath = path.join(__dirname, `../mailTemplates/${extractTemplate(template)}`);

    const foundTemplate = await ejs.renderFile(templatePath, variables);

    const mailOptions = {
      from: `admin@qalakar.com`,
      to: receiverEmail,
      subject: subject,
      html: foundTemplate,
    };
    logger.info(`Sending email to ${receiverEmail}`);
    await mailTransport.sendMail(mailOptions);
    logger.info(`Email sent to ${receiverEmail}`);
    return true;
  } catch (err) {
    console.log("Failed to send email", err);
    return false;
  }
};

export default sendEmail;
