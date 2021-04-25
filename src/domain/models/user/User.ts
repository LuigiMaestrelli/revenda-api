import { AuthenticationResult } from '@/domain/models/auth/authentication';

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
    user: UserAttributes;
    auth: AuthenticationResult;
}
