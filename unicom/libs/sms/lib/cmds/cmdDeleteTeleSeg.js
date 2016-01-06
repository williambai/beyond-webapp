var A = require('../Attributes');
var util = require('../util');


function DeleteTeleSeg(SMGId, TeleSeg){
  util.msgInit(this, arguments);
}
DeleteTeleSeg.PDUAttrSeq = [A.SMGId, A.TeleSeg];

exports.Class = DeleteTeleSeg;