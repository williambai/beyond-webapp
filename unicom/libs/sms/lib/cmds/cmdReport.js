var A = require('../attributes');

function Report(srcNodeID, cmdTime, cmdSeq, ReportType, UserNumber, State, ErrCode){
  this.srcNodeID = srcNodeID;
  this.cmdTime = cmdTime;
  this.cmdSeq = cmdSeq;
  this.ReportType = ReportType;
  this.UserNumber = UserNumber;
  this.State = State;
  if (State === 2)
    this.ErrCode = ErrCode;
  else
    this.ErrCode = 0;
}
Report.code = 0x5;
Report.PDUAttrSeq = [A.srcNodeID, A.cmdTime, A.cmdSeq, A.ReportType, A.UserNumber, A.State, A.ErrCode];

Report.Resp = function(){};
Report.Resp.code = 0x80000005;
Report.Resp.PDUAttrSeq = [A.Result];

exports = module.exports = Report;

//unit test
if (process.argv[1] === __filename) {
    var CommandFactory = require('../commands');
    var Report = CommandFactory.create('Report');
  process.nextTick(function(){
    var msg = new Report(3020012474, 0528104520, 13, 0, '15620001781', 0);
    var PDU = msg.makePDU();
    var msgEcho = msg.parse(PDU);
    console.log(msg);
    console.log(PDU.slice(0, 20));
    console.log(PDU.slice(20));
    console.log(msgEcho);
  });
  process.nextTick(function(){
    var msg = new Report(3020012474, 0528104520, 13, 0, '15620001781', 2, 12);
    var PDU = msg.makePDU();
    var msgEcho = msg.parse(PDU);
    console.log(msg);
    console.log(PDU.slice(0, 20));
    console.log(PDU.slice(20));
    console.log(msgEcho);
  });
}