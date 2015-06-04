define(['text!templates/status.html'],function(statusTemplate){
	var StatusView = Backbone.View.extend({
		// tagName: 'li',
		template: _.template(statusTemplate),
		templateExpand: '<a class="expand"><p>展开</p></a>',
		templatePackup: '<a class="packup"><p>收起</p></a>',

		events: {
			'click .good': 'voteGood',
			'click .bad': 'voteBad',
			'click .level': 'changeLevel',
			'click .expand': 'expand',
			'click .packup': 'packup',
		},

		initialize: function(){
			
		},

		voteGood: function(){
			$.post(
				'/status/'+ this.model.get('_id'),
				{
					good: 1	
				}
			);
			return false;
		},

		voteBad: function(){
			$.post(
				'/status/'+ this.model.get('_id'),
				{
					bad: 1	
				}
			);
			return false;
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	return StatusView;
});