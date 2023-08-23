import { text } from "express";
import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(email,subject,html,attachment) {
 
  let transporter = nodemailer.createTransport({
   service:'gmail',
    auth: {
      user: process.env.Email, // generated ethereal user
      pass: process.env.PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"saraha" < process.env.Email>', // sender address
    to: email, // list of receivers
    subject, // Subject line
    html , // html body
    attachments:attachment
  })
}