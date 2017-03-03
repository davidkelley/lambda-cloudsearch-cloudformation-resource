import AWS from 'aws-sdk';
import Promise from 'bluebird';
import Joi from 'joi';
import { Cloudformation, OK, ERROR } from 'node-lambda-events';

import { AWS_REGION } from '../global';
import { Schema } from './schema';

const CREATE_INDEX_FIELD = 'defineIndexField';

const DELETE_INDEX_FIELD = 'deleteIndexField';

class IndexField extends Cloudformation {
  async create() {
    try {
      console.log(this.properties);
      const validated = await this.validate(this.properties);
      console.log(validated);
      const { IndexField } = await this.cloudsearch(CREATE_INDEX_FIELD, validated);
      console.log(IndexField);
      const { IndexFieldName } = IndexField.Options;
      this.respond(OK, { id: IndexFieldName });
    } catch (err) {
      this.respond(ERROR, { reason: err.toString() });
    }
  }

  async update() {
    this.respond(ERROR, { reason: "refused to update index field" });
  }

  async delete() {
    try {
      const validated = await this.validate(this.properties);
      const { DomainName } = validated;
      const params = { DomainName, IndexFieldName: this.id };
      await this.cloudsearch(DELETE_EXPRESSION, params);
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

export default Cloudformation.wrap(IndexField);
