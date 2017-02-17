'use strict';

import AWS from 'aws-sdk-mock';
import faker from 'faker';

jest.mock('../../../__mocks__/request');

const mod = require('../../../../handler');

const jestPlugin = require('serverless-jest-plugin');

const lambdaWrapper = jestPlugin.lambdaWrapper;

const wrapped = lambdaWrapper.wrap(mod, { handler: 'CognitoIdentityServiceProvider' });

describe('λ.CognitoIdentityServiceProvider', () => {
  const region = "us-east-1";

  const stackId = `arn:aws:cloudformation:${region}:${faker.random.word()}/${faker.random.word()}/${faker.random.uuid()}`;

  const responseURL = faker.internet.url();

  const resourceType = `Custom::${faker.random.word()}`;

  const requestId = faker.random.uuid();

  const logicalResourceId = faker.random.uuid();

  const resourceProperties = {
    PoolName: faker.random.words(),
    AdminCreateUserConfig: {
      AllowAdminCreateUserOnly: faker.random.boolean(),
      InviteMessageTemplate: {
        EmailMessage: faker.random.words(),
        EmailSubject: faker.random.words(),
        SMSMessage: faker.random.words(),
      },
      UnusedAccountValidityDays: faker.random.number()
    },
    AliasAttributes: [
      faker.random.arrayElement(['phone_number', 'email', 'preferred_username'])
    ],
    AutoVerifiedAttributes: [
      faker.random.arrayElement(['phone_number', 'email'])
    ],
    DeviceConfiguration: {
      ChallengeRequiredOnNewDevice: faker.random.boolean(),
      DeviceOnlyRememberedOnUserPrompt: faker.random.boolean(),
    },
    EmailConfiguration: {
      ReplyToEmailAddress: faker.internet.email(),
    },
    EmailVerificationMessage: faker.random.words(),
    EmailVerificationSubject: faker.random.words(),
    LambdaConfig: {
      CreateAuthChallenge: faker.random.word(),
      CustomMessage: faker.random.word(),
      DefineAuthChallenge: faker.random.word(),
      PostAuthentication: faker.random.word(),
      PostConfirmation: faker.random.word(),
      PreAuthentication: faker.random.word(),
      PreSignUp: faker.random.word(),
      VerifyAuthChallengeResponse: faker.random.word(),
    },
    MfaConfiguration: faker.random.arrayElement(['ON', 'OFF', 'OPTIONAL']),
    Policies: {
      PasswordPolicy: {
        MinimumLength: faker.random.number(),
        RequireLowercase: faker.random.boolean(),
        RequireNumbers: faker.random.boolean(),
        RequireSymbols: faker.random.boolean(),
        RequireUppercase: faker.random.boolean(),
      }
    },
    Schema: [{
      AttributeDataType: faker.random.arrayElement(['String', 'Number', 'DateTime', 'Boolean']),
      DeveloperOnlyAttribute: faker.random.boolean(),
      Mutable: faker.random.boolean(),
      Name: faker.random.word(),
      NumberAttributeConstraints: {
        MaxValue: `${faker.random.number()}`,
        MinValue: `${faker.random.number()}`,
      },
      Required: faker.random.boolean(),
      StringAttributeConstraints: {
        MaxLength: `${faker.random.number()}`,
        MinLength: `${faker.random.number()}`,
      }
    }],
    SmsAuthenticationMessage: faker.random.words(),
    SmsConfiguration: {
      SnsCallerArn: faker.random.word(),
      ExternalId: faker.random.word(),
    },
    SmsVerificationMessage: faker.random.words(),
    UserPoolTags: { test: faker.random.word() },
  };

  describe('#create', () => {
    const requestType = "Create";

    const request = (properties) => {
      return {
        StackId: stackId,
        ResponseURL: responseURL,
        ResourceProperties: properties,
        RequestType: requestType,
        ResourceType: resourceType,
        RequestId: requestId,
        LogicalResourceId: logicalResourceId
      }
    };

    const poolId = faker.random.uuid();

    const mockCognito = jest.fn().mockImplementation((params, cb) => {
      const pool = Object.assign({}, params, { Id: poolId });
      cb(null, { UserPool: pool });
    });

    describe('when the request is valid', () => {
      beforeAll(() => {
        AWS.mock('CognitoIdentityServiceProvider', 'createUserPool', mockCognito);
      });

      it('succesfully creates a Cognito Identity Service Provider', async () => {
        const payload = request(resourceProperties);
        const response = await wrapped.run(payload);
        expect(response.Status).toEqual("SUCCESS");
        expect(response.PhysicalResourceId).toEqual(poolId);
        expect(mockCognito).toHaveBeenCalledTimes(1);
      });

      afterAll(() => {
        AWS.restore('CognitoIdentityServiceProvider', 'createUserPool')
      });
    });

    describe('when the request is invalid', () => {
      Object.keys(resourceProperties).forEach((key) => {
        describe(`when ${key} is invalid`, () => {
          it('fails to create a Cognito Identity Service Provider', async () => {
            let properties = Object.assign({}, resourceProperties);
            properties[key] = null;
            const payload = request(properties);
            const response = await wrapped.run(payload);
            expect(response.Status).toEqual("FAILED");
            expect(response.Reason).toMatch(new RegExp(`ValidationError.+${key}`, 'i'));
          });
        });
      });
    });
  });

  describe('#update', () => {
    const requestType = "Update";

    const physicalResourceId = faker.random.uuid();

    const request = (properties) => {
      return {
        StackId: stackId,
        ResponseURL: responseURL,
        ResourceProperties: properties,
        RequestType: requestType,
        ResourceType: resourceType,
        RequestId: requestId,
        PhysicalResourceId: physicalResourceId,
        LogicalResourceId: logicalResourceId
      }
    };

    describe('when the request is valid', () => {
      const mockCognito = jest.fn().mockImplementation((_, cb) => {
        cb(null, {});
      });

      beforeAll(() => {
        AWS.mock('CognitoIdentityServiceProvider', 'updateUserPool', mockCognito);
      });

      it('succesfully creates a Cognito Identity Service Provider', async () => {
        const payload = request(resourceProperties);
        const response = await wrapped.run(payload);
        expect(response.Status).toEqual("SUCCESS");
        expect(response.PhysicalResourceId).toEqual(physicalResourceId);
        expect(mockCognito).toHaveBeenCalledTimes(1);
      });

      afterAll(() => {
        AWS.restore('CognitoIdentityServiceProvider', 'updateUserPool')
      });
    });

    describe('when the request is invalid', () => {
      Object.keys(resourceProperties).forEach((key) => {
        describe(`when ${key} is invalid`, () => {
          it('fails to update a Cognito Identity Service Provider', async () => {
            let properties = Object.assign({}, resourceProperties);
            properties[key] = null;
            const payload = request(properties);
            const response = await wrapped.run(payload);
            expect(response.Status).toEqual("FAILED");
            expect(response.Reason).toMatch(new RegExp(`ValidationError.+${key}`, 'i'));
          });
        });
      });
    });
  });

  // describe('#delete', () => {
  //   const requestType = "Delete";
  //
  //   const physicalResourceId = faker.random.uuid();
  //
  //   const request = (properties) => {
  //     return {
  //       StackId: stackId,
  //       ResponseURL: responseURL,
  //       ResourceProperties: properties,
  //       RequestType: requestType,
  //       ResourceType: resourceType,
  //       RequestId: requestId,
  //       PhysicalResourceId: physicalResourceId,
  //       LogicalResourceId: logicalResourceId
  //     }
  //   };
  //
  //   const mockCognito = jest.fn().mockImplementation((params, cb) => {
  //     cb(null, {});
  //   });
  //
  //   describe('when the request is valid', () => {
  //     beforeAll(() => {
  //       AWS.mock('CognitoIdentity', 'deleteIdentityPool', mockCognito);
  //     });
  //
  //     it('succesfully creates a Cognito Identity Pool', async () => {
  //       const payload = deleteRequest(resourceProperties);
  //       const response = await wrapped.run(payload);
  //       expect(response).toBeDefined();
  //     });
  //
  //     it('calls deleteIdentityPool', async () => {
  //       const payload = deleteRequest(resourceProperties);
  //       await wrapped.run(payload);
  //       expect(mockCognito).toHaveBeenCalled();
  //     });
  //
  //     afterAll(() => {
  //       AWS.restore('CognitoIdentity', 'deleteIdentityPool')
  //     });
  //   });
  // });
});
