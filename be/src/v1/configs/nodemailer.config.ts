export const nodemailerConfig = {
  service: process.env.NODE_MAILER_SERVICE || "gmail",
  host: process.env.NODE_MAILER_HOST || "smtp.gmail.com",
  port: Number(process.env.NODE_MAILER_PORT || 465),
  secure: true,
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
};
