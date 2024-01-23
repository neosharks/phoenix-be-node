import { Request, Response } from "express";
import prisma from "../../prisma";
import Razorpay from "razorpay";
import config from "../../config";
import crypto from "crypto";
import logger from "../core/logger.core";

class _PaymentController {
  async order(req: Request, res: Response) {
    try {
      const instance = new Razorpay({
        key_id: config.payment.razorpay.clientId,
        key_secret: config.payment.razorpay.clientSecret,
      });

      const options = {
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: crypto.randomBytes(10).toString("hex"),
      };

      instance.orders.create(options, (error: any, order: any) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Something Went Wrong!" });
        }
        logger.info("order", order);
        res.status(200).json({ data: order });
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
      console.log(error);
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", config.payment.razorpay.clientSecret)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature === expectedSign) {
        return res.status(200).json({ message: "Payment verified successfully" });
      } else {
        return res.status(400).json({ message: "Invalid signature sent!" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
      console.log(error);
    }
  }
}
export const PaymentController = new _PaymentController();
