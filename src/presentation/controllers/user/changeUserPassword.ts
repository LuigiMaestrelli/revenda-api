import { IController, HttpRequest, HttpResponse, IValidation } from '@/presentation/protocols';
import { makeSuccessResponse, makeErrorResponse } from '@/shared/utils/http';
import { IUserUseCase } from '@/domain/usecases/user/user';

export class ChangeUserPasswordController implements IController {
    constructor(private readonly validation: IValidation, private readonly userUseCase: IUserUseCase) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.validation.validate(httpRequest);

            const { params, body } = httpRequest;
            await this.userUseCase.changePassword(params.id, { ...body });

            return makeSuccessResponse();
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
