export interface IImageManipulation {
    resize: (imageBuffer: Buffer, size: number) => Promise<Buffer>;
    getImageSize: (imageBuffer: Buffer) => Promise<number>;
}
