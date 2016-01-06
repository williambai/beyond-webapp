var A = require('../Attributes');
var util = require('../util');

function AddTeleSeg(SMGId, TeleSeg, TeleType, AreaCode){
  util.msgInit(this, arguments);
}
AddTeleSeg.PDUAttrSeq = [A.SMGId, A.TeleSeg, A.TeleType, A.AreaCode];

exports.Class = AddTeleSeg;
