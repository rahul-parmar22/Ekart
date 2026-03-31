import nodemailer from "nodemailer";

//best src for this code: https://www.geeksforgeeks.org/node-js/how-to-send-email-using-node-js/
export const sendOTPMail = (otp, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });


  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Password Reset OTP",
      html:`<p>Your OTP for password reset is:<b>${otp}</b></p>`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log("Mail Error:", error); 

    console.log("OTP sent:", info);
    console.log("OTP sent successfully!");
  });
};
