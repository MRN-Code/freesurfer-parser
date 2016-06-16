'use strict';

const joi = require('joi');
const defaultOptions = {
  defaultHeaderCount: 1,
  delimiter: /\s+/,
  eol: '\n',
  headerCount: 1,
  removeInvalidFields: true,
  string: null,
  validate: true,
  values: null,
};
const defaults = require('lodash/defaults');
const merge = require('lodash/merge');
const schema = require('./schema.js');

class FreeSurfer {

  constructor(opts) {
    const options = defaults(opts, defaultOptions);
    this.defaultHeaderCount = options.defaultHeaderCount;
    this.delimiter = options.delimiter;
    this.eol = options.eol;

    /* istanbul ignore if */
    if (options.values) {
      merge(this, options.values);
    }

    if (options.string) {
      this.setFromString(options.string, options.headerCount);
    }

    if (options.removeInvalidFields) {
      this.trimInvalidFields();
    }

    if (options.validate) {
      this.validate();
    }
  }

  /**
   * validate that an object only has the required keys
   * @return {FreeSurfer} this
   */
  validate() {
    joi.assert(this, this.schema);
    return this;
  }

  /**
   * trim invalid fields from the current object
   * @return {FreeSurfer} this
   */
  trimInvalidFields() {
    for (let key in this) { // eslint-disable-line
      if (this.hasOwnProperty(key)) {
        if (schema.validFields.indexOf(key) === -1) {
          delete this[key];
        }
      }
    }
    return this;
  }

  /**
   * set values from string
   * @param  {string} string      the string
   * @param  {number} headerCount
   * @return {FreeSurfer} this
   */
  setFromString(string, headerCount) {
    /* istanbul ignore if */
    if (headerCount === undefined) {
      headerCount = this.defaultHeaderCount;
    }

    const lines = string.split(this.eol);
    let res = {};

    if (headerCount) {
      res.header = lines.splice(0, headerCount).join(';');
    }

    res = lines.reduce((res, line, ndx) => {
      const lineArgs = this.parseLine(line);
      const roiParameter = lineArgs[0];
      const roiValue = parseFloat(lineArgs[1]);

      if (!roiParameter && !roiValue) {
        return res; // empty line
      }

      if (lineArgs.length !== 2) {
        throw new ReferenceError([
          'invalid file: parameter "', roiParameter, '". ',
          'see line ', ndx,
        ].join(''));
      } else if (roiParameter && !isNaN(roiValue)) {
        res[roiParameter] = roiValue;
        return res;
      }
      /* istanbul ignore next */
      throw new ReferenceError(`invalid file: see line ${ndx}`);
    }, res);

    // Merge results with existing values
    merge(this, res);
    return this;
  }

    /**
     * parse a single line
     * @param  {string} line the line to be parsed
     * @return {array}      zero-th index is the key, first-index is the val
     */
  parseLine(line) {
    return line.split(this.delimiter);
  }

}
FreeSurfer.prototype.schema = schema.schema;
/**
 * Sets the End Of Line character for all FreeSurfer instances
 * @param  {string} val the eol character
 * @return {string}     the previous value of the eol character
 */
FreeSurfer.setEol = (val) => {
  const oldVal = this.eol;
  this.eol = val;
  return oldVal;
};

/**
 * Sets the delimiter character for all FreeSurfer instances
 * @param  {string} val the delimiter character
 * @return {string}     the previous value of the delimiter
 */
FreeSurfer.setDelimiter = (val) => {
  const oldVal = this.delimiter;
  this.delimiter = val;
  return oldVal;
};

/**
 * Sets the default number of header lines for all FreeSurfer instances
 * @param  {int} val the number of header lines
 * @return {int}     the previous value
 */
FreeSurfer.setDefaultHeaderCount = (val) => {
  const oldVal = this.defaultHeaderCount;
  this.defaultHeaderCount = val;
  return oldVal;
};


module.exports = FreeSurfer;
