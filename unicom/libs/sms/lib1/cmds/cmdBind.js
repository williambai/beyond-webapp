var A = require('../Attributes');
var util = require('util');

function Bind(LoginType, LoginName, LoginPassword){
  this.LoginType = LoginType;
  this.LoginName = LoginName;
  this.LoginPassword = LoginPassword;
}
Bind.PDUAttrSeq = [A.LoginType, A.LoginName, A.LoginPassword];

exports.Class = Bind;

//unit test
if (process.argv[1] === __filename) {
  process.nextTick(function(){
    // console.log(util.inspect(Bind));
    var Msg = require('../Commands').Msg;
    var msg = new Bind(1, 'kaven', 'psp');
    // console.log(util.inspect(Bind));
    var PDU = msg.makePDU();
    var msgEcho = Msg.parse(PDU);
    console.log(msg);
    console.log(PDU.slice(0, 20));
    console.log(PDU.slice(20));
    console.log(msgEcho);
  });
}