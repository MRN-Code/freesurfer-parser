'use strict';

const mkdirp = require('mkdirp');
const fs = require('fs');
const Generator = require('./generator');

const gen = new Generator();

const controlURSIs = gen.randomURSIs(10);
const substanceURSIs = gen.randomURSIs(10, 10);

const controlSurfs = controlURSIs.map((ursi) => ({ ursi, output: gen.build(ursi) }));
const substancSurfs = substanceURSIs.map((ursi) => ({
  ursi, output:
  gen.build(ursi, { 'TotalGrayVol': 0.95 }),
}));

mkdirp.sync('./demo/controls');
controlSurfs.forEach((surf) => {
  const dest = `./demo/controls/${surf.ursi}.txt`;
  console.log(`writing control ursi ${surf.ursi} ${dest}`);
  fs.writeFileSync(dest, surf.output);
});

mkdirp.sync('./demo/substanceUsers');
substancSurfs.forEach((surf) => {
  const dest = `./demo/substanceUsers/${surf.ursi}.txt`;
  console.log(`writing control ursi ${surf.ursi} ${dest}`);
  fs.writeFileSync(dest, surf.output);
});
