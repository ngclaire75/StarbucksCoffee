import nodemailer from 'nodemailer';

const YEAR = new Date().getFullYear();

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

async function sendMail({ to, subject, html, devLabel }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log(`[Email - DEV] ${devLabel} → ${to} | Subject: ${subject}`);
    return;
  }

  const transporter = getTransporter();
  const from = `Starbucks <${process.env.GMAIL_USER}>`;

  console.log(`[Email] Sending "${subject}" to ${to}...`);
  const info = await transporter.sendMail({ from, to, subject, html });
  console.log(`[Email] Sent successfully. MessageId: ${info.messageId}`);
}

/* ── Shared email wrapper ──────────────────────────────── */
function emailWrapper(headerTitle, bodyContent, siteUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>
    body{margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;}
    .wrap{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.10);}
    .hdr{background:#1E3932;padding:36px 32px;text-align:center;}
    .hdr img{width:72px;height:auto;}
    .hdr h1{color:#fff;font-size:22px;margin:16px 0 0;letter-spacing:.8px;font-weight:700;}
    .bdy{padding:36px 40px 32px;}
    .bdy h2{color:#1E3932;font-size:20px;margin:0 0 14px;}
    .bdy p{color:#444;font-size:14px;line-height:1.75;margin:0 0 16px;}
    .cta{display:block;width:fit-content;margin:24px auto;background:#00754A;color:#fff;text-decoration:none;padding:13px 34px;border-radius:50px;font-size:14px;font-weight:700;letter-spacing:.4px;}
    .div{height:1px;background:#e5e5e5;margin:20px 0;}
    .badge{display:inline-block;background:#f0f7f4;border:1px solid #b2d8c8;border-radius:6px;padding:10px 16px;font-size:13px;color:#1E3932;margin-bottom:16px;}
    .list{padding-left:20px;color:#444;font-size:14px;line-height:2.1;}
    .ftr{background:#1E3932;padding:20px 32px;text-align:center;}
    .ftr p{color:rgba(255,255,255,.55);font-size:11px;margin:0;line-height:1.6;}
    .ftr a{color:rgba(255,255,255,.75);text-decoration:none;}
  </style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <h1>${headerTitle}</h1>
  </div>
  <div class="bdy">${bodyContent}</div>
  <div class="ftr">
    <p>&copy; ${YEAR} Starbucks Coffee Company. All rights reserved.<br/>
    <a href="${siteUrl}">starbucks.com</a></p>
  </div>
</div>
</body>
</html>`;
}

/* ── 1. Welcome / Account Created ───────────────────────── */
export async function sendWelcomeEmail({ to, firstName }) {
  const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const body = `
    <h2>Hi ${firstName},</h2>
    <p>Thank you for creating your Starbucks account! You're now part of our community and one step closer to earning your first reward.</p>
    <div class="div"></div>
    <p><strong>With your Starbucks account you can:</strong></p>
    <ul class="list">
      <li>Earn Stars with every purchase</li>
      <li>Redeem Stars for free drinks and food</li>
      <li>Get exclusive member offers and early access</li>
      <li>Order ahead with the Starbucks app</li>
    </ul>
    <div class="div"></div>
    <p>Ready to start earning? Sign in to explore the latest rewards and offers.</p>
    <a class="cta" href="${siteUrl}/signin">Sign In to Your Account</a>`;

  await sendMail({
    to,
    subject: `Welcome to Starbucks, ${firstName}!`,
    html: emailWrapper('Welcome to Starbucks&reg;', body, siteUrl),
    devLabel: 'Welcome email',
  });
}

/* ── 2. Sign-In Confirmation ────────────────────────────── */
export async function sendSignInConfirmationEmail({ to, firstName }) {
  const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const now = new Date().toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });
  const body = `
    <h2>Hi ${firstName},</h2>
    <p>We noticed a successful sign-in to your Starbucks account.</p>
    <div class="badge">&#128336;&nbsp;&nbsp;${now}</div>
    <div class="div"></div>
    <p>If this was you, no action is needed. If you did not sign in, please reset your password immediately.</p>
    <a class="cta" href="${siteUrl}/signin">Manage My Account</a>`;

  await sendMail({
    to,
    subject: 'Starbucks Sign-In Confirmation',
    html: emailWrapper('Sign-In Confirmed', body, siteUrl),
    devLabel: 'Sign-in confirmation',
  });
}

/* ── 3. Subscription Confirmation ───────────────────────── */
export async function sendSubscriptionEmail({ to, firstName }) {
  const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const body = `
    <h2>Hi ${firstName},</h2>
    <p>You're now subscribed to the Starbucks newsletter!</p>
    <p>Expect the latest stories, seasonal offers, and exclusive news delivered straight to your inbox.</p>
    <div class="div"></div>
    <p><strong>Here's what you can look forward to:</strong></p>
    <ul class="list">
      <li>New seasonal beverage announcements</li>
      <li>Exclusive Rewards member offers</li>
      <li>Behind-the-scenes stories from our farmers &amp; partners</li>
      <li>Community and sustainability updates</li>
    </ul>
    <div class="div"></div>
    <a class="cta" href="${siteUrl}">Visit Starbucks</a>`;

  await sendMail({
    to,
    subject: "You're subscribed to Starbucks news!",
    html: emailWrapper("You're Subscribed!", body, siteUrl),
    devLabel: 'Subscription confirmation',
  });
}
