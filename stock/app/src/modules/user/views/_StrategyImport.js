var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery'),
    strategyTpl = require('../templates/_entityStrategy.tpl'),
    SearchView = require('./__SearchView');
var config = require('../conf');

var SearchModel = Backbone.Model.extend({

});

exports = module.exports = SearchView.extend({
	el: '#import',

	initialize: function(options){
		var page = $(strategyTpl);
		var importTemplate = $('#importTemplate', page).html();
		this.template = _.template(_.unescape(importTemplate || ''));
		this.model = new SearchModel();
		this.on('load', this.load,this);
	},

	events: {
		'change input[name=file]': 'upload',
		'submit form': 'submt',
	},

	load: function(){
		this.render();
	},

	upload: function(evt) {
		var that = this;
		var formData = new FormData();
		formData.append('files', evt.currentTarget.files[0]);
		// $.ajax({
		// 	url: config.api.host + '/upload',
		// 	type: 'PUT',
		// 	xhrFields: {
		// 		withCredentials: true
		// 	},
		// 	data: formData,
		// 	cache: false, //MUST be false
		// 	processData: false, //MUST be false
		// 	contentType: false, //MUST be false
		// }).done(function(data) {
		// 	that.model.set('avatar', data);
		// }).fail(function(err) {
		// 	console.log(err);
		// });
		return false;
	},

	submit: function(){
		var object = this.$('form').serialize();
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
	},
});