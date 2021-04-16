import { Express } from 'express';

import { bodyParser, cors, contentType, compression, helmet } from '../middlewares';

export default (app: Express): void => {
    app.use(helmet);
    app.use(compression);
    app.use(bodyParser.json);
    app.use(bodyParser.urlencoded);
    app.use(cors);
    app.use(contentType);
};
