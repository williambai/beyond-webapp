define(['text!templates/projectContactSearch.html','views/_ItemProjectContact','models/Project','models/Contact'], 
	function(addContactTemplate,ContactView,Project,Contact){
	var AddContactView = Backbone.View.extend({
		el: '#content',
		template: _.template(addContactTemplate),

		events: {
			'submit form': 'search'
		},
		initialize: function(options){
			this.pid = options.pid;
			this.account = options.account;
			this.project = new Project();
			this.project.url = '/projects/' + options.pid;
			var that = this;
			this.project.fetch({
				success: function(model){
					if(that.account.id == model.get('accountId')){
						model.set('isOwner', true);
					}
				}
			});
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
			var that = this;
			this.$el.html(this.template({model:{_id: this.pid}}));
			if(null != resultList){
				_.each(resultList, function(contactJson){
					var contact = new Contact(contactJson);
					var contactHtml = (new ContactView({project:that.project, model: contact,addButton: true})).render().el;
					$('#results').append(contactHtml);
				});
			}
			return this;
		}
	});

	return AddContactView;
});