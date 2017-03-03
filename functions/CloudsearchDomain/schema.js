import Joi from 'joi';

export const Schema = Joi.object().keys({
  DomainName: Joi.string().required().regex(/^[\-0-9a-z]+$/, 'numbers, lowercase letters, hyphens'),
});
