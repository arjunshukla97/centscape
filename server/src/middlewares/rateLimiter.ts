import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    status: 429,
    error: {message: 'Too many requests, please try again after sometime.'},
  },
});

export default limiter;
