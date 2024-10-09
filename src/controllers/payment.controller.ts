import { Request, Response } from "express";
import { Cashfree } from "cashfree-pg";
import crypto from "crypto";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { PackageService } from "../services/package.service";
import config from "../../config";
import axios from "axios";
import { PaymentService } from "../services/payment.service";
import { AssignTierAndLink } from "./package.controller";
import { ClassService } from "../services/class.service";
import { WalletService } from "../services/wallet.service";

Cashfree.XClientId = config.payment.cashfree.clientId;
Cashfree.XClientSecret = config.payment.cashfree.clientSecret;
Cashfree.XEnvironment =
  config.payment.cashfree.environment === "PRODUCTION"
    ? Cashfree.Environment.PRODUCTION
    : Cashfree.Environment.SANDBOX;

function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256");
  hash.update(uniqueId);
  const orderId = hash.digest("hex");
  return orderId.substr(0, 12);
}

class _PaymentController {
  async buyClass(req: Request, res: Response) {
    const { classId } = req.body;
    if (!classId)
      return res
        .status(errorCode.GENERIC)
        .json({ message: errorMessage.MISSING_PARAMS, info: "Provide classId" });

    const { id, firstName, lastName, username, phoneNumber, email } = res.locals.user;

    try {
      const foundClass = await ClassService.getOneClassByProps({ id: parseInt(classId, 10) });
      if (!foundClass)
        return res
          .status(errorCode.GENERIC)
          .send({ message: errorMessage.NOT_FOUND, info: "Class not found" });
      const foundPayment = await PaymentService.getOnePaymentByProps({ userId: id, classId });
      if (foundPayment)
        return res
          .status(errorCode.GENERIC)
          .send({ message: errorMessage.REDUNDANT_REQUEST, info: "Class already purchased" });
      const { price } = foundClass;
      if (!price)
        return res
          .status(errorCode.GENERIC)
          .send({ message: errorMessage.INCORRECT_DATA, info: "Price not found" });

      const order_id = await generateOrderId();
      const request = {
        order_amount: price,
        order_currency: "INR",
        order_id,
        customer_details: {
          customer_id: username,
          customer_phone: phoneNumber || "8174901463",
          customer_name: `${firstName} ${lastName}`,
          customer_email: email,
        },
      };

      let response;
      try {
        response = await Cashfree.PGCreateOrder(config.payment.cashfree.version, request);
      } catch (error) {
        console.error(error);
        return res.status(errorCode.GENERIC).send({ message: "Payment failed" });
      }

      await PaymentService.createOneClassPayment({
        userId: id,
        classId: parseInt(classId, 10),
        orderId: order_id,
        amount: price,
        currency: "INR",
      });

      return res.status(200).send({ message: successMessages.SUCCESS, data: response?.data });
    } catch (error: any) {
      console.error(error);
      return res.status(errorCode.INTERNAL_SERVER).json({ message: errorMessage.INTERNAL_SERVER });
    }
  }

  async buyPackage(req: Request, res: Response) {
    const { packageId } = req.body;
    if (!packageId) {
      return res
        .status(errorCode.GENERIC)
        .json({ message: errorMessage.MISSING_PARAMS, info: "Provide packageId" });
    }

    const user = res.locals.user;

    try {
      const foundPackage = await PackageService.getOnePackage({ id: packageId });
      if (!foundPackage) {
        return res.status(errorCode.GENERIC).send({ message: errorMessage.NOT_FOUND });
      }

      const { price } = foundPackage;
      if (price === 0) {
        await AssignTierAndLink(foundPackage, user);
        return res.status(200).send({ message: successMessages.SUCCESS });
      }

      if (!price) {
        return res.status(errorCode.GENERIC).send({ message: errorMessage.INCORRECT_DATA });
      }

      const order_id = await generateOrderId();
      const request = {
        order_amount: price,
        order_currency: "INR",
        order_id,
        customer_details: {
          customer_id: user.username,
          customer_phone: user.phoneNumber || "8174901463",
          customer_name: `${user.firstName} ${user.lastName}`,
          customer_email: user.email,
        },
      };

      let response;
      try {
        response = await Cashfree.PGCreateOrder(config.payment.cashfree.version, request);
      } catch (error) {
        console.error(error);
        return res.status(errorCode.GENERIC).send({ message: "Payment failed" });
      }
      // fix this
      await PaymentService.createOneClassPayment({
        userId: user.id,
        packageId,
        orderId: order_id,
        amount: price,
        currency: "INR",
      });

      return res.status(200).send({ message: successMessages.SUCCESS, data: response?.data });
    } catch (error: any) {
      console.error(error);
      return res.status(errorCode.INTERNAL_SERVER).json({ message: errorMessage.INTERNAL_SERVER });
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      if (!orderId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const foundPayment = await PaymentService.getOnePaymentByProps({ orderId });
      if (!foundPayment)
        return res
          .status(errorCode.NOT_FOUND)
          .json({ message: errorMessage.NOT_FOUND, info: "Payment not found" });
      const url = `${config.payment.cashfree.url}/orders/${orderId}`;
      const headers = {
        accept: "application/json",
        "x-api-version": config.payment.cashfree.version,
        "x-client-id": config.payment.cashfree.clientId,
        "x-client-secret": config.payment.cashfree.clientSecret,
      };
      const response = await axios.get(url, { headers });
      await PaymentService.updateOneByProps(
        { orderId },
        { status: response?.data?.order_status || "FAILED" },
      );
      if (response?.data?.order_status === "PAID")
        await WalletService.createOneWalletTransactions({
          receiverId: foundPayment?.class?.creatorId,
          senderId: foundPayment.userId,
          source: "PURCHASE",
          paymentId: foundPayment.id,
          amount: foundPayment.amount,
          currency: foundPayment.currency,
          cashFlow: "CREDIT",
          state: "CREDITED",
        });
      return res.status(200).json({ status: response?.data?.order_status });
    } catch (error: any) {
      console.error(error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const PaymentController = new _PaymentController();
