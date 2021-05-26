export interface UserImageAttributes {
    id: string;
    image: Buffer;
    miniature: Buffer;
    name: string;
    mimetype: string;
    imageSize: number;
    miniatureSize: number;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateUserImageAttributes {
    id: string;
    image: Buffer;
    miniature: Buffer;
    name: string;
    mimetype: string;
    imageSize: number;
    miniatureSize: number;
}
