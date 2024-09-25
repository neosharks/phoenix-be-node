import Queue from "bull";
import sendEmail from "../core/email.core";
import logger from "../core/logger.core"; // Assuming you have a logger setup

// Queue initialization
const emailQueue = new Queue("emailQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
    // password: "Pn@96307",
  },
  defaultJobOptions: {
    attempts: 2,
    removeOnComplete: true,
  },
});

// Queue processing
emailQueue.process(async (job, done) => {
  const { receiverEmail, subject, template, variables } = job.data;
  try {
    logger.info(`Sending email to: ${receiverEmail}`);
    const emailSent = await sendEmail(receiverEmail, subject, template, variables);
    if (!emailSent) {
      throw new Error("Failed to send email");
    }
    logger.info(`Email successfully sent to: ${receiverEmail}`);
    done();
  } catch (error) {
    logger.error(`Job ID: ${job.id} - Error: ${error}`);
    done();
  }
});

export default emailQueue;
