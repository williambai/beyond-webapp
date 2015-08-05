define(['text!templates/contactAdd.html','views/_ItemContact','models/Contact'], 
	function(addContactTemplate,ContactView,Contact){
	var AddContactView = Backbone.View.extend({
		el: '#content',
		template: _.template(addContactTemplate),

		initialize: function(options){
			this.account = options.account;
		},

		events: {
			'submit form': 'search'
		},

		search: function(){
			var emailDomain = this.account.email.substr(this.account.email.indexOf('@'));
			var that = this;
			$.post('/contacts/find',{
					searchStr: $('input[name=searchStr]').val() + emailDomain,
				},function onSucess(data){
					that.render(data);
				}).error(function(){
					$('#results').text('没有找到。');
					$('#results').slidedown();
				});
			return false;
		},

		render: function(resultList){
			this.$el.html(this.template({account: this.account}));
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