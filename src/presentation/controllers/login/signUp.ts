import { IController, HttpRequest, HttpResponse, IValidation } from '@/presentation/protocols';
import { makeSuccessResponse, makeErrorResponse } from '@/shared/utils/http';
import { IAddUser } from '@/domain/usecases/user/user';

export class SignUpController implements IController {
    constructor(private readonly validation: IValidation, private readonly addUserUseCase: IAddUser) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.validation.validate(httpRequest);

            const { body } = httpRequest;
            const user = await this.addUserUseCase.add({
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
