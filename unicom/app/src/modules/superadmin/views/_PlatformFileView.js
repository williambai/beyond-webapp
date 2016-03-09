var _ = require('underscore');
var Backbone = require('backbone'),
	$ = require('jquery'),
    browserTpl = require('../templates/_entityPlatformFile.tpl'),
	PlatformFile = require('../models/PlatformFile');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#dataView',

	initialize: function(options) {
		this.router = options.router;
		this.model = new PlatformFile({_id: encodeURIComponent(options.id)});
		var page = $(browserTpl);
		var viewTemplate = $('#viewTemplate', page).html();
		this.template = _.template(_.unescape(viewTemplate || ''));
		this.model.on('change', this.render ,this);
		this.on('load', this.load, this);
	},

	events: {
		'click .edit': 'editPlatformFile',
		'click .back': 'back',
	},

	load: function(){
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	editPlatformFile: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('file/edit/'+ encodeURIComponent(id),{trigger: true});
		return false;
	},

	back: function(){
		window.history.back();
		return false;
	},

	render: function(){
		//** 格式化 content
		// var content = this.model.get('content');
		// if(content) {
		// 	this.model.set('content', String.prototype.replace.call(content,/\n/g,'<br>'));
		// }
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});