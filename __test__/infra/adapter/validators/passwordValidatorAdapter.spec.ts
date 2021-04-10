import validator from 'validator';
import { PasswordValidatorAdapter, PASSWORD_CONFIG } from '@/infra/adapters/validators/PasswordValidatorAdapter';

jest.mock('validator', () => ({
    isStrongPassword(): boolean {
        return true;
    }
}));

const makeSut = (): PasswordValidatorAdapter => {
    return new PasswordValidatorAdapter();
};

describe('PasswordValidator Adapter', () => {
    test('should return false if validator returns false', () => {
        const sut = makeSut();

        jest.spyOn(validator, 'isStrongPassword').mockReturnValueOnce(false);

        const isValid = sut.isStrongPassword('bad password');
        expect(isValid).toBe(false);
    });

    test('should return true if validator returns true', () => {
        const sut = makeSut();
        const isValid = sut.isStrongPassword('good password');
        expect(isValid).toBe(true);
    });

    test('should call Validator with correct email', () => {
        const sut = makeSut();

        const isStrongPasswordSpy = jest.spyOn(validator, 'isStrongPassword');

        sut.isStrongPassword('any password');
        expect(isStrongPasswordSpy).toBeCalledWith('any password', PASSWORD_CONFIG);
    });
});
