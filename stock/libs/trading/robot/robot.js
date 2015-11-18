var _ = require('underscore');
var shell = require('shelljs');
var robotJS = require("robotjs");

var Robot = function(options){
	this.options = options || {};
	_.extend(this, Robot);
	return this;
};

Robot.open = function(){
	shell.exec('open "/Applications/Microsoft Office 2011/Microsoft Word.app"');
};

Robot.buy = function(symbol,price,amount,done){
	this.open();
	robotJS.setMouseDelay(1000);
	// robotJS.moveMouse(300,300);
	robotJS.mouseClick();
	robotJS.keyTap('home');
	robotJS.setKeyboardDelay(1000);
	robotJS.keyTap('down');
	robotJS.setKeyboardDelay(1000);
	robotJS.typeString('buy ' + symbol + ' at: ' + price + ' by ' + amount);
	done();
};

Robot.sell = function(symbol,price,amount,done){
	this.open();
	robotJS.setMouseDelay(1000);
	// robotJS.moveMouse(300,300);
	robotJS.mouseClick();
	robotJS.keyTap('home');
	robotJS.setKeyboardDelay(1000);
	robotJS.keyTap('down');
	robotJS.setKeyboardDelay(1000);
	robotJS.typeString('sell ' + symbol + ' at: ' + price + ' by ' + amount);
	done();
};

Robot.verify = function(data, done){
	done(null,true);
};

Robot.confirm = function(strategy,done){
	this.open();
	robotJS.setMouseDelay(1000);
	// robotJS.moveMouse(300,300);
	robotJS.mouseClick();
	robotJS.typeString(strategy.symbol + ' confirm done.');
	done();
};

exports = module.exports = Robot;