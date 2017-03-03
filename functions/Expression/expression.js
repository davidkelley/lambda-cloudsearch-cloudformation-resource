import AWS from 'aws-sdk';
import Promise from 'bluebird';
import Joi from 'joi';
import { Cloudformation, OK, ERROR } from 'node-lambda-events';

import { AWS_REGION } from '../global';
import { Schema } from './schema';

const CREATE_EXPRESSION = 'defineExpression';

const DELETE_EXPRESSION = 'deleteExpression';

class Expression extends Cloudformation {
  async create() {
    try {
      const validated = await this.validate(this.properties);
      const { Expression } = await this.cloudsearch(CREATE_EXPRESSION, validated);
      const { ExpressionName, ExpressionValue } = Expression.Options;
      this.respond(OK, { id: ExpressionName, data: { ExpressionValue } });
    } catch (err) {
      this.respond(ERROR, { reason: err.toString() });
    }
  }

  async update() {
    this.respond(ERROR, { reason: "refused to update expression" });
  }

  async delete() {
    try {
      const validated = await this.validate(this.properties);
      const { DomainName } = validated;
      const { ExpressionName } = validated.Expression;
      await this.cloudsearch(DELETE_EXPRESSION, { DomainName, ExpressionName })
      this.respond(OK, { id: this.id });
    } catch (err) {
      this.respond(ERROR, { reason: err.toString() });
    }
  }

  validate(obj) {
    return Promise.fromCallback(cb => Joi.validate(obj, Schema, cb));
  }

  cloudsearch(op, params) {
    return Promise.fromCallback(cb => this.client[op](params, cb));
  }

  get client() {
    return new AWS.CloudSearch({ region: AWS_REGION });
  }
}

export default Cloudformation.wrap(Expression);
