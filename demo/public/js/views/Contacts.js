define(['text!templates/_layout.html','text!templates/contacts.html','views/Contact'],
	function(layoutTemplate,contactsTemplate, ContactView){
	var ContactsView = Backbone.View.extend({
		el: $('#content'),
		
		template: _.template(contactsTemplate),
		
		initialize: function(){
			this.collection.on('add', this.contactAdded, this);
			this.collection.on('reset', this.contactCollectionReset, this);
		},

		contactAdded: function(contact){
			var contactHtml = (new ContactView({model: contact,removeButton:true})).render().el;
			$(contactHtml).appendTo('#contactlist').hide().fadeIn('slow');
		},

		contactCollectionReset: function(collection){
			var that = this;
			collection.each(function(contact){
				that.contactAdded(contact);
			});
		},

		render: function(){
			this.$el.html(layoutTemplate);
			this.$el.find('#main').html(this.template());
			return this;
		}

	});

	return ContactsView;
});