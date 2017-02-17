'use strict';

jest.mock('../../__mocks__/request');

import Promise from 'bluebird';
import Joi from 'joi';

import Response, { OK } from '../../../functions/events/Cloudformation/response';
import { SUCCESS, FAILED } from '../../../functions/events/Cloudformation/constants';

describe('Response', () => {
  beforeEach(() => { expect.assertions(1); });

  let stackId = "arn:aws:cloudformation:us-west-2:EXAMPLE/stack-name/guid";

  let responseURL = "http://pre-signed-success-S3-url-for-response";

  let requestType = "Create";

  let resourceType = "Custom::TestResource";

  let requestId = "41924891849128491849";

  let logicalResourceId = "MyTestResource";

  let request = {
    StackId: stackId,
    ResponseURL: responseURL,
    ResourceProperties: {},
    RequestType: requestType,
    ResourceType: resourceType,
    RequestId: requestId,
    LogicalResourceId: logicalResourceId,
  };

  const cb = jest.fn();

  const response = new Response(request, cb);

  test('#StackId', () => {
    expect(response.StackId).toEqual(stackId);
  });

  test('#RequestId', () => {
    expect(response.RequestId).toEqual(requestId);
  });

  test('#RequestId', () => {
    expect(response.RequestId).toEqual(requestId);
  });

  test('#LogicalResourceId', () => {
    expect(response.LogicalResourceId).toEqual(logicalResourceId);
  });

  test('#ResponseURL', () => {
    expect(response.ResponseURL).toEqual(responseURL);
  });

  test('#cb', () => {
    expect(response.cb).toEqual(cb);
  });

  describe('#respond', () => {
    const payload = {
      reason: "...",
      data: {},
      id: "1"
    };

    it('is a function', () => {
      expect(response.respond).toBeInstanceOf(Function);
    });

    describe('when the payload is valid', () => {
      it('responds successfully', async () => {
        await response.respond(OK, payload);
        expect(response.cb).toHaveBeenCalledWith(null, expect.objectContaining({
          Data: expect.any(Object),
          LogicalResourceId: expect.stringMatching(logicalResourceId),
          Reason: expect.any(String),
          PhysicalResourceId: expect.stringMatching("1"),
          RequestId: expect.stringMatching(requestId),
          StackId: expect.stringMatching(stackId),
          Status: expect.stringMatching(SUCCESS)
        }));
      });

      it('responds with an error if Cloudformation is unavailable', async () => {
        response.ResponseURL = "http://error";
        await response.respond(OK, payload);
        expect(response.cb).toHaveBeenCalledWith(expect.any(Error));
      });
    });

    describe('when the payload is invalid', () => {
      it('responds with error', async () => {
        let invalidPayload = Object.assign({}, payload, { id: null });
        await response.respond(OK, invalidPayload);
        expect(response.cb).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });

  describe('#validate', () => {
    test('it is a Function', () => {
      expect(response.validate).toBeInstanceOf(Function);
    });

    test('it returns a Promise', () => {
      expect(response.validate({}, {})).toBeInstanceOf(Promise);
    });

    test('it validates successfully', () => {
      let body = { reason: "...", data: {}, id: "1" };
      let payload = response.payload(OK, body);
      return response.validate(payload, response.schema).then((vals) => {
        expect(vals).toEqual(payload);
      });
    });

    test('it validates with an error', () => {
      let body = { reason: "...", data: {}, id: false };
      let payload = response.payload(OK, body);
      return response.validate(payload, response.schema).catch((vals) => {
        expect(vals.toString()).toMatch(/ValidationError/);
      });
    })
  });

  describe('#payload', () => {
    const payload = {
      reason: "...",
      data: {},
      id: "1"
    };

    it('is a function', () => {
      expect(response.payload).toBeInstanceOf(Function);
    });

    it('returns an object', () => {
      expect(response.payload(OK, payload)).toBeInstanceOf(Object);
    });

    describe('#payload.Status', () => {
      it('is SUCCESS when OK', () => {
        let { Status } = response.payload(OK, payload);
        expect(Status).toEqual(SUCCESS);
      });

      it('is FAILED when not OK', () => {
        let { Status } = response.payload("ERROR", payload);
        expect(Status).toEqual(FAILED);
      })
    });

    it('has the correct #payload.Reason', () => {
      let { Reason } = response.payload(OK, payload);
      expect(Reason).toEqual(payload.reason);
    });

    it('has the correct #payload.PhysicalResourceId', () => {
      let { PhysicalResourceId } = response.payload(OK, payload);
      expect(PhysicalResourceId).toEqual(payload.id);
    });

    it('has the correct #payload.Data', () => {
      let { Data } = response.payload(OK, payload);
      expect(Data).toEqual(payload.data);
    });

    describe('passed through properties', () => {
      ["StackId", "RequestId", "LogicalResourceId"].forEach((passed) => {
        it(`has the correct #payload.${passed}`, () => {
          let computed = response.payload(OK, payload);
          expect(computed[passed]).toEqual(response[passed]);
        });
      });
    });
  });

  describe('#schema', () => {
    const payload = {
      Status: "OK",
      Reason: "...",
      PhysicalResourceId: "..",
      StackId: stackId,
      RequestId: requestId,
      LogicalResourceId: logicalResourceId,
      Data: {},
    };

    it('returns a object', () => {
      expect(response.schema).toBeInstanceOf(Object);
    });

    Object.keys(payload).forEach((key) => {
      it(`requires #${key}`, () => {
        expect.assertions(1);
        const test = Object.assign({}, payload, { [key]: null });
        return response.validate(test, response.schema).catch((vals) => {
          expect(vals.toString()).toMatch(/ValidationError/);
        });
      })
    }, this);

    describe('when Status is OK', () => {
      it('does not require Reason', async () => {
        let test = Object.assign({}, payload);
        delete test.Reason;
        const vals = await response.validate(test, response.schema);
        expect(vals).toEqual(test);
      })

      it('requires PhysicalResourceId', async () => {
        let test = Object.assign({}, payload);
        delete test.PhysicalResourceId;
        try {
          let validation = await response.validate(test, response.schema)
        } catch(e) {
          expect(e.toString()).toMatch(/ValidationError/);
        }
      });
    });

    describe('when Status is FAILED', () => {
      it('does require Reason', async () => {
        let test = Object.assign({}, payload, { Status: FAILED });
        delete test.Reason;
        try {
          let resp = await response.validate(test, response.schema);
        } catch(e) {
          expect(e.toString()).toMatch(/ValidationError/);
        }
      });

      it('does not require PhysicalResourceId', async () => {
        let test = Object.assign({}, payload, { Status: "FAILED" });
        delete test.PhysicalResourceId;
        let vals = await response.validate(test, response.schema);
        expect(vals).toEqual(test);
      });
    });
  });
})
