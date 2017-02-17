'use strict';

import Cloudformation, { Response, wrap } from '../../../functions/events/Cloudformation';

const event = {
  RequestType: "Update",
  PhysicalResourceId: "353-f-a-25-t-a-ba-2-aaaa",
  ResourceProperties: { foo: 'bar' },
};

const context = {}

const cb = jest.fn();

describe('Cloudformation', () => {

  const cfn = new Cloudformation(event, context, cb);

  test('#event', () => {
    expect(cfn.event).toEqual(event);
  });

  test('#properties', () => {
    expect(cfn.properties).toEqual(event.ResourceProperties);
  });

  test('#id', () => {
    expect(cfn.id).toEqual(event.PhysicalResourceId);
  });

  test('#type', () => {
    expect(cfn.type).toEqual(event.RequestType.toLowerCase());
  });

  test('#event', () => {
    expect(cfn.event).toEqual(event);
  });

  test('#context', () => {
    expect(cfn.context).toEqual(context);
  });

  test('cb', () => {
    expect(cfn.response.cb).toEqual(cb);
  });

  describe('#perform', () => {
    it('should call the correct handler', () => {
      cfn[event.RequestType.toLowerCase()] = jest.fn();
      cfn.perform();
      expect(cfn[event.RequestType.toLowerCase()]).toHaveBeenCalledTimes(1);
    })
  });
});

describe('#wrap', () => {
  const performer = jest.fn();

  class TestCloudformation extends Cloudformation {
    perform(fn, ...args) {
      return fn(...args);
    }
  }

  test('it calls perform', () => {
    wrap(TestCloudformation, performer, 1, 2)(event, context, cb)
    expect(performer).toHaveBeenCalledWith(1, 2);
  });
})
