/**
 * Recursively update dependencies in `package.json` files, excluding
 * those inside `node_modules` directories.
 */

var $ = require('fsquery');

var dep = process.argv[2];
var version = process.argv[3];

$('!node_modules package.json')
  .read(JSON.parse)
  .each(function(path, data) {
    if (data.dependencies && data.dependencies[dep]) {
      data.dependencies[dep] = version;
    }
  })
  .write(JSON.stringify)
  .done();
