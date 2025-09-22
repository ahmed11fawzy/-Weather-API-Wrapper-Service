import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

interface CustomError extends Error {
  statusCode?: number; // Optional property for HTTP status codes
}

const globalErrorHandler: ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log the error (you can integrate with a logger like Winston)
  console.error('Global Error:', err.stack);

  // Default status code
  const statusCode = err.statusCode || 500;

  console.log('🚀 ~ globalErrorHandler ~ process.env.NODE_ENV:', process.env.NODE_ENV);
  // Send consistent error response
  res.status(statusCode).json({
    status: 'fail',
    code: statusCode,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack trace in dev
  });
};

export default globalErrorHandler;
