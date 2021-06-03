import { IController, IValidation } from '@/presentation/protocols';
import { makeSuccessResponse, makeErrorResponse } from '@/shared/utils/http';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';
import { IBrandUseCase } from '@/domain/usecases/brand/brand';

export class DeleteBrandController implements IController {
    constructor(private readonly validation: IValidation, private readonly brandUseCase: IBrandUseCase) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.validation.validate(httpRequest);

            const { params } = httpRequest;
            await this.brandUseCase.delete(params.id);

            return makeSuccessResponse();
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
