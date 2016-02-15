var CommandFactory = require('./lib/commands');
var handler = require('./lib/handler');

exports = module.exports = {
	CommandFactory: CommandFactory,
	handle: handler
};
