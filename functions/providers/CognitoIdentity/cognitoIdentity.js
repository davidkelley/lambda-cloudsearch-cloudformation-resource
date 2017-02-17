import AWS from 'aws-sdk';
import Promise from 'bluebird';
import Joi from 'joi';

import Cloudformation, { wrap } from '../../events/Cloudformation';
import { OK, ERROR, AWS_REGION } from '../../global';
import { Schema } from './schema';

const CREATE_IDENTITY_POOL = 'createIdentityPool';

const DELETE_IDENTITY_POOL = 'deleteIdentityPool';

const UPDATE_IDENTITY_POOL = 'updateIdentityPool';

class CognitoIdentity extends Cloudformation {
  async create() {
    try {
      const validated = await this.validate(this.properties);
      const { IdentityPoolId } = await this.cognito(CREATE_IDENTITY_POOL, validated);
      this.response.respond(OK, { id: IdentityPoolId });
    } catch (err) {
      this.response.respond(ERROR, { reason: err.toString() });
    }
  }

  async update() {
    try {
      const validated = await this.validate(this.properties);
      const payload = Object.assign(validated, { IdentityPoolId: this.id });
      const { IdentityPoolId } = await this.cognito(UPDATE_IDENTITY_POOL, payload);
      this.response.respond(OK, { id: IdentityPoolId });
    } catch (err) {
      this.response.respond(ERROR, { reason: err.toString() });
    }
  }

  async delete() {
    try {
      const payload = { IdentityPoolId: this.id };
      await this.cognito(DELETE_IDENTITY_POOL, payload);
      this.response.respond(OK, { id: this.id });
    } catch (err) {
      this.response.respond(ERROR, { reason: err.toString() });
    }
  }

  validate(obj) {
    return Promise.fromCallback(cb => Joi.validate(obj, Schema, cb));
  }

  cognito(op, params) {
    return Promise.fromCallback(cb => this.client[op](params, cb));
  }

  get client() {
    return new AWS.CognitoIdentity({ region: AWS_REGION });
  }
}

export default wrap(CognitoIdentity);
