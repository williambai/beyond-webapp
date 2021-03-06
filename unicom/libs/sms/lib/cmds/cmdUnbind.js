var A = require('../attributes');

var Unbind = function(){

};
Unbind.code = 0x2;
Unbind.PDUAttrSeq = [];

Unbind.Resp = function(){

};
Unbind.Resp.code = 0x80000002
Unbind.Resp.PDUAttrSeq = [];

exports =module.exports = Unbind;

//unit test
if (process.argv[1] === __filename) {
  process.nextTick(function(){
  	var CommandFactory = require('../commands');
    var Unbind = CommandFactory.create('Unbind');
    var msg = new Unbind();
    var PDU = msg.makePDU().slice(0,20);
    //** unbind只有20个字节
    PDU.writeUInt32BE(20, 0);
    var msgEcho = CommandFactory.parse(PDU);
    console.log(msg);
    console.log(PDU.slice(0, 20));
    console.log(PDU.slice(20));
    console.log(msgEcho);
  });
}