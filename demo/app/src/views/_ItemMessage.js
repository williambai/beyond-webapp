var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    statusTemplate = require('../../assets/templates/_itemMessage.tpl'),
    commentFormTemplate = require('../../assets/templates/_formComment1.tpl'),
   	StatusView = require('./_ItemStatus');

Backbone.$ = $;

exports = module.exports = StatusView.extend({

	uiControl: {},

	initialize: function(options){
		this.account = options.account;
		this._convertContent();
		this._transformTime();
		if(this.model.get('fromId') == this.account.id){
			this.uiControl.showToUser = true;
		}else{
			this.uiControl.showToUser = false;
		}
	},

	render: function(){
		var that = this;
		this.$el.html(statusTemplate({ui: this.uiControl, model:this.model.toJSON()}));
		var votes = this.model.get('votes') || [];
		var comments = this.model.get('comments') || [];
		votes.forEach(function(vote){
			that.onVoterAdded(vote);
		});
		comments.forEach(function(comment){
			that.onCommenAdded(comment);
		});
		return this;
	}
});