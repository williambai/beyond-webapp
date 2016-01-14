var A = require('../Attributes');
var util = require('../util');


function AddSP(SMGId, SPNumber, ServiceTag, CorpId){
  util.msgInit(this, arguments);
}
AddSP.PDUAttrSeq = [A.SMGId, A.SPNumber, A.ServiceTag, A.CorpId];

exports.Class = AddSP;
