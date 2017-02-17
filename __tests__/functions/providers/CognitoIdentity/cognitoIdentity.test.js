'use strict';

import AWS from 'aws-sdk-mock';
import faker from 'faker';

jest.mock('../../../__mocks__/request');

const mod = require('../../../../handler');

const jestPlugin = require('serverless-jest-plugin');

const lambdaWrapper = jestPlugin.lambdaWrapper;

const wrapped = lambdaWrapper.wrap(mod, { handler: 'CognitoIdentity' });

describe('λ.CognitoIdentity', () => {
  beforeAll(() => {
    expect.assertions(1);
  });

  const region = "us-east-1";

  const stackId = `arn:aws:cloudformation:${region}:${faker.random.word()}/${faker.random.word()}/${faker.random.uuid()}`;

  const responseURL = faker.internet.url();

  const resourceType = `Custom::${faker.random.word()}`;

  const requestId = faker.random.uuid();

  const logicalResourceId = faker.random.uuid();

  const resourceProperties = {
    AllowUnauthenticatedIdentities: faker.random.boolean(),
    IdentityPoolName: faker.random.word(),
    CognitoIdentityProviders: [{
        ClientId: faker.random.alphaNumeric(),
        ProviderName: faker.random.alphaNumeric(),
    }],
    DeveloperProviderName: `com.internal.${faker.internet.domainName()}`,
    OpenIdConnectProviderARNs: [],
    SamlProviderARNs: [],
    SupportedLoginProviders: {
      'graph.facebook.com': faker.random.uuid(),
      'accounts.google.com': faker.random.uuid(),
      'www.amazon.com': faker.random.uuid(),
      'api.twitter.com': faker.random.uuid(),
      'www.digits.com': faker.random.uuid(),
    },
  };

  const invalidProperties = {
    AllowUnauthenticatedIdentities: faker.random.word(),
    IdentityPoolName: null,
    CognitoIdentityProviders: faker.random.uuid(),
    DeveloperProviderName: faker.random.boolean(),
    OpenIdConnectProviderARNs: [faker.random.number()],
    SamlProviderARNs: [{ key: faker.random.number() }],
    SupportedLoginProviders: [],
  };

  describe('#create', () => {
    const requestType = "Create";

    const createRequest = (properties) => {
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

    const mockCognito = jest.fn().mockImplementation((params, cb) => {
      cb(null, Object.assign({}, resourceProperties, {
        IdentityPoolId: faker.random.uuid()
      }));
    });

    describe('when the request is valid', () => {
      beforeAll(() => {
        AWS.mock('CognitoIdentity', 'createIdentityPool', mockCognito);
      });

      it('succesfully creates a Cognito Identity Pool', async () => {
        const payload = createRequest(resourceProperties);
        const response = await wrapped.run(payload);
        expect(response.Status).toEqual("SUCCESS");
      });

      it('calls createIdentityPool', async () => {
        const payload = createRequest(resourceProperties);
        await wrapped.run(payload);
        expect(mockCognito).toHaveBeenCalled();
      });

      afterAll(() => {
        AWS.restore('CognitoIdentity', 'createIdentityPool')
      });
    });

    describe('when the request is invalid', () => {
      Object.keys(resourceProperties).forEach((key) => {
        describe(`when ${key} is invalid`, () => {
          it('fails to create a Cognito Identity Pool', async () => {
            let properties = Object.assign({}, resourceProperties);
            properties[key] = invalidProperties[key];
            const payload = createRequest(properties);
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

    const updateRequest = (properties) => {
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

    const mockCognito = jest.fn().mockImplementation((params, cb) => {
      cb(null, params);
    });

    describe('when the request is valid', () => {
      beforeAll(() => {
        AWS.mock('CognitoIdentity', 'updateIdentityPool', mockCognito);
      });

      it('succesfully creates a Cognito Identity Pool', async () => {
        const payload = updateRequest(resourceProperties);
        const response = await wrapped.run(payload);
        expect(response.Status).toEqual("SUCCESS");
      });

      it('calls updateIdentityPool', async () => {
        const payload = updateRequest(resourceProperties);
        await wrapped.run(payload);
        expect(mockCognito).toHaveBeenCalled();
      });

      afterAll(() => {
        AWS.restore('CognitoIdentity', 'updateIdentityPool')
      });
    });

    describe('when the request is invalid', () => {
      Object.keys(resourceProperties).forEach((key) => {
        describe(`when ${key} is invalid`, () => {
          it('fails to update a Cognito Identity Pool', async () => {
            let properties = Object.assign({}, resourceProperties);
            properties[key] = invalidProperties[key];
            const payload = updateRequest(properties);
            const response = await wrapped.run(payload);
            expect(response.Status).toEqual("FAILED");
            expect(response.Reason).toMatch(new RegExp(`ValidationError.+${key}`, 'i'));
          });
        });
      });
    });
  });

  describe('#delete', () => {
    const requestType = "Delete";

    const physicalResourceId = faker.random.uuid();

    const deleteRequest = (properties) => {
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

    const mockCognito = jest.fn().mockImplementation((params, cb) => {
      cb(null, {});
    });

    describe('when the request is valid', () => {
      beforeAll(() => {
        AWS.mock('CognitoIdentity', 'deleteIdentityPool', mockCognito);
      });

      it('succesfully creates a Cognito Identity Pool', async () => {
        const payload = deleteRequest(resourceProperties);
        const response = await wrapped.run(payload);
        expect(response.Status).toEqual("SUCCESS");
      });

      it('calls deleteIdentityPool', async () => {
        const payload = deleteRequest(resourceProperties);
        await wrapped.run(payload);
        expect(mockCognito).toHaveBeenCalled();
      });

      afterAll(() => {
        AWS.restore('CognitoIdentity', 'deleteIdentityPool')
      });
    });
  });
});
