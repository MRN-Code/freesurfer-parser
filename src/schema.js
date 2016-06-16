'use strict';

const joi = require('joi');

const validFields = [
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
  'EstimatedTotalIntraCranialVol',
  'header',
];

const keys = validFields.reduce((res, val) => {
  res[val] = joi.number().required();
  return res;
}, {});

keys.header = joi.string().optional();

module.exports = { schema: joi.object().keys(keys), validFields };
