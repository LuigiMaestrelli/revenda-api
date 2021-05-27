import { ForbiddenError, InvalidParamError, MissingParamError, ServerError, UnauthorizedError } from '@/shared/errors';
import { HttpResponse, HttpResponseError } from '../../presentation/protocols';
import { NotFoundError } from '../errors/notFoundError';

export function makeBadRequestResponse(error: Error): HttpResponseError {
    return {
        statusCode: 400,
        body: {
            message: error.message
        }
    };
}

export function makeUnauthorizedResponse(error: Error): HttpResponseError {
    return {
        statusCode: 401,
        body: {
            message: error.message
        }
    };
}

export function makeForbiddenResponse(error: Error): HttpResponseError {
    return {
        statusCode: 403,
        body: {
            message: error.message
        }
    };
}

export function makeNotFoundResponse(error: Error): HttpResponseError {
    return {
        statusCode: 404,
        body: {
            message: error.message
        }
    };
}

export function makeServerErrorResponse(error: ServerError): HttpResponseError {
    return {
        statusCode: 500,
        body: {
            message: error.message,
            parentMessage: error.parentError?.message,
            details: error.parentError?.stack ?? error.stack
        }
    };
}

export function makeSuccessResponse(body?: any, headers?: any, contentType?: string): HttpResponse {
    return {
        statusCode: 200,
        body,
        headers,
        contentType
    };
}

export function makeErrorResponse(error: Error): HttpResponseError {
    if (error instanceof InvalidParamError) {
        return makeBadRequestResponse(error);
    }

    if (error instanceof MissingParamError) {
        return makeBadRequestResponse(error);
    }

    if (error instanceof UnauthorizedError) {
        return makeUnauthorizedResponse(error);
    }

    if (error instanceof ForbiddenError) {
        return makeForbiddenResponse(error);
    }

    if (error instanceof NotFoundError) {
        return makeNotFoundResponse(error);
    }

    return makeServerErrorResponse(error);
}
