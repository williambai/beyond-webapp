define(['text!templates/projectContact.html'],function(contactTemplate){
	var ContactView = Backbone.View.extend({
		tagName: 'li',
		template: _.template(contactTemplate),

		addbutton: false,
		removeButton: false,

		events: {
			'click .addbutton': 'addContact',
			'click .removebutton': 'removeContact'
		},

		initialize: function(options){
			this.pid = options.pid;
			if(options.addButton){
				this.addButton = options.addButton;
			}
			if(options.removeButton){
				this.removeButton = options.removeButton;
			}
		},

		addContact: function(){
			var $responseArea = this.$('.actionArea');

			$.post('/projects/'+ this.pid +'/contacts'
				,{contactId: this.model.get('_id')}
				,function onSuccess(){
					$responseArea.text('已添加成功！');
				}
				,function onError(){
					$responseArea.text('添加失败！');
				});
			return false;
		},

		removeContact: function(){
			var $responseArea = this.$('.actionArea');
			$responseArea.text('正在移除....');
			$.ajax({
					url: '/projects/'+ this.pid +'/contacts/' + this.model.get('_id')
					,type: 'DELETE'
					,data: {
						contactId: this.model.get('accountId')
					}
				}).done(function onSuccess(){
					$responseArea.text('移除成功！')
				}).fail(function onError(){
					$responseArea.text('移除失败');
				});
			return false;
		},


		render: function(){
			this.$el.html(this.template({
				model: this.model.toJSON(),
				addButton: this.addButton,
				removeButton: this.removeButton
			}));
			return this;
		}

	});

	return ContactView;
});