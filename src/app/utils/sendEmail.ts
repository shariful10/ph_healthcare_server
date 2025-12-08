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

  const html = `
    <div style="max-width: 600px; margin: 0 auto; background-color: #F6F7F9; color: #000; border-radius: 8px; padding: 24px;">
      <table style="width: 100%;">
        <tr>
          <td>
            <h2 style="color: #00ffc3ff;">PHC</h2>
          </td>
          <td style="text-align: right; color: #999;">
            ${formattedDate}
          </td>
        </tr>
      </table>

      <h5 style="text-align: center; color: #000; margin-bottom: 24px;">
        Reset Your Password Within 5 Minutes.
      </h5>
      <div style="padding: 0 1em;">
        <p style="text-align: left; line-height: 28px; color: #000;">
          Dear User,
        </p>
        <p style="text-align: left; line-height: 28px; color: #000;">
          Reset your password by clicking
          <a href=${resetPassLink}>
            <button style="background-color: #00ffc3ff; color: #000; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; margin-left: 8px;">
              Reset Password
            </button>
          </a>
        </p>
      </div>
    </div>
    `;

  const info = await transporter.sendMail({
    from: `"PH Health Care" <${config.sendEmail.app_user}>`,
    to,
    subject: "Reset Password Link.",
    text: "Hello world?",
    html: html,
  });

  return info;
};
