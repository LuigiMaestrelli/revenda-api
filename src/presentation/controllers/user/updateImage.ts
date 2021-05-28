import { IController, IValidation } from '@/presentation/protocols';
import { makeErrorResponse, makeSuccessResponse } from '@/shared/utils/http';
import { IUserImageUseCase } from '@/domain/usecases/user/userImage';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';

export class UpdateUserImageController implements IController {
    constructor(private readonly validation: IValidation, private readonly userImageUseCase: IUserImageUseCase) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.validation.validate(httpRequest);

            const { params, file } = httpRequest;

            await this.userImageUseCase.setImage({
                id: params.id,
                image: file.buffer,
                imageSize: file.size,
                mimetype: file.mimetype,
                name: file.originalname,
                miniature: file.buffer,
                miniatureSize: file.size
            });

            return makeSuccessResponse();
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
