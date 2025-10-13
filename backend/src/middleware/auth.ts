import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if user is authenticated
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    error: 'Unauthorized',
    message: 'You must be logged in to access this resource',
  });
};

/**
 * Middleware to check if user email belongs to allowed domain
 */
export const requireDomain = (allowedDomain: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource',
      });
    }

    const user = req.user as any;
    const emailDomain = user.email.split('@')[1];

    if (emailDomain !== allowedDomain) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Only @${allowedDomain} email addresses are allowed.`,
      });
    }

    return next();
  };
};
