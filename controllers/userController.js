import User from "../models/user.js";
import sendMail from "../utils/sendMail.js";

export const contactForm = async (req, res) => {

  console.log("run")
  try {
    const { FirstName, LastName, Email, Message } = req.body;

    // save to DB
    const resData = await User.create({
      FirstName,
      LastName,
      Email,
      Message,
    });

    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Form Submission",
      html: `
        <h3>New Message</h3>
        <p><strong>Name:</strong> ${FirstName} ${LastName}</p>
        <p><strong>Email:</strong> ${Email}</p>
        <p><strong>Message:</strong></p>
        <p>${Message}</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: resData,
    });
  } catch (error) {
    console.error("contact creating error", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
