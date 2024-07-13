const admin = require("firebase-admin");

const serviceAccount = require("../firebseNotification/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (registrationToken: Request) => {
  const messageSend = {
    token: registrationToken,
    notification: {
      title: "hellow",
      body: "world",
    },
    data: {
      key1: "value1",
      key2: "value2",
    },
    android: {
      priority: "high",
    },
    apns: {
      payload: {
        aps: {
          badge: 42,
        },
      },
    },
  };
  admin
    .message()
    .send(messageSend)
    .then((response: any) => {
      console.log("succesFully send message", response);
    })
    .catch((error: any) => {
      console.log("error send message", error);
    });
};

const registrationToken: any =
  "c9DGqMRZRo2G8tt5dlD2g5:APA91bHxUKQ8D-MNLqoxuKDVvm7u3QOwNMZh9BS92E7Cj2pDp-y5AELLscAVjlMwYJdCxfGKDn-1DrEcvGdmmHL-mjyBNzcCfP9TRvcvDl2-vHdljr8B7rUJKdYrRqdF6MfZKXvh42UK";

export default sendNotification(registrationToken);
