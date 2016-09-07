'use strict';

const test = require('tape');
const FreeSurfer = require('../');
const fs = require('fs');
const path = require('path');

const surfUnusedRoi = path.join(__dirname, 'fs-roi-volumes-fixture-unused-roi.txt');
const surfSpaceDelim = path.join(__dirname, 'fs-roi-volumes-fixture-space-delim.txt');
const surfInvalid = path.join(__dirname, 'fs-roi-volumes-fixture-invalid.txt');

test('Constructor', (t) => {
  t.test('should set a new EOL', (st) => {
    const origEol = FreeSurfer.setEol('foo');
    const newEol = FreeSurfer.setEol(origEol);
    st.equals(newEol, 'foo');
    st.end();
  });

  t.test('should set a new delimiter', (st) => {
    const origDelimiter = FreeSurfer.setDelimiter('foo');
    const newDelimiter = FreeSurfer.setDelimiter(origDelimiter);
    st.equals(newDelimiter, 'foo');
    st.end();
  });

  t.test('should set a new defaultHeaderCount', (st) => {
    const origVal = FreeSurfer.setDefaultHeaderCount('foo');
    const newDefaultHeaderCount = FreeSurfer.setDefaultHeaderCount(origVal);
    st.equals(newDefaultHeaderCount, 'foo');
    st.end();
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

  t.test('parses a valid string with header (tab delimited)', (st) => {
    before();
    const freeSurfer = new FreeSurfer({
      string: txtUnusedRoi,
      headerCount: 1,
    });
    st.ok(freeSurfer instanceof FreeSurfer);
    st.ok(freeSurfer.hasOwnProperty('header')); // eslint-disable-line no-prototype-builtins
    st.end();
  });

  t.test('parses a valid string with header (space delimited)', (st) => {
    const freeSurfer = new FreeSurfer({
      string: txtSpaceDelim,
      headerCount: 1,
    });
    st.ok(freeSurfer instanceof FreeSurfer);
    st.ok(freeSurfer.hasOwnProperty('header')); // eslint-disable-line no-prototype-builtins
    st.end();
  });

  t.test('parses a valid string without header', (st) => {
    const freeSurfer = new FreeSurfer({
      string: txtUnusedRoi.replace(/^[^\n]*\n/, ''),
      headerCount: 0,
    });
    st.ok(freeSurfer instanceof FreeSurfer);
    st.notOk(freeSurfer.hasOwnProperty('header')); // eslint-disable-line no-prototype-builtins
    st.end();
  });

  t.test('rejects an invalid string (simple)', (st) => {
    const tryFreeSurfer = () => new FreeSurfer({ string: 'invalid string' });
    st.throws(tryFreeSurfer);
    st.end();
  });

  t.test('rejects an invalid string (complex, ~FreeSurfer format)', (st) => {
    const tryFreeSurfer = () => new FreeSurfer({ string: txtInvalid });
    st.throws(tryFreeSurfer);
    st.end();
  });

  t.test('does not validate if validate option is false', (st) => {
    const tryFreeSurfer = () => new FreeSurfer({ string: 'invalid string', validate: false });
    st.doesNotThrow(tryFreeSurfer);
    st.end();
  });

  t.test('strips invalid fields by default', (st) => {
    const freeSurfer = new FreeSurfer({
      string: txtUnusedRoi,
      validate: false,
    });
    st.equals(freeSurfer.stripMe, undefined);
    st.end();
  });

  t.test('strips invalid fields by default', (st) => {
    const freeSurfer = new FreeSurfer({
      string: txtUnusedRoi,
      validate: false,
      removeInvalidFields: false,
    });
    st.notEqual(freeSurfer.stripMe, undefined);
    st.end();
  });
});
