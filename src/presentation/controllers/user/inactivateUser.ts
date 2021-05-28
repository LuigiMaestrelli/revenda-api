import { IController, IValidation } from '@/presentation/protocols';
import { makeSuccessResponse, makeErrorResponse } from '@/shared/utils/http';
import { IUserUseCase } from '@/domain/usecases/user/user';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';

export class InactivateUserController implements IController {
    constructor(private readonly validation: IValidation, private readonly userUseCase: IUserUseCase) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.validation.validate(httpRequest);

            const { params } = httpRequest;
            await this.userUseCase.inactive(params.id);

            return makeSuccessResponse();
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
