module.exports = exports = function(app, config,mongoose,nodemailer){
	var message = null;
	var Message = require('./Message');

	var messageSchema = new mongoose.Schema(Message.schema);
		messageSchema.set('collection', 'account-messages');

	return mongoose.model('AccountMessage', messageSchema);
};