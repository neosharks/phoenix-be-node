import { Request, Response } from "express";
import { Cashfree } from "cashfree-pg";
import crypto from "crypto";
import logger from "../core/logger.core";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { PackageService } from "../services/package.service";
import config from "../../config";
import axios from "axios";
import { PaymentService } from "../services/payment.service";

Cashfree.XClientId = config.payment.cashfree.clientId;
Cashfree.XClientSecret = config.payment.cashfree.clientSecret;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256");
  hash.update(uniqueId);
  const orderId = hash.digest("hex");
  return orderId.substr(0, 12);
}

class _PaymentController {
  async order(req: Request, res: Response) {
    const { packageId } = req.body;
    if (!packageId)
      return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
    const { id, firstName, lastName, username, phoneNumber, email } = res.locals.user;
    try {
      const foundPackage = await PackageService.getOnePackage({ id: packageId });
      if (!foundPackage)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.NOT_FOUND });
      const { price } = foundPackage;
      if (!price)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.INCORRECT_DATA });
      const order_id = await generateOrderId();
      const request = {
        order_amount: price,
        order_currency: "INR",
        order_id,
        customer_details: {
          customer_id: username,
          customer_phone: phoneNumber,
          customer_name: `${firstName} ${lastName}`,
          customer_email: email,
        },
        order_meta: {
          return_url: `${config.main.feUrl}?order_id=order_123`,
        },
      };
      let response;
      try {
        response = await Cashfree.PGCreateOrder("2023-08-01", request);
        console.log(response);
      } catch (error) {
        logger.error(error);
        return res.status(errorCode.GENERIC).send({ message: "Payment failed" });
      }
      await PaymentService.createOnePayment({ userId: id, packageId, orderId: order_id });
      return res.status(200).send({ message: successMessages.SUCCESS, data: response?.data });
    } catch (error: any) {
      logger.error(error.message);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      if (!orderId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const url = `https://sandbox.cashfree.com/pg/orders/${orderId}`;
      const headers = {
        accept: "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": config.payment.cashfree.clientId,
        "x-client-secret": config.payment.cashfree.clientSecret,
      };
      const response = await axios.get(url, { headers });
      await PaymentService.updateOneByProps(
        { orderId },
        { status: response?.data?.order_status || "FAILED" },
      );
      return res.status(200).json({ status: response?.data?.order_status });
    } catch (error: any) {
      logger.error(error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const PaymentController = new _PaymentController();
