import { UserModel } from '@/domain/models/user/User';

export type AddUserModel = {
    name: string;
    email: string;
    password: string;
};

export interface IAddUserApplication {
    add: (accountData: AddUserModel) => Promise<UserModel | null>;
}

export interface IAddUserRepository {
    add: (accountData: AddUserModel) => Promise<UserModel>;
}
