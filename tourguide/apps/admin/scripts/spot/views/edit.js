define(['text!../templates/edit.tpl'],function(searchTpl){
	var Spot = Backbone.Model.extend({
		idAttribute: '_id',
		urlRoot: '/spots',
	});

	var PageView = Backbone.View.extend({
		el: '#content',
		template: _.template(searchTpl),

		initialize: function(options){
			this.context = options.context;
			this.model = new Spot({_id: options.id});
			this.model.url = this.context.api_prefix + this.model.url();
			if(options.id){
				this.model.on('change', this.render, this);
				this.model.fetch();
			}
		},

		events: {
			'submit': 'submit',
		},

		search: function(){
			return false;
		},

		submit: function(){
			return false;
		},

		render: function(){
			this.$el.html(this.template({model: this.model.toJSON()}));
			return this;
		}
	});
	return PageView;	
});