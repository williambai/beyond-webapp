var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    recordIndexTemplate = require('../../assets/templates/recordIndex.tpl'),
    SearchRecordView = require('./_SearchRecord'),
    RecordListView = require('./_ListRecord');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({
	
	el: '#content',

	initialize: function(options){
		this.url = options.url;
		this.account = options.account;
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
	},

	load: function(){
		var that = this;
		this.recordListView = new RecordListView({
			account: this.account,
			url: config.api.host + this.url
		});

		this.searchRecordView = new SearchRecordView();
		this.searchRecordView.done = function(url){
			that.recordListView.trigger('refresh', url);
		};
		this.recordListView.trigger('load');
	},

	scroll: function(){
		this.recordListView.scroll();
		return false;
	},

	render: function(){
		this.$el.html(recordIndexTemplate());
		return this;
	}
});
