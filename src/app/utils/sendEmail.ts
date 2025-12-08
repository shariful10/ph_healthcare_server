import config from "../config";
import nodemailer from "nodemailer";

export const sendEmail = async (to: string, resetPassLink?: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.sendEmail.app_user,
      pass: config.sendEmail.app_pass,
    },
  });

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  const clickableResetPass = `<a href="${resetPassLink}" style="color: #28C76F; text-decoration: underline;">here</a>`;

  const html = `
    <div style="max-width: 600px; margin: 0 auto; background-color: #F6F7F9; color: #000; border-radius: 8px; padding: 24px;">
      <table style="width: 100%;">
        <tr>
          <td>
            <div style="padding: 5px; text-align: center;">
              <h2 style="color: #00ffd5ff;">PHC</h2>
            </div>
          </td>
          <td style="text-align: right; color: #999;">${formattedDate}</td>
        </tr>
      </table>

      <h3 style="text-align: center; color: #000;">Reset Your Password Within 10 Minutes</h3>
      <div style="padding: 0 1em;">
        <p style="text-align: left; line-height: 28px; color: #000;">
          <strong style="color: #000;">Reset Link:</strong> Click ${clickableResetPass} to reset your password.
        </p>
      </div>
    </div>
    `;

  const info = await transporter.sendMail({
    from: `"PH Health Care" <${config.sendEmail.app_user}>`,
    to,
    subject: "Reset Your Password within 5 Minutes.",
    text: "Hello world?",
    html: html,
  });

  return info;
};
