'use strict';

const test = require('tape');
const FreeSurfer = require('../');
const fs = require('fs');
const path = require('path');

const surfUnusedRoi = path.join(__dirname, 'fs-roi-volumes-fixture-unused-roi.txt');
const surfSpaceDelim = path.join(__dirname, 'fs-roi-volumes-fixture-space-delim.txt');
const surfInvalid = path.join(__dirname, 'fs-roi-volumes-fixture-invalid.txt');

test('Constructor', (t) => {
  t.test('should set a new EOL', (t) => {
    const origEol = FreeSurfer.setEol('foo');
    const newEol = FreeSurfer.setEol(origEol);
    t.equals(newEol, 'foo');
    t.end();
  });

  t.test('should set a new delimiter', (t) => {
    const origDelimiter = FreeSurfer.setDelimiter('foo');
    const newDelimiter = FreeSurfer.setDelimiter(origDelimiter);
    t.equals(newDelimiter, 'foo');
    t.end();
  });

  t.test('should set a new defaultHeaderCount', (t) => {
    const origVal = FreeSurfer.setDefaultHeaderCount('foo');
    const newDefaultHeaderCount = FreeSurfer.setDefaultHeaderCount(origVal);
    t.equals(newDefaultHeaderCount, 'foo');
    t.end();
  });
});

test('Parsing', (t) => {
  let txtUnusedRoi;
  let txtSpaceDelim;
  let txtInvalid;
  const before = () => {
    txtUnusedRoi = fs.readFileSync(surfUnusedRoi).toString();
    txtSpaceDelim = fs.readFileSync(surfSpaceDelim).toString();
    txtInvalid = fs.readFileSync(surfInvalid).toString();
  };

  t.test('parses a valid string with header (tab delimited)', (t) => {
    before();
    const freeSurfer = new FreeSurfer({
      string: txtUnusedRoi,
      headerCount: 1,
    });
    t.ok(freeSurfer instanceof FreeSurfer);
    t.ok(freeSurfer.hasOwnProperty('header'));
    t.end();
  });

  t.test('parses a valid string with header (space delimited)', (t) => {
    const freeSurfer = new FreeSurfer({
      string: txtSpaceDelim,
      headerCount: 1,
    });
    t.ok(freeSurfer instanceof FreeSurfer);
    t.ok(freeSurfer.hasOwnProperty('header'));
    t.end();
  });

  t.test('parses a valid string without header', (t) => {
    const freeSurfer = new FreeSurfer({
      string: txtUnusedRoi.replace(/^[^\n]*\n/, ''),
      headerCount: 0,
    });
    t.ok(freeSurfer instanceof FreeSurfer);
    t.notOk(freeSurfer.hasOwnProperty('header'));
    t.end();
  });

  t.test('rejects an invalid string (simple)', (t) => {
    const tryFreeSurfer = () => new FreeSurfer({ string: 'invalid string' });
    t.throws(tryFreeSurfer);
    t.end();
  });

  t.test('rejects an invalid string (complex, ~FreeSurfer format)', (t) => {
    const tryFreeSurfer = () => new FreeSurfer({ string: txtInvalid });
    t.throws(tryFreeSurfer);
    t.end();
  });

  t.test('does not validate if validate option is false', (t) => {
    const tryFreeSurfer = () => new FreeSurfer({ string: 'invalid string', validate: false });
    t.doesNotThrow(tryFreeSurfer);
    t.end();
  });

  t.test('strips invalid fields by default', (t) => {
    const freeSurfer = new FreeSurfer({
      string: txtUnusedRoi,
      validate: false,
    });
    t.equals(freeSurfer.stripMe, undefined);
    t.end();
  });

  t.test('strips invalid fields by default', (t) => {
    const freeSurfer = new FreeSurfer({
      string: txtUnusedRoi,
      validate: false,
      removeInvalidFields: false,
    });
    t.notEqual(freeSurfer.stripMe, undefined);
    t.end();
  });
});
