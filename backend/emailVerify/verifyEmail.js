import { Resend } from "resend";


export const verifyEmail = async(email,token) => {

  const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

  const {data, error} = await resend.emails.send({
    from: process.env.MAIL_USER,
    to: email,
    subject:"Email Verification",
     text: `Hi! There, You have recently visited our website and entered your email. Please follow and entered you email. Please follow the given link to verify your email https://electronicsitem.netlify.app/verify/${token} Thanks`
  });

  if(error){
   console.log("email resend error:", error)
  }

 console.log(data)
  
}




// ++++++++++++++++++++++  NODEMAILER  +++++++++++++++++++++++++++++++++
// import nodemailer from "nodemailer";

// //best src for this code: https://www.geeksforgeeks.org/node-js/how-to-send-email-using-node-js/
// export const verifyEmail = (email, token) => {
//             //aa fun jya call thay tya je order ma params aave chhe te j order ma ahi rakhva (email, token) ..nahi to email not send

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_PASS,
//     },
//   });

//   // Define the email options
//   const mailOptions = {
//     from: process.env.MAIL_USER,
//     to: email,
//     subject: "Email Verification",
//     text: `Hi! There, You have recently visited our website and entered your email. Please follow and entered you email. Please follow the given link to verify your email http://localhost:5173/verify/${token} Thanks`,
//   };

//   // Send the email
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) return console.log("Mail Error:", error); //return no lakho to pan chale ek linena code mate pan pachhi nicheno code banne successfuly vala pan console thay, jyare error aavi chhe tem chhata pan

//     console.log("Email sent:", info);
//     console.log("Email sent successfully!");
//   });
// };
