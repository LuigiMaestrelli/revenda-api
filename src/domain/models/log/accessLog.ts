export interface AccessLogAttributes {
    id: string;
    authorized: boolean;
    email: string;
    ip?: string;
    userAgent?: string;
    hostName?: string;
    origin?: string;
    reason?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateAccessLogAttributes {
    id?: string;
    authorized: boolean;
    email: string;
    ip?: string;
    userAgent?: string;
    hostName?: string;
    origin?: string;
    reason?: string;
}
