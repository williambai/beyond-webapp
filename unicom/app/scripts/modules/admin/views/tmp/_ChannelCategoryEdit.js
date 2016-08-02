var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    channelCategoryTpl = require('../templates/_entityChannelCategory.tpl'),
	ChannelCategory = require('../models/ChannelCategory');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#strategyForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new ChannelCategory({_id: options.id});
		var page = $(channelCategoryTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	submit: function() {
		var that = this;
		var object = this.$('form').serializeJSON();
		this.model.set(object);
		if(object.status.code == 0){
			object.status.message = '无效';
		}else{
			object.status.message = '有效';
		}
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},
	

	cancel: function(){
		this.router.navigate('channel/category/index',{trigger: true, replace: true});
		return false;
	},
	
	//fetch event: done
	done: function(response){
		var that = this;
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
			$.ajax({
				url: config.api.host + '/protect/features',
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
			}).done(function(data){
				data = data || [];
				var checkboxs = '';
				data.forEach(function(item){
					checkboxs += '<input type="checkbox" name="features[]" value="'+ item.nickname +'">&nbsp;&nbsp;'+ item.name +'&nbsp;&nbsp;<br/>';
				});
				that.$('#features').html(checkboxs);
				var features = that.model.get('features') || [];
				features.forEach(function(item){
					that.$('input[name="features[]"][value='+ item + ']').attr('checked', true);
				});
			});
		}else{
			//second fetch: submit
			window.location.hash = 'channel/category/index';
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		var status = this.model.get('status');
		if(status.code == 1){
			this.$('input[name="status[code]"]').attr('checked',true);
		}
		return this;
	},
});