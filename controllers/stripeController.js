import Stripe from "stripe";
import Order from "../models/Order.model";
const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createCheckout = async (req, res) => {
  const { items } = req.body;

  const amount = items.reduce((sum, i) => sum + i.price, 0);

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    metadata: {
      items: JSON.stringify(items)
    }
  });

  res.json({ clientSecret: intent.client_secret });
};


export const stripeWebhook = async (req, res) => {
  const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers["stripe-signature"],
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;

    const items = JSON.parse(intent.metadata.items);

    const order = await Order.create({
      items,
      totalAmount: intent.amount / 100,
      paymentIntentId: intent.id,
      paymentStatus: "paid"
    });

    // 👉 HANDLE PRINT ORDERS
    items.forEach(i => {
      if (i.variantType === "print") {
        sendToLulu(order, i);
      }
    });
  }

  res.json({ received: true });
};
