import fs from 'fs';
import path from 'path';
import filesUtil from '@/shared/utils/files';

describe('File utils', () => {
    test('should call readdirSync with correct values', () => {
        const readdirSyncSpy = jest.spyOn(fs, 'readdirSync');

        const currentDir = __dirname;
        filesUtil.getFileList(currentDir);

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

        const files = filesUtil.getFileList(__dirname);

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

        const files = filesUtil.getFileList(__dirname, ['file2']);

        expect(files).toEqual([path.join(__dirname, 'file1'), path.join(__dirname, 'file3')]);
    });
});
