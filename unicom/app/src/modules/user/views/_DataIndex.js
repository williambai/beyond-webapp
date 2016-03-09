var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    dataTpl = require('../templates/_entityData.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var SearchView = require('./_DataSearch');
var ListView = require('./_DataList');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(dataTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));

		this.on('load', this.load, this);
	},

	events: {
		'click #g2': 'listG2',
		'click #g3': 'listG3',
		'click #g4': 'listG4',
		'scroll': 'scroll',
		'click .search': 'search',
		'click .view': 'dataView',
		'click .wechat': 'wechat',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.$('#search').hide();
		this.searchView = new SearchView({
			el: '#search',
		});
		this.listView = new ListView({
			el: '#list',
		});
		this.searchView.trigger('load');
		this.searchView.done = function(search){
			console.log(search);
			that.$('#search').hide();
		};
		this.listView.collection.url = config.api.host + '/channel/product/directs?type=category&category=2G';
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	listG2: function(){
		this.$('#g2').removeClass('btn-default').addClass('btn-success');
		this.$('#g3').removeClass('btn-success').addClass('btn-default');
		this.$('#g4').removeClass('btn-success').addClass('btn-default');
		this.listView.trigger('refresh', 'type=category&category=2G');
		return false;
	},

	listG3: function(){
		this.$('#g2').removeClass('btn-success').addClass('btn-default');
		this.$('#g3').removeClass('btn-default').addClass('btn-success');
		this.$('#g4').removeClass('btn-success').addClass('btn-default');
		this.listView.trigger('refresh','type=category&category=3G');
		return false;
	},

	listG4: function(){
		this.$('#g2').removeClass('btn-success').addClass('btn-default');
		this.$('#g3').removeClass('btn-success').addClass('btn-default');
		this.$('#g4').removeClass('btn-default').addClass('btn-success');
		this.listView.trigger('refresh','type=category&category=4G');
		return false;
	},

	search: function(){
		this.$('#search').show();
		return false;
	},

	dataView: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('data/view/'+ id,{trigger: true});
		return false;
	},

	wechat: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		window.location.href = config.api.host + '/sale/page/data/' + config.wechat.appid + '/' + id + '/' + this.router.account.id;
		return false;
	},
	
	render: function() {
		if (!this.loaded) {
			this.$el.html(this.loadingTemplate());
		} else {
			this.$el.html(this.template());
		}
		return this;
	},
});