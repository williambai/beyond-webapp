var A = require('../Attributes');

function Unbind(){

}
Unbind.PDUAttrSeq = [];


function UnbindResp(){

}
UnbindResp.PDUAttrSeq = [];

Unbind.Resp = UnbindResp;
exports.Class = Unbind;

//unit test
if (process.argv[1] === __filename) {
  process.nextTick(function(){
    var Msg = require('../Commands').Msg;
    var msg = new Unbind(1, 'kaven', 'psp');
    var PDU = msg.makePDU();
    var msgEcho = Msg.parse(PDU);
    console.log(msg);
    console.log(PDU.slice(0, 20));
    console.log(PDU.slice(20));
    console.log(msgEcho);
  });
}