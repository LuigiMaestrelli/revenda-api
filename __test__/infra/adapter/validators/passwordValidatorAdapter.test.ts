import { PasswordValidatorAdapter } from '@/infra/adapters/validators/passwordValidatorAdapter';

const makeSut = (): PasswordValidatorAdapter => {
    return new PasswordValidatorAdapter();
};

describe('PasswordValidator Adapter', () => {
    test('should return false for a short password', () => {
        const sut = makeSut();

        const isValid = sut.isStrongPassword('1@ASd67');
        expect(isValid).toBe(false);
    });

    test('should return false for password with no lowercase letters', () => {
        const sut = makeSut();

        const isValid = sut.isStrongPassword('123#@DFA');
        expect(isValid).toBe(false);
    });

    test('should return false for password with no uppercase letters', () => {
        const sut = makeSut();

        const isValid = sut.isStrongPassword('123#@asd');
        expect(isValid).toBe(false);
    });

    test('should return false for password with no numbers', () => {
        const sut = makeSut();

        const isValid = sut.isStrongPassword('Sda#@asd');
        expect(isValid).toBe(false);
    });

    test('should return false for password with no symbols', () => {
        const sut = makeSut();

        const isValid = sut.isStrongPassword('Sda45asd');
        expect(isValid).toBe(false);
    });

    test('should return true for valid passwords', () => {
        const sut = makeSut();
        const validPasswords = [
            "V7Js3+Twn'WR_p-",
            'r=v.q7TbP5A^SBx',
            'XBJV8Hp7M5&Z<}',
            "U>#9)k'8tzJB5=",
            'j#C8Sb,JR=UMqv',
            'uMB*483`SnvhWa',
            'y6RYxbg7uA"fHa',
            'E2;KzJ%^w=#4sT7',
            "s`Z'.5$P!Au#B8n",
            "TrS2U'N$G;.V?5-",
            'pf@m`JE3uZkSU4',
            'X5bqsT`;.P@%:v6}',
            'Br^f:_gc6h<q5]Px',
            'v@BuY8kV(dbGF&hX',
            'RzE_;>Cs7:f*pY',
            'qF%R#,Kz1=',
            "tSf.X8C`y'R9Y+^]",
            'PV}:gF{u3#Y.B;`M',
            'hR];#@Q%2=&Sn`K',
            'rt;<a36BeSM&K48'
        ];

        for (let i = 0; i < validPasswords.length; i++) {
            const isValid = sut.isStrongPassword(validPasswords[i]);
            expect(isValid).toBe(true);
        }
    });
});
