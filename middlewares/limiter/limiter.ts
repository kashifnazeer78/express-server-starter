import rateLimit from 'express-rate-limit';

const MESSAGE = "Too many requests, please try again later.";

const createLimiter = (windowMs: number, limit: number, message: string) => {
    return rateLimit({
        windowMs: windowMs,
        limit: limit,
        message: MESSAGE
    });
}

const signUpSignInLimiter = createLimiter(10 * 60 * 1000, 100, MESSAGE); // 100 requests per 10 minutes

export {signUpSignInLimiter};