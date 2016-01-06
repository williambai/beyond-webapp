var A = require('../Attributes');
var util = require('../util');


function DeleteMSG(SMGId){
  util.msgInit(this, arguments);
}
DeleteMSG.PDUAttrSeq = [A.SMGId];


exports.Class = DeleteMSG;