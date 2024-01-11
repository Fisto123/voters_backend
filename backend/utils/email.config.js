import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "iwillmichofat@gmail.com",
    pass: "chfygbtazihukgrx",
  },
});

export const sendActivationEmail = (
  email,
  activationCode,
  firstname,
  lastname,
  message
) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      sendMail(email, activationCode, firstname, lastname, message),
      (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info.response);
        }
      }
    );
  });
};

const sendMail = (email, activationCode, firstname, lastname, message) => {
  let mailMessage = "";
  if (message === "activation") {
    mailMessage = `<p style="font-size: 16px;">To activate your account, please click on the link below and enter your activation code ${activationCode}:</p>`;
  } else if (message === "forgot password") {
    mailMessage = `<p style="font-size: 16px;">please follow this link and enter your desired password</p>`;
  }
  const mailOptions = {
    from: "michofatKonsult@gmail.com",
    to: email,
    subject: `Welcome to the eVoting Platform - ${message} Code ${activationCode}`,
    html: `
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
        <h2 style="color: #4CAF50;">Welcome to the eVoting Platform!</h2>
        <p style="font-size: 16px;">Dear ${firstname} ${lastname},</p>
                ${mailMessage} 
       <p style="font-size: 16px;">To activate your account, please click on the link below and enter your ${message} code ${activationCode}:</p>
        <p style="font-size: 18px; background-color: #4CAF50; padding: 10px; color: #fff;">
          <a href="http://localhost:300" style="color: #fff; text-decoration: none;">Visit link</a>
        </p>
        <p style="font-size: 16px;">If you have any questions or need assistance, feel free to contact us.</p>
        <p style="font-size: 16px;">Best regards,</p>
        <p style="font-size: 16px; font-weight: bold; color: #4CAF50;">The eVoting Team</p>
      </div>
    `,
  };

  return mailOptions;
};
