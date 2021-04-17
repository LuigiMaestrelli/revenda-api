export interface PasswordValidator {
    isStrongPassword: (email: string) => boolean;
}
