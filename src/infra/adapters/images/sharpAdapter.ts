import { IImageManipulation } from '@/infra/protocols/imageManipulation';
import sharp from 'sharp';

export class SharpAdapter implements IImageManipulation {
    async resize(imageBuffer: Buffer, size: number): Promise<Buffer> {
        const imageResized = sharp(imageBuffer).resize(size);
        return await imageResized.toBuffer();
    }

    async getImageSize(imageBuffer: Buffer): Promise<number> {
        const sharpImg = sharp(imageBuffer);
        const imgMeta = await sharpImg.metadata();

        return imgMeta.size;
    }
}
