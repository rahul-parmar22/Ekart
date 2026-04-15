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

               // 🔥 IMPORTANT: verify connection first (debugging)
    await transporter.verify();
    console.log("SMTP Connected Successfully");
            
  // Define the email options
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Hi! There, You have recently visited our website and entered your email. Please follow and entered you email. Please follow the given link to verify your email https://electronicsitem.netlify.app/verify/${token} Thanks`,
  };

  // Send the email  //old code
 // transporter.sendMail(mailOptions, (error, info) => {
   // if (error) return console.log("Mail Error:", error); //return no lakho to pan chale ek linena code mate pan pachhi nicheno code banne successfuly vala pan console thay, jyare error aavi chhe tem chhata pan
       //new code
              const info = await transporter.sendMail(mailOptions);
            
    console.log("Email sent:", info);
    console.log("Email sent successfully!");
  });
};
