const { rateLimiter } = require("express-rate-limiter");

exports.getRateLimiter = () => {
  const limiter = rateLimiter({
    windowMS: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: true,
  });

  return limiter;
};
