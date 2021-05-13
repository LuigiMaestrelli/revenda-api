import { AuthenticationResult } from '@/domain/models/auth/authentication';

export interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    active: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateUserAttributes = {
    id?: string;
    name: string;
    email: string;
    password: string;
};

export type UpdateUserAttributes = {
    name?: string;
    active?: boolean;
    password?: string;
};

export interface UserWithAuthAttributes {
    user: UserAttributes;
    auth: AuthenticationResult;
}
