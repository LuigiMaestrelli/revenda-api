export interface IHasher {
    hash: (value: string) => Promise<string>;
}

export interface IHashCompare {
    compare: (value: string, hash: string) => Promise<boolean>;
}
