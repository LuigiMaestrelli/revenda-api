export interface EmailValidator {
    isValid: (email: string) => boolean;
}

export interface PasswordValidator {
    isStrongPassword: (email: string) => boolean;
}
