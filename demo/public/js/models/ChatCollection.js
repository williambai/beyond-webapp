define(['models/Chat'],function(Chat){
	var ChatCollection = Backbone.Collection.extend({
		model: Chat
	});
	return ChatCollection;
});