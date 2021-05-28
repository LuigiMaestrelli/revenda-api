import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { ImageManipulation } from '@/infra/adapters/images/imageManipulation';

const makeSut = (): ImageManipulation => {
    return new ImageManipulation();
};

describe('Image manipulations', () => {
    describe('resize', () => {
        test('should return new buffer with JPG image and correct width', async () => {
            const imageDir = path.join(__dirname, '../../../utils/testFiles/JPG_File.jpg');
            const imageBuffer = fs.readFileSync(imageDir);

            const sut = makeSut();
            const newImage = await sut.resize(imageBuffer, 300);

            const sharpImg = sharp(newImage);
            const imgMeta = await sharpImg.metadata();

            expect(imgMeta.width).toBe(300);
        });

        test('should return new buffer with PNG image and correct width', async () => {
            const imageDir = path.join(__dirname, '../../../utils/testFiles/PNG_File.png');
            const imageBuffer = fs.readFileSync(imageDir);

            const sut = makeSut();
            const newImage = await sut.resize(imageBuffer, 300);

            const sharpImg = sharp(newImage);
            const imgMeta = await sharpImg.metadata();

            expect(imgMeta.width).toBe(300);
        });
    });

    describe('getImageSize', () => {
        test('should return JPG image size in bytes', async () => {
            const imageDir = path.join(__dirname, '../../../utils/testFiles/JPG_File.jpg');
            const imageBuffer = fs.readFileSync(imageDir);

            const sut = makeSut();
            const size = await sut.getImageSize(imageBuffer);

            expect(size).toBe(64844);
        });

        test('should return PNG image size in bytes', async () => {
            const imageDir = path.join(__dirname, '../../../utils/testFiles/PNG_File.png');
            const imageBuffer = fs.readFileSync(imageDir);

            const sut = makeSut();
            const size = await sut.getImageSize(imageBuffer);

            expect(size).toBe(51898);
        });
    });
});
