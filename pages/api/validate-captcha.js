// // pages/api/validate-captcha.js
// import { parse } from 'cookie';

// export default function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const { captcha } = req.body;

//   // Parse the cookie to get the stored CAPTCHA value
//   const cookies = parse(req.headers.cookie || '');
//   const expectedCaptcha = cookies.captcha;

//   if (!expectedCaptcha || captcha.toLowerCase() !== expectedCaptcha.toLowerCase()) {
//     // Optionally clear the used CAPTCHA cookie even on failure to prevent repeated attempts with same wrong CAPTCHA
//     res.setHeader('Set-Cookie', 'captcha=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict');
//     return res.status(400).json({ message: 'Incorrect CAPTCHA. Please try again.' });
//   }

//   // If CAPTCHA matches, clear the cookie and send success
//   res.setHeader('Set-Cookie', 'captcha=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict');
//   return res.status(200).json({ message: 'CAPTCHA validated successfully.' });
// }