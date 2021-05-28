import { IImageManipulation } from '@/infra/protocols/imageManipulation';
import sharp from 'sharp';

export class ImageManipulation implements IImageManipulation {
    async resize(imageBuffer: Buffer, size: number): Promise<Buffer> {
        const sharpImg = sharp(imageBuffer);
        const image = await sharpImg.resize(size).toBuffer();
        return image;
    }

    async getImageSize(imageBuffer: Buffer): Promise<number> {
        const sharpImg = sharp(imageBuffer);
        const imgMeta = await sharpImg.metadata();

        return imgMeta.size;
    }
}
