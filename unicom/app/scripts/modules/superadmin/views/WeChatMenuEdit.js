var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Backbone = require('backbone'),
    menuTpl = require('../templates/_entityWeChatMenu.tpl');
var config = require('../conf');
Backbone.$ = $;

//** 模型
var Menu = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: function(){
		return config.api.host + '/protect/wechat/'+ this.get('wid') + '/menus';
	},
});
exports = module.exports = FormView.extend({

	el: '#menuForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new Menu({_id: options.id, wid: options.wid});
		var page = $(menuTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'keyup input[name="path"]': 'getMenus',
		'click .menu': 'selectMenu',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		if(this.model.isNew()){
			this.modelFilled = true;
			return;
		}
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	inputText: function(evt){
		var that = this;
		//clear error
		this.$(evt.currentTarget).parent().removeClass('has-error');
		this.$(evt.currentTarget).parent().find('span.help-block').empty();
		var arr = this.$(evt.currentTarget).serializeArray();
		_.each(arr,function(obj){
			var error = that.model.preValidate(obj.name,obj.value);
			if(error){
				//set error
				this.$(evt.currentTarget).parent().addClass('has-error');
				this.$(evt.currentTarget).parent().find('span.help-block').text(error);				
			}
		})
		return false;
	},

	getMenus: function(evt){
		this.$('#menus').empty();
		var that = this;
		var searchStr = this.$(evt.currentTarget).val() || '';
		if(searchStr.length >1){
			$.ajax({
				url: config.api.host + '/protect/wechat/'+ this.model.get('wid') +'/menus?action=search&searchStr=' + searchStr,
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
			}).done(function(data){
				data = data || [];
				var menusView = '<ul>';
				data.forEach(function(item){
					menusView += '<li class="menu" id="'+ item._id +'">' + item.path + '</li>';
				});
				menusView += '</ul>';
				that.$('#menus').html(menusView);
			});				
		}
		return false;
	},

	selectMenu: function(evt){
		var id = this.$(evt.currentTarget).attr('id');
		var path = this.$(evt.currentTarget).text();
		this.$('input[name="parent"]').val(id);
		this.$('input[name="path"]').val(path);
		this.$('#menus').empty();
		return false;
	},

	submit: function() {
		var that = this;
		//clear errors
		this.$('.form-group').removeClass('has-error');
		this.$('.form-group').find('span.help-block').empty();
		var arr = this.$('form').serializeArray();
		var errors = [];
		_.each(arr,function(obj){
			var error = that.model.preValidate(obj.name,obj.value);
			if(error){
				errors.push(error);
				that.$('[name="' + obj.name + '"]').parent().addClass('has-error');
				that.$('[name="' + obj.name + '"]').parent().find('span.help-block').text(error);
			}
		});
		if(!_.isEmpty(errors)) return false;
		//validate finished.

		var object = this.$('form').serializeJSON();
		this.model.set(object);
		// console.log(this.model.attributes);

		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},
	

	cancel: function(){
		this.router.navigate('wechat/'+ this.model.get('wid') + '/menu/index',{trigger: true, replace: true});
		return false;
	},

	//fetch event: done
	done: function(response){
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
		}else{
			//second fetch: submit
			this.router.navigate('wechat/'+ this.model.get('wid') + '/menu/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		if(this.model.isNew()) this.$('.panel-title').text('新增菜单');
		var category = this.model.get('category');
		this.$('input[name="category"][value="'+ category +'"]').attr('checked',true);
		var status = this.model.get('status');
		this.$('input[name="status"][value="'+ status +'"]').attr('checked',true);
		return this;
	},
});