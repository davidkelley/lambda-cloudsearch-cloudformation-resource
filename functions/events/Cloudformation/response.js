import Joi from 'joi';
import request from 'request';
import Promise from 'bluebird';

import { SUCCESS, FAILED } from './constants';
import { OK } from '../../global';

class Response {
  constructor({ ResponseURL, RequestId, LogicalResourceId, StackId }, cb) {
    this.ResponseURL = ResponseURL;
    this.RequestId = RequestId;
    this.LogicalResourceId = LogicalResourceId;
    this.StackId = StackId;
    this.cb = cb;
  }

  async respond(...args) {
    try {
      const body = this.payload(...args);
      const { validated } = await this.validate(body, this.schema);
      await this.respondToCloudformation({ body });
      return this.cb(null, body);
    } catch (err) {
      return this.cb(new Error(err));
    }
  }

  respondToCloudformation({ body = {} }) {
    const parsed = JSON.stringify(body);
    const payload = {
      url: this.ResponseURL,
      method: 'PUT',
      port: 443,
      body: parsed,
      headers: {
        'content-type': '',
        'content-length': parsed.length,
      }
    };
    return Promise.fromCallback(cb => request(payload, cb));
  }

  validate(obj, schema) {
    return Promise.fromCallback(cb => Joi.validate(obj, schema, cb));
  }

  payload(status = OK, { reason, data = {}, id }) {
    const { StackId, RequestId, LogicalResourceId } = this;
    return {
      Status: (status === OK ? SUCCESS : FAILED),
      Reason: reason,
      PhysicalResourceId: id,
      Data: data,
      StackId,
      RequestId,
      LogicalResourceId,
    };
  }

  get schema() {
    return Joi.object().keys({
      Status: Joi.string().required(),
      Reason: Joi.when('Status', {
        is: FAILED,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),
      PhysicalResourceId: Joi.when('Status', {
        is: FAILED,
        then: Joi.string().optional(),
        otherwise: Joi.string().required(),
      }),
      StackId: Joi.string().required(),
      RequestId: Joi.string().required(),
      LogicalResourceId: Joi.string().required(),
      Data: Joi.object().required(),
    });
  }
}

export default Response;
