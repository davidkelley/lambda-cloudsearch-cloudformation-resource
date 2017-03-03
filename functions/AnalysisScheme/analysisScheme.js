import AWS from 'aws-sdk';
import Promise from 'bluebird';
import Joi from 'joi';
import { Cloudformation, OK, ERROR } from 'node-lambda-events';

import { AWS_REGION } from '../global';
import { Schema } from './schema';

const CREATE_ANALYSIS_SCHEME = 'defineAnalysisScheme';

const DELETE_ANALYSIS_SCHEME = 'deleteAnalysisScheme';

class AnalysisScheme extends Cloudformation {
  async create() {
    try {
      const validated = await this.validate(this.properties);
      const { AnalysisScheme } = await this.cloudsearch(CREATE_ANALYSIS_SCHEME, validated);
      const { AnalysisSchemeName } = AnalysisScheme.Options;
      this.respond(OK, { id: AnalysisSchemeName });
    } catch (err) {
      this.respond(ERROR, { reason: err.toString() });
    }
  }

  async update() {
    this.respond(ERROR, { reason: "refused to update analysis scheme" });
  }

  async delete() {
    try {
      const validated = await this.validate(this.properties);
      const { DomainName } = validated;
      const params = { DomainName, AnalysisSchemeName: this.id };
      await this.cloudsearch(DELETE_ANALYSIS_SCHEME, params)
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

export default Cloudformation.wrap(AnalysisScheme);
