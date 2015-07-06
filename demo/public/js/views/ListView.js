define([],function(){
	var ContentView = Backbone.View.extend({

		page: 0,
		
		events: {
			'click .next-page': 'nextPage',
			'scroll': 'scroll',
		},

		nextPage: function(){},

		scroll: function(){
			 viewH =this.$el.height(),//可见高度  
             contentH =this.$el.get(0).scrollHeight,//内容高度  
             scrollTop =this.$el.scrollTop();//滚动高度  
            if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
            	this.nextPage();
            }
		},		
	});
	return ContentView;
});