export interface BrandAttributes {
    id: string;
    description: string;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateBrandAttributes {
    id?: string;
    description: string;
}

export interface UpdateBrandAttributes {
    description?: string;
    active?: boolean;
}
