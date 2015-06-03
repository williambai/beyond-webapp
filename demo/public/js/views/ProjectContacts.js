define(['text!templates/projectContacts.html','views/ProjectContact'],
	function(contactsTemplate, ContactView){
	var ContactsView = Backbone.View.extend({
		el: '#content',
		
		template: _.template(contactsTemplate),
		
		initialize: function(options){
			this.pid = options.pid;
			this.collection.on('add', this.contactAdded, this);
			this.collection.on('reset', this.contactCollectionReset, this);
		},

		contactAdded: function(contact){
			var contactHtml = (new ContactView({pid: this.pid, model: contact,removeButton:true})).render().el;
			$(contactHtml).appendTo('#contactlist').hide().fadeIn('slow');
		},

		contactCollectionReset: function(collection){
			var that = this;
			collection.each(function(contact){
				that.contactAdded(contact);
			});
		},

		render: function(){
			this.$el.html(this.template({model:{_id: this.pid}}));
			return this;
		}

	});

	return ContactsView;
});