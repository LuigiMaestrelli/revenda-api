import { IController, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { makeSuccessResponse, makeErrorResponse } from '@/shared/utils/http';
import { IFindUserByIdRepository } from '@/domain/repository/user/user';
import { NotFoundError } from '@/shared/errors/notFoundError';

export class GetUserByIdController implements IController {
    constructor(private readonly findUserById: IFindUserByIdRepository) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { params } = httpRequest;

            const userData = await this.findUserById.findById(params.id);
            if (!userData) {
                throw new NotFoundError('User');
            }

            return makeSuccessResponse(userData);
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
