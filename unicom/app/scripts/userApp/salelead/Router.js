var Router = require('../_base/__Router');
var SaleLeadIndexView = require('./views/SaleLeadIndex');
var SaleLeadEditView = require('./views/SaleLeadEdit');

exports = module.exports = Router.extend({

	routes: {
		'sale/lead/index': 'saleLeadIndex',
		'sale/lead/edit/:id': 'saleLeadEdit',
	},

	saleLeadIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '销售线索');
		var saleLeadIndexView = new SaleLeadIndexView({
			router: this,
			el: '#content'
		});
		this.appEvents.trigger('changeView',saleLeadIndexView);
		saleLeadIndexView.trigger('load');
	},

	saleLeadEdit: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '销售线索处理');
		var saleLeadEditView = new SaleLeadEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.appEvents.trigger('changeView',saleLeadEditView);
		saleLeadEditView.trigger('load');
	},

});