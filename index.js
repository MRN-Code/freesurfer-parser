'use strict';

//TODO: add option to create from readStream
var joi = require('joi');
var defaultOptions = {
    values: null,
    string: null,
    headerCount: 1,
    removeInvalidFields: true,
    validate: true,
};
var defaults = require('lodash.defaults');
var merge = require('lodash.merge');
var schema = require('./lib/schema.js');
var eol = '\n';
var defaultHeaderCount = 1;
var delimiter = `\t`;

var FreeSurfer = function(_options) {
    var options = defaults(_options, defaultOptions);

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
};

/**
 * Sets the End Of Line character for all FreeSurfer instances
 * @param  {string} val the eol character
 * @return {string}     the previous value of the eol character
 */
FreeSurfer.setEol = function(val) {
    var oldVal = eol;
    eol = val;
    return oldVal;
};

/**
 * Sets the delimiter character for all FreeSurfer instances
 * @param  {string} val the delimiter character
 * @return {string}     the previous value of the delimiter
 */
FreeSurfer.setDelimiter = function(val) {
    var oldVal = delimiter;
    delimiter = val;
    return oldVal;
};

/**
 * Sets the default number of header lines for all FreeSurfer instances
 * @param  {int} val the number of header lines
 * @return {int}     the previous value
 */
FreeSurfer.setDefaultHeaderCount = function(val) {
    var oldVal = defaultHeaderCount;
    defaultHeaderCount = val;
    return oldVal;
};

FreeSurfer.prototype = {
    schema: schema.schema,
    /**
     * validate that an object only has the required keys
     * @return {FreeSurfer}     throws an error, or returns self
     */
    validate: function() {
        joi.assert(this, this.schema);
        return this;
    },

    /**
     * trim invalid fields from the current object
     * @return {FreeSurfer}     self
     */
    trimInvalidFields: function() {
        var self = this;
        for (var key in self) {
            if (self.hasOwnProperty(key)) {
                if (schema.validFields.indexOf(key) === -1) {
                    delete self[key];
                }
            }
        }

        return this;
    },

    /**
     * set values from string
     * @param  {string} string      the string
     * @param  {[type]} headerCount [description]
     * @return {[type]}             [description]
     */
    setFromString: function(string, headerCount) {
        if (headerCount === undefined) {
            headerCount = defaultHeaderCount;
        }

        var lines = string.split(eol);
        var res = {};
        var self = this;

        if (headerCount) {
            res.header = lines.splice(0, headerCount).join(';');
        }

        res = lines.reduce(function(res, line) {
            var lineArgs = self.parseLine(line);
            if (lineArgs[0] !== '') {
                res[lineArgs[0]] = lineArgs[1];
            }

            return res;
        }, res);

        // Merge results with existing values
        merge(this, res);
        return this;
    },

    /**
     * parse a single line
     * @param  {string} line the line to be parsed
     * @return {array}      zero-th index is the key, first-index is the val
     */
    parseLine: function(line) {
        return line.split(delimiter);
    }
};

module.exports = FreeSurfer;
