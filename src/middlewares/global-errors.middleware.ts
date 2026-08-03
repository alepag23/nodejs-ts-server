import type { Request, Response, NextFunction } from "express";

export function globalErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
}