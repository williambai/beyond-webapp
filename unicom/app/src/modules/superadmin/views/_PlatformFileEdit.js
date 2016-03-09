var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    browserTpl = require('../templates/_entityPlatformFile.tpl'),
	PlatformFile = require('../models/PlatformFile');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#pageForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new PlatformFile({_id: encodeURIComponent(options.id)});
		var page = $(browserTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
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

	submit: function() {
		if(window.confirm('修改文件将造成永久的改变，请先做好备份。您确信要修改吗？')){
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
		}
		return false;
	},

	cancel: function(){
		this.router.navigate('file/index',{trigger: true, replace: true});
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
			this.router.navigate('file/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		if(this.model.isNew()){
			this.$('.panel-title').text('新增模板');
			this.$('input[name=category][value=page]').attr('checked', true);
			this.$('input[name=name]').removeAttr('readonly');
		}
		return this;
	},
});