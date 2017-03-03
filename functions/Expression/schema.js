import Joi from 'joi';

export const Schema = Joi.object().keys({
  DomainName: Joi.string().required(),
  Expression: Joi.object().required().keys({
    ExpressionName: Joi.string().required(),
    ExpressionValue: Joi.string().required(),
  }),
});
