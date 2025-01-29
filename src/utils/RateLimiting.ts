import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60min
  max: 100, // limit each ip to 100 in windowMs
});

export const registerLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 6,
  message: 'Too many registration attempts. Please try again later.',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default limiter;

/** - Todo - RegisterLimit
 * Enhance Security with IP-Based Blocking (Optional)
 * Use express-rate-limit in combination with fail2ban (on the server) or Redis for more advanced rate limiting.
 * Handle Failed Attempts by Captcha (Extra Protection)
 * After 3 failed attempts, return a CAPTCHA challenge to block bots. */
