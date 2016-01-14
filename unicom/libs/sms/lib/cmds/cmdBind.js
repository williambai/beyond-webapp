var A = require('../attributes');

function Bind(LoginType, LoginName, LoginPassword) {
	this.LoginType = LoginType;
	this.LoginName = LoginName;
	this.LoginPassword = LoginPassword;
}
Bind.code = 0x1;
Bind.PDUAttrSeq = [A.LoginType, A.LoginName, A.LoginPassword];

Bind.Resp = function(){

};
Bind.Resp.code = 0x80000001;
Bind.Resp.PDUAttrSeq = [A.Result];

exports = module.exports = Bind;

//unit test
if (process.argv[1] === __filename) {
	var util = require('util');
	process.nextTick(function() {
		var CommandFactory = require('../commands');
		var BindMessage = CommandFactory.create('Bind');
		console.log(util.inspect(BindMessage));
		console.log(util.inspect(BindMessage.prototype));
		var msg = new BindMessage(1, 'william', 'pass');
		console.log(msg);
		var PDU = msg.makePDU();		
		console.log(PDU.slice(0, 20));
		console.log(PDU.slice(20));
		var msgEcho = CommandFactory.parse(PDU);
		console.log(msgEcho);
		console.log(msgEcho instanceof Bind);
	});
}