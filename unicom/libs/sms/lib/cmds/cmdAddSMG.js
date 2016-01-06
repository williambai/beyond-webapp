var A = require('../Attributes');
var util = require('../util');

function AddSMG(SMGId, SMGIP, LoginName, LoginPassword){
  util.msgInit(this, arguments);
}
AddSMG.PDUAttrSeq = [A.SMGId, A.SMGIP, A.LoginName, A.LoginPassword];

exports.Class = AddSMG;