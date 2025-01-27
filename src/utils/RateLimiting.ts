import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 60 * 100, // 60min
  max: 100, // limit each ip to 100 in windowMs
});

export default limiter;
