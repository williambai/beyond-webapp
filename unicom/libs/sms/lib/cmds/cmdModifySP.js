var A = require('../Attributes');
var util = require('../util');


function ModifySP(SMGId, OldSPNumber, OldServiceTag, NewSPNumber, NewServiceTag, CorpId){
  util.msgInit(this, arguments);
}
ModifySP.PDUAttrSeq = [A.SMGId, A.OldSPNumber, A.OldServiceTag, A.NewSPNumber, A.NewServiceTag, A.CorpId];

exports.Class = ModifySP;