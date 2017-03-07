'use strict';

import faker from 'faker';
import Joi from 'joi';

import { Schema } from '../../../functions/CloudsearchDomain/schema';

describe('Schema', () => {
  describe('when DomainName is valid', () => {
    const DomainName = 'abcdef-123456789';

    it('should return the correct DomainName', (done) => {
      Joi.validate({ DomainName }, Schema, (err, values) => {
        expect(err).toBeFalsy();
        expect(values.DomainName).toEqual(DomainName);
        done();
      })
    })
  });

  describe('when DomainName contains uppercase letters', () => {
    const DomainName = 'ABCDEF';

    it('should return a validation error', (done) => {
      Joi.validate({ DomainName }, Schema, (err) => {
        expect(err).toBeTruthy();
        done();
      })
    })
  });

  describe('when DomainName contains special characters', () => {
    const DomainName = '#$%^&';

    it('should return a validation error', (done) => {
      Joi.validate({ DomainName }, Schema, (err) => {
        expect(err).toBeTruthy();
        done();
      })
    })
  });

  describe('when no DomainName is set', () => {
    it('should return a validation error', (done) => {
      Joi.validate({}, Schema, (err, values) => {
        expect(err).toBeFalsy();
        expect(values.DomainName).toMatch(/^[0-9a-z]+$/)
        done();
      })
    })
  });
})
