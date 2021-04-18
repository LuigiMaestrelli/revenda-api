export type TokenPayload = {
    userId: string;
};

export type AuthenticationData = {
    token: string;
    refreshToken: string;
    expiresIn: number;
};
