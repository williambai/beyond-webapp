var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Command = require('./command');
var Unbind = function(){
	Command.call(this);
};
util.inherits(Unbind, Command);

exports = module.exports = Unbind;