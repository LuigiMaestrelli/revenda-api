export type TokenPayload = {
    userId: string;
};

export type AuthenticationResult = {
    token: string;
    refreshToken: string;
    expiresIn: number;
};

export interface AutenticationAttributes {
    email: string;
    password: string;
}
