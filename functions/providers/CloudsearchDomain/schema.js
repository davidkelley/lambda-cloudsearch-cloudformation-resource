import Joi from 'joi';

export const Schema = Joi.object().keys({
  DomainName: Joi.string().required(),
});
