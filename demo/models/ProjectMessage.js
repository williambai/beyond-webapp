module.exports = exports = function(app, config,mongoose,nodemailer){
	var message = null;
	var Message = require('./Message');

	var messageSchema = new mongoose.Schema(Message.schema);
		messageSchema.set('collection', 'project-messages');

	var ProjectMessage = mongoose.model('ProjectMessage', messageSchema);

	if(!message){
		message = new Message(ProjectMessage)
	}
	return message;
};