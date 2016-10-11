var nodeId = 0x1;
var getTimeStamp = function(){

};
var getSequence = function(){

};

var Command = function(){
	this.nodeId = nodeId;
	this.timestamp = getTimeStamp();
	this.sequence = getSequence();
};

exports = module.exports = Command;