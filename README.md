# freesurfer-parser

[ ![Codeship Status for MRN-Code/freesurfer-parser](https://codeship.com/projects/3d985d20-3c93-0133-6289-3ebbb4d77cd4/status?branch=master)](https://codeship.com/projects/102291)

Parse a freesurfer volume file/string. By default, this will parse a string, setting the first line as the `header`. Any unexpected properties will be removed by default as well.

#Usage
```js
fileContent = fs.readFileSync('/path/to/file.txt').toString();
FreeSurfer = require('freesurfer-parser');

freeSurfer = new FreeSurfer({string: fileContent});

console.log(freeSurfer);
```

# Constructor Methods
### `new FreeSurfer(options)`
- @param {object} options may have the following keys:

  - **values**: Initial values to set on the returned object. _defaults to `null`_
  - **string**: A string from which to parse values. _defaults to `null`_
  - **headerCount**: The number of lines in `string` that contain header data.
_defaults to `0`_
  - **removeInvalidFields**: Whether to strip invalid fields after parsing.
_defaults to `true`
  - **validate**: Whether to validate all fields after parsing. _defaults to true_

- @return {object} FreeSurfer instance

### `FreeSufer.setEol(value)`
- @param {string} value to be used as the line-break character when parsing.
_defaults to `\n`_
- @returns {string} the previous value used as line-break

### `FreeSufer.setDelimiter(value)`
- @param {string} value to be used as the delimiting character between _ROI_ and _measured volume_.
_defaults to `/\s+/` (whitespace)_
- @returns {string} the previous value

### `FreeSufer.setDefaultHeaderCount(value)`
- @param {int} value to be used when assigning header rows during parsing.
_defaults to `1`_
- @returns {int} the previous value

# Instance Methods

### `setFromString(string, headerCount)`
- @param {string} string to be parsed
- @param {number} headerCount is the number of header lines to expect.
The header lines will be assigned to the 'header' property of the instance.
_defaults to 0_

- @return {object} self

This method merges the key/value pairs parsed from the string with the current instance.

### `trimInvalidFields()`
- @return {object} self

Remove any properties whose keys are not in the validFields of the schema (see _lib/schema.js_)

### `validate()`
- @return {object} self

Assert that the current object has only the requisite properties. Throws an error if assertion fails.

## Contributing
Please submit any changes to this repo (including additions and subtractions from the lint config files) as pull requests.

## TODO

- TODO: add option to create from readStream
