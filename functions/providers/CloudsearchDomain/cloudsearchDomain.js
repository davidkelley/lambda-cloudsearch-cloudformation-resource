import AWS from 'aws-sdk';
import Promise from 'bluebird';
import Joi from 'joi';

import Cloudformation, { wrap } from '../../events/Cloudformation';
import { OK, ERROR, AWS_REGION } from '../../global';
import { Schema } from './schema';

const CREATE_DOMAIN = 'createDomain';

const DELETE_DOMAIN = 'deleteDomain';

class CloudsearchDomain extends Cloudformation {
  async create() {
    try {
      const validated = await this.validate(this.properties);
      const { DomainStatus } = await this.cloudsearch(CREATE_DOMAIN, validated);
      const { DomainId, DomainName, ARN, DocService, SearchService } = DomainStatus;
      this.response.respond(OK, {
        id: DomainName,
        reason: `Created: ${DomainName}`,
        data: {
          DomainId,
          ARN,
        }
      });
    } catch (err) {
      this.response.respond(ERROR, { reason: err.toString() });
    }
  }

  async update() {
    this.response.respond(ERROR, { reason: "refused to update domain" });
  }

  async delete() {
    try {
      const payload = { DomainName: this.id };
      await this.cloudsearch(DELETE_DOMAIN, payload);
      this.response.respond(OK, { id: this.id });
    } catch (err) {
      this.response.respond(ERROR, { reason: err.toString() });
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

export default wrap(CloudsearchDomain);
