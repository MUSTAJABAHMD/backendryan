import stripe from "../config/stripe.js";
import crypto from "crypto";
import Order from "../models/Order.model.js";
import DownloadToken from "../models/DownloadToken.model.js";
import sendOrderEmail from "../utils/sendOrderEmail.js";
import axios from "axios";
import { createLuluPrintJob } from "../services/luluPrint.service.js"

export const stripeWebhook = async (req, res) => {
  console.log("webhook")
  const sig = req.headers["stripe-signature"];
  let event;


  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    console.log("paymentIntent", paymentIntent);
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      console.error("❌ orderId missing in metadata");
      return res.json({ received: true });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      console.error("❌ Order not found:", orderId);
      return res.json({ received: true });
    }

    if (order.paymentStatus === "paid") {
      return res.json({ received: true });
    }

    order.paymentStatus = "paid";
    order.paymentIntentId = paymentIntent.id;
    await order.save();

    // for (const item of order.items) {
    //   if (item.variantType === "ebook") {
    //     try {

    //       console.log("create lulu code")
    //       const lulu = await createLuluPrintJob({
    //         interiorPdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    //         coverPdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    //         title: "abc",
    //         pageCount: 30,
    //         shippingAddress: order.shippingAddress
    //       });

    //       item.luluJobId = lulu.luluJobId;
    //       item.fulfillmentStatus = "printing";
    //     } catch (err) {
    //       item.fulfillmentStatus = "print_failed";
    //     }
    //   }
    // }

    // await order.save();

    const downloadTokens = [];

    for (const item of order.items) {
      if (item.variantType === "ebook" || item.variantType === "audio") {
        const token = crypto.randomBytes(32).toString("hex");

        await DownloadToken.create({
          orderId: order._id,
          productId: item.productId,
           variantType: item.variantType, 
          token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });

        downloadTokens.push({
          productId: item.productId,
           variantType: item.variantType,
          token
        });
      }
    }


    await sendOrderEmail({
      to: paymentIntent.receipt_email,
      order,
      downloadTokens
    });

    console.log("Order paid + tokens generated:", order._id);

    // await axios.post()
  }

  res.json({ received: true });
};
