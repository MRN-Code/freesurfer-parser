'use strict';

const moment = require('moment');
const reduce = require('lodash/reduce');
const padStart = require('lodash/padStart');

const regions = {
  'Left-Lateral-Ventricle': 4300,
  'Left-Inf-Lat-Vent': 300,
  'Left-Cerebellum-White-Matter': 19300,
  'Left-Cerebellum-Cortex': 45300,
  'Left-Thalamus-Proper': 7900,
  'Left-Caudate': 3880,
  'Left-Putamen': 5050,
  'Left-Pallidum': 1800,
  '3rd-Ventricle': 700,
  '4th-Ventricle': 1050,
  'Brain-Stem': 20100,
  'Left-Hippocampus': 4100,
  'Left-Amygdala': 1450,
  'CSF': 1100, // eslint-disable-line
  'Left-Accumbens-area': 650,
  'Left-VentralDC': 4000,
  'Left-vessel': 30,
  'Left-choroid-plexus': 1100,
  'Right-Lateral-Ventricle': 3000,
  'Right-Inf-Lat-Vent': 350,
  'Right-Cerebellum-White-Matter': 20300,
  'Right-Cerebellum-Cortex': 47000,
  'Right-Thalamus-Proper': 6800,
  'Right-Caudate': 3900,
  'Right-Putamen': 5000,
  'Right-Pallidum': 1500,
  'Right-Hippocampus': 4300,
  'Right-Amygdala': 1475,
  'Right-Accumbens-area': 625,
  'Right-VentralDC': 4050,
  'Right-vessel': 75,
  'Right-choroid-plexus': 1050,
  '5th-Ventricle': 0,
  'WM-hypointensities': 850,
  'Left-WM-hypointensities': 0,
  'Right-WM-hypointensities': 0,
  'non-WM-hypointensities': 10,
  'Left-non-WM-hypointensities': 0,
  'Right-non-WM-hypointensities': 0,
  'Optic-Chiasm': 220,
  'CC_Posterior': 820,
  'CC_Mid_Posterior': 375,
  'CC_Central': 500,
  'CC_Mid_Anterior': 420,
  'CC_Anterior': 775,
  'BrainSegVol': 1100000,
  'BrainSegVolNotVent': 1070000,
  'BrainSegVolNotVentSurf': 1070000,
  'lhCortexVol': 225000,
  'rhCortexVol': 221000,
  'CortexVol': 445000,
  'lhCorticalWhiteMatterVol': 218000,
  'rhCorticalWhiteMatterVol': 217500,
  'CorticalWhiteMatterVol': 435500,
  'SubCortGrayVol': 58000,
  'TotalGrayVol': 595000,
  'SupraTentorialVol': 950000,
  'SupraTentorialVolNotVent': 940000,
  'SupraTentorialVolNotVentVox': 940000,
  'MaskVol': 1579000,
  'BrainSegVol-to-eTIV': 0.75,
  'MaskVol-to-eTIV': 1.125,
  'lhSurfaceHoles': 85,
  'rhSurfaceHoles': 68,
  'SurfaceHoles': 150,
  'EstimatedTotalIntraCranialVol': 1400000,
};

class Generator {
  build(ursi, biases) {
    biases = biases || {};
    const header = `Measure:volume ${ursi}_${moment().format('YYYYMMDD')}`;
    return reduce(regions, (str, val, rgn) => {
      if (biases[rgn]) { val = val * biases[rgn]; }
      return `${str}${rgn} ${val}\n`;
    }, `${header}\n`);
  }
  randomURSIs(count, startNum) {
    count = count || 50;
    startNum = startNum || 0;
    let i = 0;
    const set = [];
    while (i < count) {
      set.push(`M${padStart((startNum + i + 1), 8, 0)}`);
      ++i;
    }
    return set;
  }
}

module.exports = Generator;
