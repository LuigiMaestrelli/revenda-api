import { ValidationError } from 'sequelize';
import multer from 'multer';

export function isSequelizeValidationError(error: Error): boolean {
    return error instanceof ValidationError;
}

export const isUploadError = (err: Error): boolean => {
    return err instanceof multer.MulterError;
};
