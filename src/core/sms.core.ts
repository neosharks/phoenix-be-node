import axios from "axios";
import config from "../../config";

async function sendOtpSms(phoneNumber: string, otp: number) {
  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        variables_values: otp,
        route: "dlt",
        numbers: phoneNumber,
        message: `Your otp: ${otp}`,
        sender_id: "AX-QKROTP",
      },
      {
        headers: {
          authorization: config.sms.fast2sms.key,
        },
      },
    );
    console.log(response.data);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default sendOtpSms;
