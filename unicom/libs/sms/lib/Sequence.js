var time = 'mmddhhmmss';
// var curSeq = 0xffffffff;
var curSeq = 0x7fffff00;

function genNextSeq(buf, NodeID) {
	var d = new Date();
	var mTime = 0;
	mTime = mTime * 100 + (d.getMonth() + 1);
	mTime = mTime * 100 + d.getDate();
	mTime = mTime * 100 + d.getHours();
	mTime = mTime * 100 + d.getMinutes();
	mTime = mTime * 100 + d.getSeconds();
	buf.writeUInt32BE(NodeID, 8);
	buf.writeUInt32BE(mTime, 12);
	// curSeq = (curSeq > 0x7fffff00) ? 0 : curSeq + 1;
	curSeq = (curSeq < 0x00000f00) ? 0x7fffff00 : curSeq - 1;
	buf.writeUInt32BE(curSeq, 16);
	return buf;
};

function genNextSeqSplit(buf) {
	curSeq++;
	buf.writeUInt32BE(curSeq, 16);
	return buf;
};

function readSeq(buf, offset) {
	offset = offset || 0;
	return {
		srcNodeID: buf.readUInt32BE(offset + 8),
		cmdTime: buf.readUInt32BE(offset + 12),
		cmdSeq: buf.readUInt32BE(offset + 16)
	};
};

exports = module.exports = {
	genNextSeq: genNextSeq,
	genNextSeqSplit: genNextSeqSplit,
	readSeq: readSeq,
};

//unit test
if (process.argv[1] === __filename) {
	for (var i = 0; i < 2; i++) {
		var buf = new Buffer(20);
		buf.fill(0);
		console.log(genNextSeq(buf));
		console.log(readSeq(buf));
	}
	var date = (new Date()).getTime()
	console.log(date);
}