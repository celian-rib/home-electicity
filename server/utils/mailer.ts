import { SendMailOptions, createTransport } from 'nodemailer';
import prisma from '../db';

export default function sendEmail (email: string, subject: string, content: string) {
  const config = useRuntimeConfig();
  const {
    mailAddress,
    mailPassword,
    mailSmtp
  } = config;

  if (!mailAddress || !mailPassword || !mailSmtp) { throw new Error('Missing mail config'); }

  const transporter = createTransport({
    host: mailSmtp,
    port: 465,
    secure: true,
    auth: {
      user: mailAddress,
      pass: mailPassword
    }
  });

  const mailOptions: SendMailOptions = {
    from: {
      address: mailAddress,
      name: `Electricité | ${config.homeName}`
    },
    to: email,
    subject,
    html: content
  };

  return new Promise((resolve, reject) => {
    console.log(`Sending email to ${email}`);
    transporter.sendMail(mailOptions, (error) => {
      if (error) { return reject(error); }
      return resolve(true);
    });
  });
}

export async function sendAllAlertEmails (subject: string, content: string) {
  const users = await prisma.alertee.findMany();

  for (const user of users) {
    try {
      await sendEmail(user.email, subject, content);
    } catch (error) {
      console.error(`Error sending email to ${user.email}`);
      console.error(error);
    }
  }
}
