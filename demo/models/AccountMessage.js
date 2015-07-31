module.exports = exports = function(app, config,mongoose,nodemailer){
	var message = null;
	var Message = require('./Message');

	var messageSchema = new mongoose.Schema(Message.schema);
		messageSchema.set('collection', 'account-messages');

	var AccountMessageModel = mongoose.model('AccountMessage', messageSchema);

	if(!message){
		message = new Message(AccountMessageModel)
	}
	return message;

	// return {
	// 	model: AccountMessageModel,
	// 	add: message.add,
	// 	addComment: message.addComment,
	// 	updateVoteGood: message.updateVoteGood,
	// 	getActivityById: message.getActivityById,
	// 	getStatusById: message.getStatusById,
	// 	getExchangeById: message.getExchangeById,
	// };
};