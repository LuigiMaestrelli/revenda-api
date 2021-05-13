export type TokenPayload = {
    userId: string;
};

export type AuthenticationResult = {
    token: string;
    refreshToken: string;
    expiresIn: number;
};

export interface AuthenticationAttributes {
    email: string;
    password: string;
}
