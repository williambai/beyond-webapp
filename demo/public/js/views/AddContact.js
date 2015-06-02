define(['text!templates/addContact.html','views/Contact','models/Contact'], 
	function(addContactTemplate,ContactView,Contact){
	var AddContactView = Backbone.View.extend({
		el: '#content',
		template: _.template(addContactTemplate),

		events: {
			'submit form': 'search'
		},

		search: function(){
			var view = this;
			$.post('/contacts/find',{
					searchStr: $('input[name=searchStr]').val()
					// this.$('form').serialize()
				},function onSucess(data){
					view.render(data);
				}).error(function(){
					$('#results').text('没有找到。');
					$('#results').slidedown();
				});
			return false;
		},

		render: function(resultList){
			this.$el.html(this.template());
			if(null != resultList){
				_.each(resultList, function(contactJson){
					var contact = new Contact(contactJson);
					var contactHtml = (new ContactView({model: contact,addButton: true})).render().el;
					$('#results').append(contactHtml);
				});
			}
			return this;
		}
	});

	return AddContactView;
});