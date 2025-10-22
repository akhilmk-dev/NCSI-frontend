// import { createCanvas } from 'canvas';

// export default function handler(req, res) {
//   const width = 180;
//   const height = 50;
//   const canvas = createCanvas(width, height);
//   const ctx = canvas.getContext('2d');

//   const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
//   const captchaText = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

//   // Store captcha in session/cookie
//   res.setHeader('Set-Cookie', `captcha=${captchaText}; Path=/; HttpOnly; SameSite=Strict`);

//   // Background
//   ctx.fillStyle = '#f0f0f0';
//   ctx.fillRect(0, 0, width, height);

//   // Text
//   ctx.font = '30px sans-serif';
//   ctx.fillStyle = '#333';
//   ctx.fillText(captchaText, 25, 35);

//   // Send image
//   res.setHeader('Content-Type', 'image/png');
//   canvas.pngStream().pipe(res);
// }


export default function handler(req, res) {
  const captchaText = Math.random().toString(36).substring(2, 7).toUpperCase(); // e.g., 'A1B2C'
  res.status(200).json({ captcha: captchaText });
}
