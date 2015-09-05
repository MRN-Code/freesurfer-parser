'use strict';

var chai = require('chai');
var parser = require('../index.js');
var fs = require('fs');

chai.should();

describe('Parser', function() {
    var txt;
    var parsed;
    before('read fixture into memory', function(next) {
        txt = fs.readFileSync('./fs_results_fixture.tsv');
        next();
    });

    it('parses the tsv', function(next) {
        parsed = parser.parse(txt);
        parsed.should.be.a.object;
        next();
    });
});
