import { IController, IValidation } from '@/presentation/protocols';
import { makeSuccessResponse, makeErrorResponse } from '@/shared/utils/http';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';
import { IBrandUseCase } from '@/domain/usecases/brand/brand';

export class CreateBrandController implements IController {
    constructor(private readonly validation: IValidation, private readonly brandUseCase: IBrandUseCase) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.validation.validate(httpRequest);

            const { body } = httpRequest;
            const brand = await this.brandUseCase.add({ ...body });

            return makeSuccessResponse(brand);
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
