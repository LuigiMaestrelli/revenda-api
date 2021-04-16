import { json, urlencoded } from 'express';

export default { json: json(), urlencoded: urlencoded({ extended: true }) };
