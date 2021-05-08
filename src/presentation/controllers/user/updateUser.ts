import { IUpdateUser } from '@/domain/usecases/user/user';
import { IController, HttpRequest, HttpResponse, IValidation } from '@/presentation/protocols';
import { makeErrorResponse, makeSuccessResponse } from '@/shared/utils/http';

export class UpdateUserController implements IController {
    constructor(private readonly validation: IValidation, private readonly updateUser: IUpdateUser) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { body, params } = httpRequest;

            await this.validation.validate(httpRequest);
            await this.updateUser.update(params.id, body);

            return makeSuccessResponse();
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
