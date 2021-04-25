import { Request, Response, NextFunction } from 'express';
import { ITokenValidation } from '@/infra/protocols/tokenValidation';

export class AuthenticationMiddleware {
    constructor(private readonly tokenValidation: ITokenValidation) {}

    makeMiddleware(): Function {
        return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
            try {
                const { authorization } = req.headers;
                if (!authorization) {
                    return res.status(401).send();
                }

                const [type, token] = authorization.split(' ');

                if (type.toLowerCase() !== 'bearer') {
                    return res.status(401).json({
                        message: 'Invalid token'
                    });
                }

                /* @ts-expect-error */
                req.auth = await this.tokenValidation.validateToken(token);

                return next();
            } catch (err) {
                return res.status(401).json({
                    message: 'Invalid token'
                });
            }
        };
    }
}
