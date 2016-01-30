var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    feedbackTpl = require('../templates/_entityFeedback.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var Feedback = require('../models/Feedback');
var ListView = require('./_FeedbackList');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(feedbackTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addFeedback',
		// 'click .edit': 'editFeedback',
		'click .delete': 'removeFeedback',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new ListView({
			el: '#list',
		});
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	addFeedback: function(){
		this.router.navigate('feedback/add',{trigger: true});
		return false;
	},

	// editFeedback: function(evt){
	//	var id = this.$(evt.currentTarget).closest('.media').attr('id');
	// 	this.router.navigate('feedback/edit/'+ id,{trigger: true});
	// 	return false;
	// },

	removeFeedback: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).closest('.media').attr('id');
			var model = new Feedback({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	render: function() {
		var that = this;
		if (!this.loaded) {
			this.$el.html(this.loadingTemplate());
		} else {
			this.$el.html(this.template());
		}
		return this;
	},
});