import Joi from 'joi';

export const Schema = Joi.object({
  PoolName: Joi.string().required(),
  AdminCreateUserConfig: Joi.object({
    AllowAdminCreateUserOnly: Joi.boolean().truthy('true').falsy('false'),
    InviteMessageTemplate: Joi.object({
      EmailMessage: Joi.string(),
      EmailSubject: Joi.string(),
      SMSMessage: Joi.string(),
    }),
    UnusedAccountValidityDays: Joi.number().min(0),
  }),
  AliasAttributes: Joi.array().unique().items(
    Joi.string().valid('phone_number', 'email', 'preferred_username')
  ),
  AutoVerifiedAttributes: Joi.array().unique().items(
    Joi.string().valid('phone_number', 'email')
  ),
  DeviceConfiguration: Joi.object({
    ChallengeRequiredOnNewDevice: Joi.boolean().truthy('true').falsy('false'),
    DeviceOnlyRememberedOnUserPrompt: Joi.boolean().truthy('true').falsy('false'),
  }),
  EmailConfiguration: Joi.object({
    ReplyToEmailAddress: Joi.string(),
    SourceArn: Joi.string(),
  }),
  EmailVerificationMessage: Joi.string(),
  EmailVerificationSubject: Joi.string(),
  LambdaConfig: Joi.object({
    CreateAuthChallenge: Joi.string(),
    CustomMessage: Joi.string(),
    DefineAuthChallenge: Joi.string(),
    PostAuthentication: Joi.string(),
    PostConfirmation: Joi.string(),
    PreAuthentication: Joi.string(),
    PreSignUp: Joi.string(),
    VerifyAuthChallengeResponse: Joi.string(),
  }),
  MfaConfiguration: Joi.string().valid('ON', 'OFF', 'OPTIONAL').insensitive(),
  Policies: Joi.object({
    PasswordPolicy: Joi.object().required({
      MinimumLength: Joi.number().min(0),
      RequireLowercase: Joi.boolean().truthy('true').falsy('false'),
      RequireNumbers: Joi.boolean().truthy('true').falsy('false'),
      RequireSymbols: Joi.boolean().truthy('true').falsy('false'),
      RequireUppercase: Joi.boolean().truthy('true').falsy('false'),
    }),
  }),
  Schema: Joi.array().unique().items(
    Joi.object({
      AttributeDataType: Joi.string().required().insensitive()
        .valid('String', 'Number', 'DateTime', 'Boolean'),
      DeveloperOnlyAttribute: Joi.boolean().truthy('true').falsy('false'),
      Mutable: Joi.boolean().truthy('true').falsy('false'),
      Name: Joi.string().required(),
      NumberAttributeConstraints: Joi.object({
        MaxValue: Joi.string(),
        MinValue: Joi.string(),
      }).or('MaxValue', 'MinValue'),
      Required: Joi.boolean().truthy('true').falsy('false'),
      StringAttributeConstraints: Joi.object({
        MaxLength: Joi.string(),
        MinLength: Joi.string(),
      }).or('MaxLength', 'MinLength'),
    }),
  ),
  SmsAuthenticationMessage: Joi.string(),
  SmsConfiguration: Joi.object({
    SnsCallerArn: Joi.string().required(),
    ExternalId: Joi.string(),
  }),
  SmsVerificationMessage: Joi.string(),
  UserPoolTags: Joi.object().pattern(/\w+/i, Joi.string()),
});

// Without: PoolName, AliasAttributes, Schema
