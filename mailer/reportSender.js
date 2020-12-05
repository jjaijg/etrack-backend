const nodemailer = require('nodemailer');
const defaultMailingList = process.env.GMAIL_ID || 'Your mail id';
const senderEmail = process.env.GMAIL_ID || 'Your mail id';
const senderPassword = process.env.GMAIL_APP_PASS || 'gmail_app_password'; // gmail app password
module.exports = {
  sendMail: async (subject, text, to = defaultMailingList, filePath) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: senderEmail,
          pass: senderPassword,
        },
      });

      const message = {
        from: `Mtracker < ${senderEmail} >`,
        to,
        subject,
        text: subject,
        html: text,
        attachments: [
          {
            filename: 'report.pdf',
            path: filePath,
            contentType: 'application/pdf',
          },
        ],
      };

      transporter.sendMail(message, (e, info) => {});
    } catch (e) {
      // handle errors here
      console.log('mail error : ', e);
    }
  },
};
