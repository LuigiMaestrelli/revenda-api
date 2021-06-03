import { IUserUseCase } from '@/domain/usecases/user/user';
import { IController, IValidation } from '@/presentation/protocols';
import { IObjectManipulation } from '@/infra/protocols/objectManipulation';
import { makeErrorResponse, makeSuccessResponse } from '@/shared/utils/http';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';

export class UpdateUserController implements IController {
    constructor(
        private readonly validation: IValidation,
        private readonly objectManipulation: IObjectManipulation,
        private readonly userUseCase: IUserUseCase
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.validation.validate(httpRequest);

            const { body, params } = httpRequest;
            const filteredBody = this.objectManipulation.filterAllowedProps(body, ['name']);
            const user = await this.userUseCase.update(params.id, filteredBody);

            return makeSuccessResponse(user);
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
