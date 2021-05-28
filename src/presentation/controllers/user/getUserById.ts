import { IController, IValidation } from '@/presentation/protocols';
import { makeSuccessResponse, makeErrorResponse } from '@/shared/utils/http';
import { IUserRepository } from '@/domain/repository/user/user';
import { NotFoundError } from '@/shared/errors/notFoundError';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';

export class GetUserByIdController implements IController {
    constructor(private readonly validation: IValidation, private readonly userRepository: IUserRepository) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.validation.validate(httpRequest);

            const { params } = httpRequest;
            const userData = await this.userRepository.findById(params.id);

            if (!userData) {
                throw new NotFoundError('User');
            }

            return makeSuccessResponse(userData);
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
