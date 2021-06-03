import multer, { FileFilterCallback } from 'multer';
import { InvalidParamError } from '@/shared/errors';
import { isValidMimeType } from '@/shared/utils/files';

const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];
const MAXSIZE_30_MB = 30 * 1024 * 1024;

export const imageFileFilter = (file: Express.Multer.File, callback: FileFilterCallback): void => {
    if (!isValidMimeType(ACCEPTED_FILE_TYPES, file.mimetype)) {
        callback(new InvalidParamError('Selected file is not a valid image'));
        return;
    }

    callback(null, true);
};

export const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAXSIZE_30_MB },
    fileFilter: (req, file, callback) => imageFileFilter(file, callback)
});
