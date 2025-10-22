// import nodemailer from 'nodemailer';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { name = '', email = '', subject = '', message = '' } = req.body;

//   // Basic validation (trimmed)
//   if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   // Create transporter using Gmail SMTP
//   let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   try {
//     await transporter.sendMail({
//       from: email,
//       to: process.env.EMAIL_USER,
//       subject: `Contact CEO Form: ${subject}`,
//       text: `
//         Name: ${name}
//         Email: ${email}
//         Message: ${message}
//       `,
//     });
//     return res.status(200).json({ message: 'Thank you for Contacting us' });
//   } catch (error) {
//     console.error('Nodemailer error:', error);
//     return res.status(500).json({ error: 'Failed to send email' });
//   }
// }


// pages/api/submitContactForm.js or .ts
import { parse } from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, confirmEmail, subject, message, captcha } = req.body;

  // Parse the cookie to get the stored CAPTCHA value
  const cookies = parse(req.headers.cookie || '');
  const expectedCaptcha = cookies.captcha;

  if (!expectedCaptcha || captcha.toLowerCase() !== expectedCaptcha.toLowerCase()) {
    return res.status(400).json({ message: 'Captcha is incorrect.' });
  }

  // TODO: Handle the actual form submission (send email, store data, etc.)

  // Optionally clear the used CAPTCHA cookie to prevent replay
  res.setHeader('Set-Cookie', 'captcha=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict');

  return res.status(200).json({ message: 'Your request has been sent' });
}
