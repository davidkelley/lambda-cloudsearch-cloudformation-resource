import Joi from 'joi';

import shortId from '../shortId';

export const Schema = Joi.object().keys({
  DomainName: Joi.string().default(shortId, 'id generator')
    .example('12345-abcdef').description('the name of the Cloudsearch Domain')
    .regex(/^[\-0-9a-z]+$/, 'numbers, lowercase letters, hyphens'),
});
