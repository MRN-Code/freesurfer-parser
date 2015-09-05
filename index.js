'use strict';

var joi = require('joi');
var os = require('os');
var byline = require('byline');

var internals = {};
var parser = {};

internals.validFields = [
    'Left-Lateral-Ventricle',
    'Left-Inf-Lat-Vent',
    'Left-Cerebellum-White-Matter',
    'Left-Cerebellum-Cortex',
    'Left-Thalamus-Proper',
    'Left-Caudate',
    'Left-Putamen',
    'Left-Pallidum',
    '3rd-Ventricle',
    '4th-Ventricle',
    'Brain-Stem',
    'Left-Hippocampus',
    'Left-Amygdala',
    'CSF',
    'Left-Accumbens-area',
    'Left-VentralDC',
    'Left-vessel',
    'Left-choroid-plexus',
    'Right-Lateral-Ventricle',
    'Right-Inf-Lat-Vent',
    'Right-Cerebellum-White-Matter',
    'Right-Cerebellum-Cortex',
    'Right-Thalamus-Proper',
    'Right-Caudate',
    'Right-Putamen',
    'Right-Pallidum',
    'Right-Hippocampus',
    'Right-Amygdala',
    'Right-Accumbens-area',
    'Right-VentralDC',
    'Right-vessel',
    'Right-choroid-plexus',
    '5th-Ventricle',
    'WM-hypointensities',
    'Left-WM-hypointensities',
    'Right-WM-hypointensities',
    'non-WM-hypointensities',
    'Left-non-WM-hypointensities',
    'Right-non-WM-hypointensities',
    'Optic-Chiasm',
    'CC_Posterior',
    'CC_Mid_Posterior',
    'CC_Central',
    'CC_Mid_Anterior',
    'CC_Anterior',
    'BrainSegVol',
    'BrainSegVolNotVent',
    'BrainSegVolNotVentSurf',
    'lhCortexVol',
    'rhCortexVol',
    'CortexVol',
    'lhCorticalWhiteMatterVol',
    'rhCorticalWhiteMatterVol',
    'CorticalWhiteMatterVol',
    'SubCortGrayVol',
    'TotalGrayVol',
    'SupraTentorialVol',
    'SupraTentorialVolNotVent',
    'SupraTentorialVolNotVentVox',
    'MaskVol',
    'BrainSegVol-to-eTIV',
    'MaskVol-to-eTIV',
    'lhSurfaceHoles',
    'rhSurfaceHoles',
    'SurfaceHoles',
    'EstimatedTotalIntraCranialVol'
];

/**
 * generate a joi schema
 * @return {object} joi validation schema
 */
internals.getSchemaKeys = function() {
    return internals.validFields.reduce(function(res, val) {
        res[val] = joi.number().required();
        return res;
    }, {});
};

internals.schema = joi.object().keys(internals.getSchemaKeys);

/**
 * parse a single line
 * @param  {string} line the line to be parsed
 * @return {array}      zero-th index is the field name, first-index is the val
 */
internals.parseLine = function(line) {
    return line.split('\t');
};

parser.parse = function(string) {
    var lines = string.split(os.EOL);
    return lines.reduce(function(res, line) {
        var lineArgs = line.split('\t');
        res[lineArgs[0]] = lineArgs[1];
        return res;
    }, {});
};

/**
 * parse a readStream
 * @param  {readStream}   stream   the readstream to be parsed
 * @param  {Function} callback    called when the stream is fully parsed
 *                                signature (err, parsedObj)
 * @return {readStream}           The line-by-line readStream
 */
parser.parseStream = function(stream, callback) {
    var thisStream = byline.createStream(stream);
    thisStream.result = {};
    thisStream.on('data', function(line) {
        var parts = internals.parseLine(line);
        thisStream.result[parts[0]] = parts[1];
    });

    thisStream.on('end', callback(null, thisStream.result));
    return thisStream;
};

/**
 * validate that an object only has the required keys
 * @param  {object} obj the object to be validated
 * @return {object}     contains an `error` and a `value` property
 */
parser.validate = function(obj) {
    return joi.validate(obj, internals.schema);
};

/**
 * trim invalid fields from an object
 * @param  {object} obj the object to be trimmed
 * @return {object}     the trimmed object
 */
parser.trimInvalidFields = function(obj) {
    return internals.validFields.reduce(function(res, val) {
        if (obj[val] !== undefined) {
            res[val] = obj[val];
        }

        return res;
    }, {});
};

module.exports = parser;
