import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderEmail = async ({ to, order, downloadTokens }) => {
  try {
    let itemsList = order.items
      .map((item) => {
        const tokenObj = downloadTokens.find(
          (t) =>
            t.productId.toString() === item.productId.toString() &&
            t.variantType === item.variantType,
        );

        const downloadLink = tokenObj
          ? `${process.env.FRONTEND_URL}/api/download/${tokenObj.token}`
          : null;

        return `
        <li>
          ${item.variantType} - Qty: ${item.quantity} -  ${downloadLink ? `<a href="${downloadLink}">Download ${item.variantType}</a>` : ""}
        </li>
      `;
      })
      .join("");

    const html = `
      <h2>Thank you for your order!</h2>
      <p>Order ID: ${order._id}</p>
      <ul>${itemsList}</ul>
      <p>Total: $${order.totalAmount.toFixed(2)}</p>
      <p>This email confirms your payment has been received.</p>
    `;

    const mailOptions = {
      from: process.env.ADMIN_EMAIL || "yayitow547@juhxs.com",
      to,
      subject: `Your Order #${order._id} is confirmed`,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(" Order confirmation email sent to:", to);
  } catch (err) {
    console.error(" Failed to send order email:", err);
  }
};

export default sendOrderEmail;
