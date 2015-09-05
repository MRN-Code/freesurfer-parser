# freesurfer-parser
Parse a freesurfer volume file.

#Usage
`fsParser = require('freesurfer-parser')`

# API
### parse(string)
Parses a string, returns an object

### parseStream(stream, callback)
Parses a _readStream_, calls callback, with signature `callback(err, object)`.
Also returns a _readStream_ that will emit an `end` event when the stream is
completely parsed. The parsed object will be accessible via `readStream.result`.

### validate(obj)
Validates that the object contains all necessary fields.

### trimInvalidFields(obj)
Removes any invalid fields from the object.
See index.js for an example.

## Contributing
Please submit any changes to this repo (including additions and subtractions from the lint config files) as pull requests. 
