var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone');
var config = require('../conf');
var d3 = require('d3');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({
	el: '#graph',

	initialize: function(options) {
		this.symbol = options.symbol;
		this.on('load', this.load, this);
		this.on('refresh', this.refresh, this);
	},

	load: function() {
		this.url = config.api.host + '/trade/transactions?type=graph&symbol=' + this.symbol;
		this.render();
	},

	refresh: function(url) {
		this.url = url;
		this.render();
	},

	graph_1: function(){
		var margin = {
				top: 20,
				right: 20,
				bottom: 30,
				left: 50
			},
			width = 700 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

		var x = d3.scale.linear()
			.range([0, width]);

		var y = d3.scale.linear()
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		var line = d3.svg.line()
			.x(function(d) {
				return x(d.date);
			})
			.y(function(d) {
				return y(d.price);
			});

		var svg = d3.select("#graph").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		d3.json(this.url, function(err, data) {
			if (err) throw err;
			data = _.sortBy(data,'_id');
			var balance=0, bonus = 0, buyTimes = 0, saleTimes = 0, times;
			data.forEach(function(d,i){
				if(d.direction == '买入'){
					buyTimes++;
					balance += d.price * d.quantity;
				}else if(d.direction == '卖出'){
					saleTimes++;
					balance -= d.price * d.quantity;
				}
				d.balance = balance;
				d.bonus = -balance + d.price * d.quantity * (buyTimes - saleTimes);
				d.delta = saleTimes - buyTimes;
			});
			times = Math.min(buyTimes,saleTimes);
			buyTimes = 0;
			saleTimes = 0;
			data.forEach(function(d,i) {
				if(d.direction == '买入' &&  buyTimes < times){
					bonus -= d.price * d.quantity;
					buyTimes++;
				}else if(d.direction == '卖出' && saleTimes < times){
					bonus += d.price * d.quantity;
					saleTimes++;
				}
				// d.date = parseDate(d.date + ' ' + d.time);
				d.date = i;
			});

			x.domain(d3.extent(data, function(d) {
				return d.date;
			}));
			y.domain(d3.extent(data, function(d) {
				return d.price;
			}));
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Price (￥)");

			svg.append("path")
				.datum(data)
				.attr("class", "line")
				.attr("d", line);

			svg.selectAll('.bar')
				.data(data)
				.enter()
				.append('rect')
				.attr('class',function(d){return d.direction =='买入' ? 'bar buy' : 'bar sale'})
				.attr('x',function(d){return x(d.date)-2;})
				.attr('y',function(d){return d.direction =='买入' ? y(d.price) : (y(d.price) - 20)})
				.attr('height', 20)
				.attr('width',5);

			svg.selectAll('.bar-text')
				.data(data)
				.enter()
				.append('text')
				.attr('x',function(d){return x(d.date)+ 12;})
				.attr('y',function(d){return d.direction =='买入' ? y(d.price) : (y(d.price) - 20)})
				.style('text-anchor','end')
				.text(function(d){return d.bonus + '(' + d.delta + ')';});

			svg.append('g')
				.append('text')
				.attr('transform','translate(80,5)')
				.attr('y',4)
				.attr('dy','.71em')
				.style('text-anchor','end')
				.text('买入');
			svg.append('g')
				.append('rect')
				.attr('class', 'bar buy')
				.attr('x', 30)
				.attr('y', 10)
				.attr('height', 5)
				.attr('width', 20);
			svg.append('g')
				.append('text')
				.attr('transform','translate(80,25)')
				.attr('y',4)
				.attr('dy','.71em')
				.style('text-anchor','end')
				.text('卖出');
			svg.append('g')
				.append('rect')
				.attr('class', 'bar sale')
				.attr('x', 30)
				.attr('y', 30)
				.attr('height', 5)
				.attr('width', 20);

			svg.append("g")
				.append("text")
				.attr("transform","translate(" + (width-20) + ",20)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text('融资融券：￥'+ balance.toFixed(2));

			svg.append("g")
				.append("text")
				.attr("transform","translate(" + (width-20) + ",20)")
				.attr("y", 24)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text('动态盈亏：￥' + bonus.toFixed(2));
		});		
	},
	render: function() {
		this.graph_1();
	},
});