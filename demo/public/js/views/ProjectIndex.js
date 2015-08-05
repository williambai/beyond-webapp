define(['text!templates/projectIndex.html','text!templates/_barProjectBottom.html','models/Project'], function(projectIndexTemplate,projectBarTemplate,Project){
	var ProjectIndexView = Backbone.View.extend({
		el: '#content',
		template: _.template(projectIndexTemplate),
		templateBar: _.template(projectBarTemplate),

		events: {
			'click .toggle-project': 'closeOrOpen',
		},

		initialize: function(options){
			this.pid = options.pid;
			this.account = options.account;
			this.model = new Project();
			this.model.url = '/projects/' + options.pid;
			this.model.on('change', this.render,this);
			this.on('load', this.load,this);
		},

		load: function(){
			var that = this;
			this.model.fetch({
				success: function(model){
					if(that.account.id == model.get('accountId')){
						model.set('isOwner', true);
					}
				}
			});
		},

		closeOrOpen: function(){
			var that = this;
			var closed = this.model.get('closed');
			if(closed){
				if(confirm('你确定要打开项目吗？')){
					that.model.set('closed', false);
					that.render();
					$.post('/projects/'+ this.model.get('_id') + '/open');
				}
			}else{
				if(confirm('你确定要关闭项目吗？')){
					that.model.set('closed', true);
					that.render();
					$.post('/projects/'+ this.model.get('_id') + '/close');
				}
			}
			return false;
		},

		render: function(){
			//增加 bottom Bar
			if($('.navbar-absolute-bottom').length == 0){
				var bottomBarHtml = this.templateBar({id:this.pid});
				$('.app').prepend('<div class="bottom-bar">' +bottomBarHtml + '</div>');
				if(!$('body').hasClass('has-navbar-bottom')){
					$('body').addClass('has-navbar-bottom');
				}
			}
			this.$el.html(this.template({
					project: this.model.toJSON(),
					contacts_num: this.model.get('contacts') ? this.model.get('contacts').length : 0
				}));
			return this;
		}
	});
	return ProjectIndexView;
});