var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Command = require('./command');
var Submit = function(){
	Command.call(this);
};
util.inherits(Submit, Command);

exports = module.exports = Submit;