import { MissingParamError } from '@/shared/errors';
import { RequireSingleFileValidation } from '@/presentation/helpers/validators/requireSingleFileValidation';
import { HttpRequest } from '@/domain/models/infra/http';

describe('RequiredSingleFile Validation', () => {
    test('should throw a MissingParamError if validation fails', async () => {
        const httpRequest = {
            params: {
                otherParam: 1
            },
            body: {}
        };

        const sut = new RequireSingleFileValidation('image');
        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).rejects.toThrow(new MissingParamError('image'));
    });

    test('should not throw if validation succeeds', async () => {
        const httpRequest: HttpRequest = {
            params: {
                someParam: 1
            },
            file: {
                buffer: null,
                fieldname: 'image',
                mimetype: 'mimetype',
                size: 100,
                originalname: 'name'
            }
        };

        const sut = new RequireSingleFileValidation('image');
        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).resolves.not.toThrow();
    });
});
