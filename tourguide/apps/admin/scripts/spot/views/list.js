define(['text!../templates/list_item.tpl','text!../templates/list.tpl'],function(itemTpl, listTpl){

	var Spot = Backbone.Model.extend({
		idAttribute: '_id',
		urlRoot: '/spots',
	});

	var Spots = Backbone.Collection.extend({
		url: '/spots',
		model: Spot,
		parse: function(response){
			return response.collection;
		},
	});

	var ItemView = Backbone.View.extend({
		tagName: 'tr',
		template: _.template(itemTpl),

		intialize: function(options){
			this.context = optons.context;
			this.model = new Spot({_id: options.id});
		},
		render: function(){
			this.$el.html(this.template({model: this.model.toJSON()}));
			return this;
		}
	});

	var PageView = Backbone.View.extend({
		el: '#content',
		template: _.template(listTpl),

		initialize: function(options){
			this.context = options.context;
			this.collection = new Spots();
			this.collection.url = this.context.api_prefix + this.collection.url;
			this.collection.on('reset', this.renderCollection, this);
			this.collection.fetch({reset: true});
		},

		events: {
		},

		renderCollection: function(){
			this.collection.each(function(model){
				var itemView = new ItemView({model: model});
				this.$('#list').append(itemView.render().$el);
			});
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return PageView;	
});