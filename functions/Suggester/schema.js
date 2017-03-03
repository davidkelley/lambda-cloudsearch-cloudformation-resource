import Joi from 'joi';

export const Schema = Joi.object().keys({
  DomainName: Joi.string().required(),
  Suggester: Joi.object().required().keys({
    DocumentSuggesterOptions: Joi.object().required().keys({
      SourceField: Joi.string().required(),
      FuzzyMatching: Joi.string().valid(
        'none', 'low', 'high'
      ),
      SortExpression: Joi.string(),
    }),
    SuggesterName: Joi.string().required().regex(/^[_a-z0-9]+$/, 'numbers, lowercase letters, underscores'),
  }),
});
