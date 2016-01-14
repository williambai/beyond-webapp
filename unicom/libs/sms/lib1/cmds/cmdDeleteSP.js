var A = require('../Attributes');
var util = require('../util');


function DeleteSP(SMGId, SPNumber, ServiceTag){
  util.msgInit(this, arguments);
}
DeleteSP.PDUAttrSeq = [A.SMGId, A.SPNumber, A.ServiceTag];

exports.Class = DeleteSP;