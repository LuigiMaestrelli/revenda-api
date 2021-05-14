import { IController, HttpRequest, HttpResponse, IValidation } from '@/presentation/protocols';
import { makeSuccessResponse, makeErrorResponse } from '@/shared/utils/http';
import { IUserUseCase } from '@/domain/usecases/user/user';

export class SignUpController implements IController {
    constructor(private readonly validation: IValidation, private readonly userUseCase: IUserUseCase) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.validation.validate(httpRequest);

            const { body } = httpRequest;
            const user = await this.userUseCase.add({
                name: body.name,
                email: body.email,
                password: body.password
            });

            return makeSuccessResponse(user);
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
