export interface ErrorLogAttributes {
    id: string;
    location: string;
    message: string;
    stack: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateErrorLogAttributes {
    id?: string;
    location: string;
    message: string;
    stack: string;
}
