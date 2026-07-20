export class AppError extends Error {
    public readonly status: number;

    constructor(
        message: string, status: number,
    ) {
        super(message);
        this.status = status;
        this.name = new.target.name;
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(message, 409);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Invalid input') {
        super(message, 400);
    }
}