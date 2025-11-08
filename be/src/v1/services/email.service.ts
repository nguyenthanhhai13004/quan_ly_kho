import { NODE_MAILER_EMAIL } from "../cores/constants/app.constant";
import transporter, { EmailOptionsType } from "../databases/init.nodemailer";

class EmailService {
  static async send(options:EmailOptionsType) {
    try {
      const mailOptions = {
        from: ` "Mail <${NODE_MAILER_EMAIL}>" `,
        ...options
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } catch (error) {
      console.log("Error send email", error);
      return error;
    }
  }
}

export default EmailService;
