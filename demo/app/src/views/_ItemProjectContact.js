var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    contactTemplate = require('../../assets/templates/_itemProjectContact.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	tagName: 'div',

	addbutton: false,
	removeButton: false,

	events: {
		'click .addbutton': 'addContact',
		'click .removebutton': 'removeContact'
	},

	initialize: function(options){
		this.project = options.project;
		if(options.addButton){
			this.addButton = options.addButton;
		}
		if(options.removeButton){
			this.removeButton = options.removeButton;
		}
	},

	addContact: function(){
		var $responseArea = this.$('.actionArea');
		$.ajax({
				url: '/projects/'+ this.project.get('_id') +'?type=contact_add',
				type: 'PUT',
				data: {
					cid: this.model.get('_id')
				},
			}).done(function onSuccess(){
				$responseArea.text('已添加成功！');
			}).fail(function onError(){
				$responseArea.text('添加失败！');
			});
		return false;
	},

	removeContact: function(){
		if(confirm('确认移除'+ this.model.get('username')+'用户吗？')){
			var $responseArea = this.$('.actionArea');
			$responseArea.text('正在移除....');
			$.ajax({
					url: '/projects/'+ this.project.get('_id') +'?type=contact_remove'
					,type: 'PUT'
					,data: {
						cid: this.model.get('_id')
					}
				}).done(function onSuccess(){
					$responseArea.text('移除成功！')
				}).fail(function onError(){
					$responseArea.text('移除失败');
				});
			return false;
		}
	},


	render: function(){
		this.$el.html(contactTemplate({
			project: this.project.toJSON(),
			model: this.model.toJSON(),
			addButton: this.addButton,
			removeButton: this.removeButton
		}));
		return this;
	}

});