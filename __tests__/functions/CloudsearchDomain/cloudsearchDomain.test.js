'use strict';

import AWS from 'aws-sdk-mock';
import faker from 'faker';

jest.mock('../../__mocks__/request');

const mod = require('../../../handler');

const jestPlugin = require('serverless-jest-plugin');

const lambdaWrapper = jestPlugin.lambdaWrapper;

const wrapped = lambdaWrapper.wrap(mod, { handler: 'CloudsearchDomain' });

describe('λ.CloudsearchDomain', () => {
  const region = "us-east-1";

  const stackId = `arn:aws:cloudformation:${region}:${faker.random.word()}/${faker.random.word()}/${faker.random.uuid()}`;

  const responseURL = faker.internet.url();

  const resourceType = `Custom::${faker.random.word()}`;

  const requestId = faker.random.uuid();

  const logicalResourceId = faker.random.uuid();

  const resourceProperties = {
    DomainName: faker.random.word(),
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

    const mockCloudsearch = jest.fn().mockImplementation((params, cb) => {
      cb(null, {
        DomainStatus: {
          DomainId: faker.random.uuid(),
          DomainName: resourceProperties.DomainName,
          ARN: faker.random.uuid(),
          Created: faker.random.boolean(),
          Deleted: false,
          DocService: {
            Endpoint: faker.internet.url(),
          },
          SearchService: {
            Endpoint: faker.internet.url()
          },
          RequiresIndexDocuments: true,
          Processing: true,
          SearchInstanceType: faker.random.word(),
          SearchPartitionCount: faker.random.number(),
          SearchInstanceCount: faker.random.number(),
          Limits: {
            MaximumReplicationCount: faker.random.number(),
            MaximumPartitionCount: faker.random.number(),
          },
        }
      });
    });

    const mockDescribe = jest.fn().mockImplementation((params, cb) => {
      cb(null, {
        DomainStatusList: [{
          DomainId: faker.random.uuid(),
          DomainName: params.DomainNames[0],
          ARN: 'arn:aws:cloudsearch:...',
          Created: true,
          Deleted: false,
          DocService: {
            Endpoint: faker.internet.url()
          },
          SearchService: {
            Endpoint: faker.internet.url()
          },
          RequiresIndexDocuments: true,
          Processing: false,
          SearchInstanceType: 's1.micro',
          SearchPartitionCount: 1,
          SearchInstanceCount: 1,
          Limits: {
            MaximumReplicationCount: 1,
            MaximumPartitionCount: 1
          }
        }]
      })
    });

    describe('when the request is valid', () => {
      beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
      });

      beforeAll(() => {
        AWS.mock('CloudSearch', 'createDomain', mockCloudsearch);
        AWS.mock('CloudSearch', 'describeDomains', mockDescribe);
      });

      it('succesfully creates a Cloudsearch Domain', async () => {
        const payload = request(resourceProperties);
        const response = await wrapped.run(payload);
        expect(response.Status).toEqual("SUCCESS");
        expect(response.Data).toEqual(expect.objectContaining({
          DomainId: expect.any(String),
          ARN: expect.any(String),
        }))
      });

      it('calls createIdentityPool', async () => {
        const payload = request(resourceProperties);
        await wrapped.run(payload);
        expect(mockCloudsearch).toHaveBeenCalled();
      });

      afterAll(() => {
        AWS.restore('CloudSearch', 'createDomain');
        AWS.restore('CloudSearch', 'describeDomains');
      });

      afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      });
    });

    describe('when the request is invalid', () => {
      Object.keys(resourceProperties).forEach((key) => {
        describe(`when ${key} is invalid`, () => {
          it('fails to create a Cloudsearch Domain', async () => {
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

    const newProperties = {
      DomainName: faker.random.word(),
    };

    const physicalResourceId = resourceProperties.DomainName;

    const request = (properties) => {
      return {
        StackId: stackId,
        ResponseURL: responseURL,
        ResourceProperties: newProperties,
        OldResourceProperties: properties,
        RequestType: requestType,
        ResourceType: resourceType,
        RequestId: requestId,
        PhysicalResourceId: physicalResourceId,
        LogicalResourceId: logicalResourceId
      }
    };

    describe('when the request is valid', () => {
      it('succesfully rejects an update to a Cloudsearch Domain', async () => {
        const payload = request(resourceProperties);
        const response = await wrapped.run(payload);
        expect(response.Status).toEqual("FAILED");
        expect(response.Reason).toMatch(new RegExp(`refused.+update`, 'i'));
      });
    });
  });

  describe('#delete', () => {
    const requestType = "Delete";

    const physicalResourceId = resourceProperties.DomainName;

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

    const mockCloudsearch = jest.fn().mockImplementation((params, cb) => {
      if(params.DomainName == resourceProperties.DomainName) {
        cb(null, {});
      } else {
        cb(true, params);
      }
    });

    describe('when the request is valid', () => {
      beforeAll(() => {
        AWS.mock('CloudSearch', 'deleteDomain', mockCloudsearch);
      });

      it('succesfully deletes a Cloudsearch Domain', async () => {
        const payload = request(resourceProperties);
        const response = await wrapped.run(payload);
        expect(response.Status).toEqual("SUCCESS");
      });

      it('calls deleteIdentityPool', async () => {
        const payload = request(resourceProperties);
        await wrapped.run(payload);
        expect(mockCloudsearch).toHaveBeenCalled();
      });

      afterAll(() => {
        AWS.restore('CloudSearch', 'deleteDomain')
      });
    });
  });
});
