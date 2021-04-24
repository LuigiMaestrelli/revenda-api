export interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateUserAttributes = {
    name: string;
    email: string;
    password: string;
};

export interface UserWithAuthAttributes {
    id: string;
    name: string;
    email: string;

    token: string;
    refreshToken: string;
    expiresIn: number;
}
