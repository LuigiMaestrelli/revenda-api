export interface IPasswordValidator {
    isStrongPassword: (email: string) => boolean;
}
