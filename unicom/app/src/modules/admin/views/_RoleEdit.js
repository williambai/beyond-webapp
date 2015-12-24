var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    roleTpl = require('../templates/_entityRole.tpl'),
	Role = require('../models/Role');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#roleForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new Role({_id: options.id});
		var page = $(roleTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'click input[type=text]': 'inputText',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		if(this.model.isNew()){
			//get features
			this.loadFeatures();
			this.modelFilled = true;
			return;
		}
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});

	},

	loadFeatures: function(callback){
		var that = this;
		$.ajax({
			url: config.api.host + '/platform/features?app=admin',
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
		}).done(function(data){
			data = data || [];
			var checkboxs = '';
			data.forEach(function(item){
				checkboxs += '<input type="checkbox" id='+ item.nickname +'">&nbsp;'+ item.name +'&nbsp;';
				checkboxs += '<div style="padding-left:30px;">'
				checkboxs += '<input type="checkbox" name="grant['+ item.nickname +'][getOne]" value="true">&nbsp;&nbsp;查看单条&nbsp;&nbsp;';
				checkboxs += '<input type="checkbox" name="grant['+ item.nickname +'][getMore]" value="true">&nbsp;&nbsp;查看多条&nbsp;&nbsp;';
				checkboxs += '<input type="checkbox" name="grant['+ item.nickname +'][add]" value="true">&nbsp;&nbsp;新增&nbsp;&nbsp;';
				checkboxs += '<input type="checkbox" name="grant['+ item.nickname +'][update]" value="true">&nbsp;&nbsp;修改&nbsp;&nbsp;';
				checkboxs += '<input type="checkbox" name="grant['+ item.nickname +'][remove]" value="true">&nbsp;&nbsp;删除&nbsp;&nbsp;';
				checkboxs += '</div>';
				checkboxs += '<input type="hidden" name="grant[' + item.nickname + '][name]" value="' + item.name + '">' ;
				checkboxs += '<input type="hidden" name="grant[' + item.nickname + '][nickname]" value="' + item.nickname + '">' ;
				checkboxs += '<input type="hidden" name="grant[' + item.nickname + '][route]" value="' + item.route + '">' ;
			}); 
			that.$('#features').html(checkboxs);
			callback && callback();
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
		this.router.navigate('role/index',{trigger: true, replace: true});
		return false;
	},
	
	//fetch event: done
	done: function(response){
		var that = this;
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
			//get features
			this.loadFeatures(function(){
				//set features
				var features = that.model.get('grant');
				_.each(features,function(feature){
					if(feature.getOne){
						that.$('input[name="grant[' + feature.nickname + '][getOne]"]').attr('checked', true);
					}
					if(feature.getMore){
						that.$('input[name="grant[' + feature.nickname + '][getMore]"]').attr('checked', true);
					}
					if(feature.add){
						that.$('input[name="grant[' + feature.nickname + '][add]"]').attr('checked', true);
					}
					if(feature.remove){
						that.$('input[name="grant[' + feature.nickname + '][remove]"]').attr('checked', true);
					}
					if(feature.update){
						that.$('input[name="grant[' + feature.nickname + '][update]"]').attr('checked', true);
					}
				});
			});
		}else{
			//second fetch: submit
			this.router.navigate('role/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		var status = this.model.get('status');
		this.$('input[name="status"][value="'+ status +'"]').attr('checked',true);
		if(this.model.isNew()) this.$('.panel-title').text('新增角色');
		return this;
	},
});