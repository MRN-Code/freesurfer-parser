'use strict';

var chai = require('chai');
var FreeSurfer = require('../index.js');
var fs = require('fs');
var path = require('path');

var fixturePath = path.join(__dirname, 'fs-roi-volumes-fixture.txt');
var fixturePath2 = path.join(__dirname, 'fs-roi-volumes-fixture-2.txt');
var fixturePath3 = path.join(__dirname, 'fs-roi-volumes-fixture-3.txt');

chai.should();

describe('Constructor', function() {
    it('should set a new EOL', function() {
        var origEol = FreeSurfer.setEol('foo');
        var newEol = FreeSurfer.setEol(origEol);
        newEol.should.equal('foo');
    });

    it('should set a new delimiter', function() {
        var origDelimiter = FreeSurfer.setDelimiter('foo');
        var newDelimiter = FreeSurfer.setDelimiter(origDelimiter);
        newDelimiter.should.equal('foo');
    });

    it('should set a new defaultHeaderCount', function() {
        var origVal = FreeSurfer.setDefaultHeaderCount('foo');
        var newDefaultHeaderCount = FreeSurfer.setDefaultHeaderCount(origVal);
        newDefaultHeaderCount.should.equal('foo');
    });
});

describe('Parsing', function() {
    var txt, txt2, txt3;
    before('read fixture into memory', function(next) {
        txt = fs.readFileSync(fixturePath).toString();
        txt2 = fs.readFileSync(fixturePath2).toString();
        txt3 = fs.readFileSync(fixturePath3).toString();
        next();
    });

    it('parses a valid string with header (tab delimited)', function() {
        var freeSurfer = new FreeSurfer({
            string: txt,
            headerCount: 1
        });
        freeSurfer.should.be.instanceOf(FreeSurfer);
        freeSurfer.should.have.property('header');
    });

    it('parses a valid string with header (space delimited)', function() {
        var freeSurfer = new FreeSurfer({
            string: txt2,
            headerCount: 1
        });
        freeSurfer.should.be.instanceOf(FreeSurfer);
        freeSurfer.should.have.property('header');
    });

    it('parses a valid string without header', function() {
        var freeSurfer = new FreeSurfer({
            string: txt.replace(/^[^\n]*\n/, ''),
            headerCount: 0
        });
        freeSurfer.should.be.instanceOf(FreeSurfer);
        freeSurfer.should.not.have.property('header');
    });

    it('rejects an invalid string (simple)', function() {
        var tryFreeSurfer = function() {
            return new FreeSurfer({
                string: 'invalid string'
            });
        };

        chai.expect(tryFreeSurfer).to.throw(Error);
    });

    it('rejects an invalid string (complex, ~FreeSurfer format)', function() {
        var tryFreeSurfer = function() {
            return new FreeSurfer({
                string: txt3
            });
        };

        chai.expect(tryFreeSurfer).to.throw(Error);
    });

    it('does not validate if validate option is false', function() {
        var tryFreeSurfer = function() {
            return new FreeSurfer({
                string: 'invalid string',
                validate: false
            });
        };

        chai.expect(tryFreeSurfer).to.not.throw(Error);
    });

    it('strips invalid fields by default', function() {
        var freeSurfer = new FreeSurfer({
            string: txt,
            validate: false
        });

        return chai.expect(freeSurfer.stripMe).to.be.undefined;
    });

    it('strips invalid fields by default', function() {
        var freeSurfer = new FreeSurfer({
            string: txt,
            validate: false,
            removeInvalidFields: false
        });

        return chai.expect(freeSurfer.stripMe).to.not.be.undefined;
    });
});
