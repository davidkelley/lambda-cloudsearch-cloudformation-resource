import Joi from 'joi';

export const Schema = Joi.object().keys({
  AllowUnauthenticatedIdentities: Joi.boolean().truthy('true').falsy('false')
    .required(),
  IdentityPoolName: Joi.string().required(),
  CognitoIdentityProviders: Joi.array().unique()
    .items(Joi.object().keys({
      ClientId: Joi.string().required(),
      ProviderName: Joi.string().required(),
      ServerSideTokenCheck: Joi.boolean().truthy('true').falsy('false'),
    })),
  DeveloperProviderName: Joi.string(),
  OpenIdConnectProviderARNs: Joi.array().unique()
    .items(Joi.string()),
  SamlProviderARNs: Joi.array().unique()
    .items(Joi.string()),
  SupportedLoginProviders: Joi.object().keys({
    'graph.facebook.com': Joi.string(),
    'accounts.google.com': Joi.string(),
    'www.amazon.com': Joi.string(),
    'api.twitter.com': Joi.string(),
    'www.digits.com': Joi.string(),
  }),
});
