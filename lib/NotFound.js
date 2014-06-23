var util = require('util');

function NotFound(msg) {
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}
util.inherits(NotFound, Error);
module.exports = NotFound;