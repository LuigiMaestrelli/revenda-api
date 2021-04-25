export interface IValidation {
    validate: (input: any) => Promise<void>;
}
