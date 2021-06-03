import { IController, IValidation } from '@/presentation/protocols';
import { makeErrorResponse, makeSuccessResponse } from '@/shared/utils/http';
import { IUserImageUseCase } from '@/domain/usecases/user/userImage';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';

export class GetUserMiniatureController implements IController {
    constructor(private readonly validation: IValidation, private readonly userImageUseCase: IUserImageUseCase) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.validation.validate(httpRequest);

            const { params } = httpRequest;
            const imageData = await this.userImageUseCase.findById(params.id);

            return makeSuccessResponse(imageData.miniature, null, imageData.mimetype);
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
