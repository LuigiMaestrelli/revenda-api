import { IController } from '@/presentation/protocols';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';
import { LogControllerDecorator } from '@/main/decorators/logControllerDecorator';
import { ServerError } from '@/shared/errors';
import { IErrorLogRepository } from '@/domain/repository/log/errorLog';
import { CreateErrorLogAttributes, ErrorLogAttributes } from '@/domain/models/log/errorLog';
import { makeServerErrorResponse } from '@/shared/utils/http';

interface SutTypes {
    controllerStub: IController;
    sut: LogControllerDecorator;
    errorLogRepositoryStub: IErrorLogRepository;
}

const makeController = (): IController => {
    class ControllerStub implements IController {
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse = {
                statusCode: 200,
                body: {
                    data: 'some data'
                }
            };

            return await new Promise(resolve => resolve(httpResponse));
        }
    }

    return new ControllerStub();
};

const makeErrorLogRepository = (): IErrorLogRepository => {
    class ErrorLogRepositoryStub implements IErrorLogRepository {
        async add(errorData: CreateErrorLogAttributes): Promise<ErrorLogAttributes> {
            return {
                id: 'valid id',
                location: 'the location',
                message: 'the message',
                stack: 'the stack'
            };
        }
    }

    return new ErrorLogRepositoryStub();
};

const makeSut = (): SutTypes => {
    const errorLogRepositoryStub = makeErrorLogRepository();
    const controllerStub = makeController();
    const sut = new LogControllerDecorator(controllerStub, errorLogRepositoryStub);

    return {
        controllerStub,
        errorLogRepositoryStub,
        sut
    };
};

describe('LogController Decorator', () => {
    test('should call parrent controller handle', async () => {
        const { controllerStub, sut } = makeSut();

        const controllerHandleSpy = jest.spyOn(controllerStub, 'handle');

        const httpRequest = {
            body: {
                someField: 'Some data'
            }
        };

        await sut.handle(httpRequest);
        expect(controllerHandleSpy).toHaveBeenCalledWith(httpRequest);
    });

    test('should return the same result as parent controller', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                someField: 'Some data'
            }
        };

        const response = await sut.handle(httpRequest);
        expect(response).toEqual({
            statusCode: 200,
            body: {
                data: 'some data'
            }
        });
    });

    test('should call AddErrorLogRepository with correct error if controller returns a server error', async () => {
        const { sut, controllerStub, errorLogRepositoryStub } = makeSut();

        const logSpy = jest.spyOn(errorLogRepositoryStub, 'add');
        const customServerError = new ServerError('Some message');

        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
            new Promise(resolve => resolve(makeServerErrorResponse(customServerError)))
        );

        const httpRequest = {
            body: {
                someField: 'Some data'
            }
        };

        await sut.handle(httpRequest);
        expect(logSpy).toHaveBeenCalledWith({
            location: 'ControllerStub',
            message: 'Some message',
            stack: customServerError.stack
        });
    });

    test('should call AddErrorLogRepository with correct error if controller returns a server error with parent', async () => {
        const { sut, controllerStub, errorLogRepositoryStub } = makeSut();

        const logSpy = jest.spyOn(errorLogRepositoryStub, 'add');

        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
            new Promise(resolve => {
                const fakeError = new Error();
                fakeError.message = 'Some parent message';
                fakeError.stack = 'Some parent stack';

                resolve(makeServerErrorResponse(new ServerError('Some message', fakeError)));
            })
        );

        const httpRequest = {
            body: {
                someField: 'Some data'
            }
        };

        await sut.handle(httpRequest);
        expect(logSpy).toHaveBeenCalledWith({
            location: 'ControllerStub',
            message: 'Some message -> Some parent message',
            stack: 'Some parent stack'
        });
    });

    test('should not call AddErrorLogRepository if controller does not return a server error', async () => {
        const { sut, errorLogRepositoryStub } = makeSut();

        const logSpy = jest.spyOn(errorLogRepositoryStub, 'add');

        const httpRequest = {
            body: {
                someField: 'Some data'
            }
        };

        await sut.handle(httpRequest);
        expect(logSpy).toHaveBeenCalledTimes(0);
    });
});
