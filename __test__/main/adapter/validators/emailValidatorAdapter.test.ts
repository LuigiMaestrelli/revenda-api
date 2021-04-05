import { EmailValidatorAdapter } from '@/main/adapters/validators/emailValidatorAdapter';

const makeSut = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter();
};

describe('EmailValidator Adapter', () => {
    test('should return false for an invalid e-mail', () => {
        const sut = makeSut();

        const invalidEmails = [
            'plainaddress',
            '#@%^%#$@#$@#.com',
            '@example.com',
            'Joe Smith <email@example.com>',
            'email.example.com',
            'email@example@example.com',
            '.email@example.com',
            'email.@example.com',
            'email..email@example.com',
            'email@example.com (Joe Smith)',
            'email@example',
            'email@-example.com',
            'email@example..com',
            'Abc..123@example.com'
        ];

        for (let i = 0; i < invalidEmails.length; i++) {
            const isValid = sut.isValid(invalidEmails[i]);
            expect(isValid).toBe(false);
        }
    });

    test('should return true for an invalid e-mail', () => {
        const sut = makeSut();

        const validEmail = [
            'email@example.com',
            'firstname.lastname@example.com',
            'email@subdomain.example.com',
            'firstname+lastname@example.com',
            '"email"@example.com',
            '1234567890@example.com',
            'email@example-one.com',
            'email@example.name',
            'email@example.museum',
            'email@example.co.jp',
            'firstname-lastname@example.com'
        ];

        for (let i = 0; i < validEmail.length; i++) {
            const isValid = sut.isValid(validEmail[i]);
            expect(isValid).toBe(true);
        }
    });
});
