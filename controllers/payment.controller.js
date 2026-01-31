import stripe from "../config/stripe.js";
import Order from "../models/Order.model.js";

export const createPaymentIntent = async (req, res) => {
console.log("payment intent")

  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    console.log("order payment int", order)
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // cents
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
      },
      receipt_email: order.shippingAddress.email
      
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment intent failed" });
  }
};
