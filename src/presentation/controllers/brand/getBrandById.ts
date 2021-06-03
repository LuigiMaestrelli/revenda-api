import { IController, IValidation } from '@/presentation/protocols';
import { makeSuccessResponse, makeErrorResponse } from '@/shared/utils/http';
import { IBrandRepository } from '@/domain/repository/brand/brand';
import { NotFoundError } from '@/shared/errors/notFoundError';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';

export class GetBrandByIdController implements IController {
    constructor(private readonly validation: IValidation, private readonly brandRepository: IBrandRepository) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.validation.validate(httpRequest);

            const { params } = httpRequest;
            const brand = await this.brandRepository.findById(params.id);
            if (!brand) {
                throw new NotFoundError('Brand');
            }

            return makeSuccessResponse(brand);
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
