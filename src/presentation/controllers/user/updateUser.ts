import { IUserUseCase } from '@/domain/usecases/user/user';
import { IController, HttpRequest, HttpResponse, IValidation } from '@/presentation/protocols';
import { IObjectManipulation } from '@/infra/protocols/objectManipulation';
import { makeErrorResponse, makeSuccessResponse } from '@/shared/utils/http';

export class UpdateUserController implements IController {
    constructor(
        private readonly validation: IValidation,
        private readonly objectManipulation: IObjectManipulation,
        private readonly userUseCase: IUserUseCase
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { body, params } = httpRequest;

            await this.validation.validate(httpRequest);

            const filteredBody = this.objectManipulation.filterAllowedProps(body, ['name']);
            const user = await this.userUseCase.update(params.id, filteredBody);

            return makeSuccessResponse(user);
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
