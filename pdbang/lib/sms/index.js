var SMS = require('./lib/sms');
var Store = require('./lib/store');
var SGIP = require('./lib/sgip');

var sms = new SMS();
sms.sgip = new SGIP();
sms.store = new Store();
sms.start();

if(sms.verbose){
	sms.on('status', function(status){
		console.log(status);
	});
}

exports = module.exports = sms;