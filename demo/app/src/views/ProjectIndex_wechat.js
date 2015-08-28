var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    projectIndexTemplate = require('../../assets/templates/projectIndex_wechat.tpl'),
    ProjectCheckInView = require('./ProjectCheckIn_wechat'),
    Project = require('../models/Project');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options){
		this.pid = options.pid;
		this.originid = options.originid;
		this.model = new Project();
		this.model.url = '/projects/' + options.pid;
		this.model.on('change', this.render,this);
		this.on('load', this.load,this);
	},

	events: {
		'click .checkin': 'checkIn',
	},

	load: function(){
		this.model.fetch();
	},

	checkIn: function(){
		var that = this;
		$.ajax('/wechat/project/update?originid=' + this.originid + '&pid=' + that.model.get('_id') + '&pname=' + that.model.get('name'), {
			mathod: 'GET',
			success: function(data){
				var projectCheckInView = new ProjectCheckInView({model: that.model});
				projectCheckInView.render();
			},
			error: function(){
				window.location.reload();
			}
		});
		return false;
	},

	render: function(){
		this.$el.html(projectIndexTemplate({
				project: this.model.toJSON(),
				contacts_num: this.model.get('contacts') ? this.model.get('contacts').length : 0
			}));
		return this;
	}
});