define(['text!templates/projectContactSearch.html','views/ProjectContact','models/Contact'], 
	function(addContactTemplate,ContactView,Contact){
	var AddContactView = Backbone.View.extend({
		el: '#content',
		template: _.template(addContactTemplate),

		events: {
			'submit form': 'search'
		},
		initialize: function(options){
			this.pid = options.pid;
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
			var that = this;
			this.$el.html(this.template({model:{_id: this.pid}}));
			if(null != resultList){
				_.each(resultList, function(contactJson){
					var contact = new Contact(contactJson);
					var contactHtml = (new ContactView({pid:that.pid, model: contact,addButton: true})).render().el;
					$('#results').append(contactHtml);
				});
			}
			return this;
		}
	});

	return AddContactView;
});