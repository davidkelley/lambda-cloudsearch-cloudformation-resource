import AWS from 'aws-sdk';
import Promise from 'bluebird';
import Joi from 'joi';
import { Cloudformation, OK, ERROR } from 'node-lambda-events';

import { AWS_REGION } from '../global';
import { Schema } from './schema';

const CREATE_SUGGESTER = 'defineSuggester';

const DELETE_SUGGESTER = 'deleteSuggester';

class Suggester extends Cloudformation {
  async create() {
    try {
      const validated = await this.validate(this.properties);
      const { Suggester } = await this.cloudsearch(CREATE_SUGGESTER, validated);
      const { SuggesterName } = Suggester.Options;
      this.respond(OK, { id: SuggesterName });
    } catch (err) {
      this.respond(ERROR, { reason: err.toString() });
    }
  }

  async update() {
    this.respond(ERROR, { reason: "refused to update suggester" });
  }

  async delete() {
    try {
      const validated = await this.validate(this.properties);
      const { DomainName } = validated;
      const params = { DomainName, SuggesterName: this.id };
      const { Suggester } = await this.cloudsearch(DELETE_SUGGESTER, params);
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

export default Cloudformation.wrap(Suggester);
