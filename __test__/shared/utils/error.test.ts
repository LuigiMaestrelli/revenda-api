import { ValidationError } from 'sequelize';
import multer from 'multer';

import { isSequelizeValidationError, isUploadError } from '@/shared/utils/error';

describe('Error utils', () => {
    describe('isSequelizeValidationError', () => {
        test('should return true on a sequelize validation error', () => {
            const error = new ValidationError('Some error');
            const result = isSequelizeValidationError(error);

            expect(result).toBe(true);
        });

        test('should return false on generic error', () => {
            const error = new Error('Some error');
            const result = isSequelizeValidationError(error);

            expect(result).toBe(false);
        });
    });

    describe('isUploadError', () => {
        test('should return true on MulterError error', () => {
            const error = new multer.MulterError('LIMIT_PART_COUNT', 'field');
            const result = isUploadError(error);

            expect(result).toBe(true);
        });

        test('should return false on generic error', () => {
            const error = new Error('Some error');
            const result = isUploadError(error);

            expect(result).toBe(false);
        });
    });
});
