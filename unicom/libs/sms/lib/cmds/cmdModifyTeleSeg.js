var A = require('../Attributes');
var util = require('../util');


function ModifyTeleSeg(SMGId, OldTeleSeg, NewTeleSeg, NewTeleType, NewAreaCode){
  util.msgInit(this, arguments);
}
ModifyTeleSeg.PDUAttrSeq = [A.SMGId, A.OldTeleSeg, A.NewTeleSeg, A.NewTeleType, A.NewAreaCode];

exports.Class = ModifyTeleSeg;