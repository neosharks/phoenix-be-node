"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const serviceAccount = require("../firebseNotification/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const sendNotification = (registrationToken) => __awaiter(void 0, void 0, void 0, function* () {
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
        .then((response) => {
        console.log("succesFully send message", response);
    })
        .catch((error) => {
        console.log("error send message", error);
    });
});
const registrationToken = "c9DGqMRZRo2G8tt5dlD2g5:APA91bHxUKQ8D-MNLqoxuKDVvm7u3QOwNMZh9BS92E7Cj2pDp-y5AELLscAVjlMwYJdCxfGKDn-1DrEcvGdmmHL-mjyBNzcCfP9TRvcvDl2-vHdljr8B7rUJKdYrRqdF6MfZKXvh42UK";
exports.default = sendNotification(registrationToken);
