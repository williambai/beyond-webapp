var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    accountItemTemplate = require('../../assets/templates/_itemAccount.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	tagName: 'div',

	initialize: function(options){
	},

	events: {
		'click .addbutton': 'addFriend',
	},

	addFriend: function(){
		var $responseArea = this.$('.actionArea');

		$.ajax({
				url: config.api.host + '/friends/account/me',
				type: 'POST',
				data: {
					fid: this.model.get('_id')
				}
			}).done(function onSuccess(){
				$responseArea.text('已邀请！');
			}).fail(function onError(){
				$responseArea.text('邀请失败！');
			});
		return false;
	},

	render: function(){
		this.$el.html(accountItemTemplate({
			model: this.model.toJSON(),
			addButton: this.addButton,
			removeButton: this.removeButton
		}));
		return this;
	}

});