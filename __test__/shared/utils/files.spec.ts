import fs from 'fs';
import path from 'path';
import { getFileList, isValidMimeType } from '@/shared/utils/files';

describe('File utils', () => {
    describe('getFileList', () => {
        test('should call readdirSync with correct values', () => {
            const readdirSyncSpy = jest.spyOn(fs, 'readdirSync');

            const currentDir = __dirname;
            getFileList(currentDir);

            expect(readdirSyncSpy).toHaveBeenCalledWith(currentDir);
        });

        test('should return a list of files', () => {
            /* @ts-expect-error */
            jest.spyOn(fs, 'readdirSync').mockImplementationOnce(() => {
                return ['file1', 'file2', 'file3'];
            });

            /* @ts-expect-error */
            jest.spyOn(fs, 'lstatSync').mockImplementation(() => {
                return {
                    isDirectory: function () {
                        return false;
                    }
                };
            });

            const files = getFileList(__dirname);

            expect(files).toEqual([
                path.join(__dirname, 'file1'),
                path.join(__dirname, 'file2'),
                path.join(__dirname, 'file3')
            ]);
        });

        test('should return a list of files without the ignore ones', () => {
            /* @ts-expect-error */
            jest.spyOn(fs, 'readdirSync').mockImplementationOnce(() => {
                return ['file1', 'file2', 'file3'];
            });

            /* @ts-expect-error */
            jest.spyOn(fs, 'lstatSync').mockImplementation(() => {
                return {
                    isDirectory: function () {
                        return false;
                    }
                };
            });

            const files = getFileList(__dirname, ['file2']);

            expect(files).toEqual([path.join(__dirname, 'file1'), path.join(__dirname, 'file3')]);
        });
    });

    describe('isValidMimeType', () => {
        test('should return true for a valid mimetype', () => {
            const validMimes = ['image/png', 'image/jpg', 'image/jpeg'];
            const isValid = isValidMimeType(validMimes, 'image/jpg');

            expect(isValid).toBe(true);
        });

        test('should return true for a valid mimetype', () => {
            const validMimes = ['image/png', 'image/jpg', 'image/jpeg'];
            const isValid = isValidMimeType(validMimes, 'application/pdf');

            expect(isValid).toBe(false);
        });

        test('should be caseinsentive for the mimetype', () => {
            const validMimes = ['image/png', 'image/jpg', 'image/jpeg'];
            const isValid = isValidMimeType(validMimes, 'IMAGE/JPG');

            expect(isValid).toBe(true);
        });

        test('should be caseinsentive for the acceptedMime', () => {
            const validMimes = ['IMAGE/PNG', 'IMAGE/JPG', 'IMAGE/JPEG'];
            const isValid = isValidMimeType(validMimes, 'image/jpg');

            expect(isValid).toBe(true);
        });
    });
});
