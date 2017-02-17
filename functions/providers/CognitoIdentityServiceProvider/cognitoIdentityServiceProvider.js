import AWS from 'aws-sdk';
import Promise from 'bluebird';
import Joi from 'joi';

import Cloudformation, { wrap } from '../../events/Cloudformation';
import { OK, ERROR, AWS_REGION } from '../../global';
import { Schema } from './schema';

const CREATE_USER_POOL = 'createUserPool';

const UPDATE_USER_POOL = 'updateUserPool';

class CognitoIdentityServiceProvider extends Cloudformation {
  async create() {
    try {
      const validated = await this.validate(this.properties);
      const { UserPool } = await this.cognito(CREATE_USER_POOL, validated);
      this.response.respond(OK, { id: UserPool.Id });
    } catch (err) {
      this.response.respond(ERROR, { reason: err.toString() });
    }
  }

  async update() {
    try {
      const validated = await this.validate(this.properties);
      delete validated.PoolName;
      delete validated.AliasAttributes;
      delete validated.Schema;
      const payload = Object.assign(validated, { UserPoolId: this.id });
      await this.cognito(UPDATE_USER_POOL, payload);
      this.response.respond(OK, { id: this.id });
    } catch (err) {
      this.response.respond(ERROR, { reason: err.toString() });
    }
  }

  async delete() {

  }

  validate(obj) {
    return Promise.fromCallback(cb => Joi.validate(obj, Schema, cb));
  }

  cognito(op, params) {
    return Promise.fromCallback(cb => this.client[op](params, cb));
  }

  get client() {
    return new AWS.CognitoIdentityServiceProvider({ region: AWS_REGION });
  }
}

export default wrap(CognitoIdentityServiceProvider);
