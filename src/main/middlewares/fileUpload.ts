import multer, { FileFilterCallback } from 'multer';
import { InvalidParamError } from '@/shared/errors';
import { isValidMimeType } from '@/shared/utils/files';

const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

export const imageFileFilter = (file: Express.Multer.File, callback: FileFilterCallback): void => {
    if (!isValidMimeType(ACCEPTED_FILE_TYPES, file.mimetype)) {
        return callback(new InvalidParamError('Arquivo selecionado não é uma imagem válida'));
    }

    callback(null, true);
};

export const imageUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, callback) => imageFileFilter(file, callback)
});
