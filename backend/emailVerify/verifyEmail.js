// import { Resend } from "resend";   //for this use we want to buy domain name ...without domain name its not running

// export const verifyEmail = async (email, token) => {
//   console.log("📩 verifyEmail FUNCTION CALLED");
// console.log("🔥 RAW ENV MAIL_USER:", process.env.MAIL_USER);
// console.log("🔥 TYPE:", typeof process.env.MAIL_USER);
//   const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

//   console.log("API KEY:", process.env.RESEND_EMAIL_API_KEY);

//   const { data, error } = await resend.emails.send({
//     from: process.env.MAIL_USER,
//     to: email,
//     subject: "Email Verification",
//     text: `Verify: https://electronicsitem.netlify.app/verify/${token}`,
//   });

//   if (error) {
//     console.log("❌ EMAIL ERROR:", error);
//     return;
//   }

//   console.log("✅ EMAIL SENT:", data);
// };



// ⚠️ PROBLEMS WITH NODEMAILER (REAL WORLD)  // aabdhi problem resend solve kare chhe....
// 1. Gmail restrictions          “less secure apps” allowed nahi ..... app password chahiye...kabhi kabhi block ho jata hai
// 2. Spam issue....     emails spam me chale jate hain
// 3. Scaling problem         100–200 emails ok....3000+ unreliable
// 4. No analytics ..........delivered? opened? fail? no proper tracking
// ++++++++++++++++++++++  NODEMAILER  //properly working in localhost...but some error on netligy, so above method is used for sending email  +++++++++++++++++++++++++++++++++
import nodemailer from "nodemailer";

//best src for this code: https://www.geeksforgeeks.org/node-js/how-to-send-email-using-node-js/
export const verifyEmail = (email, token) => {
            //aa fun jya call thay tya je order ma params aave chhe te j order ma ahi rakhva (email, token) ..nahi to email not send

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Define the email options
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Hi! There, You have recently visited our website and entered your email. Please follow and entered you email. Please follow the given link to verify your email http://localhost:5173/verify/${token} Thanks`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log("Mail Error:", error); //return no lakho to pan chale ek linena code mate pan pachhi nicheno code banne successfuly vala pan console thay, jyare error aavi chhe tem chhata pan

    console.log("Email sent:", info);
    console.log("Email sent successfully!");
  });
};
