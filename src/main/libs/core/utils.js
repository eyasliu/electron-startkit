const fs = require('fs');
const path = require('path');

module.exports = {
  requireAll(dir) {
    dir = path.resolve(dir || '');

    let files;

    try {
      files = fs.readdirSync(dir);
    } catch (err) {
      return {};
    }
  }
}