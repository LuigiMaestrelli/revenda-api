export interface Hasher {
    hash: (value: string) => Promise<string>;
}

export interface HashCompare {
    compare: (value: string, hash: string) => Promise<boolean>;
}
