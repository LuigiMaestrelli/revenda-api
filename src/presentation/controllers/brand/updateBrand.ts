import { IController, IValidation } from '@/presentation/protocols';
import { makeSuccessResponse, makeErrorResponse } from '@/shared/utils/http';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';
import { IBrandUseCase } from '@/domain/usecases/brand/brand';
import { IObjectManipulation } from '@/infra/protocols/objectManipulation';

export class UpdateBrandController implements IController {
    constructor(
        private readonly validation: IValidation,
        private readonly objectManipulation: IObjectManipulation,
        private readonly brandUseCase: IBrandUseCase
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.validation.validate(httpRequest);

            const { body, params } = httpRequest;
            const filteredBody = this.objectManipulation.filterAllowedProps(body, ['description']);
            const brand = await this.brandUseCase.update(params.id, filteredBody);

            return makeSuccessResponse(brand);
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
