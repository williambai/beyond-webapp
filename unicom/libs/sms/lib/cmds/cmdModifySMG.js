var A = require('../Attributes');
var util = require('../util');


function ModifyMSG(OldSMGId, NewSMGId, SMGIP, LoginName, LoginPassword){
  util.msgInit(this, arguments);
}
ModifyMSG.PDUAttrSeq = [A.OldSMGId, A.NewSMGId, A.SMGIP, A.LoginName, A.LoginPassword];

exports.Class = ModifyMSG;