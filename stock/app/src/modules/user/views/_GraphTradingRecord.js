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

	load: function(query) {
		this.url = config.api.host + '/trading?type=graph&symbol=' + this.symbol;
		this.render();
	},

	refresh: function(query) {
		this.url = config.api.host + '/trading?type=graph&symbol=' + this.symbol + (this.query ? '&' + this.query : '');
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

		var x = d3.time.scale()
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

			data.forEach(function(d) {
				d.date = parseDate(d.date + ' ' + d.time);
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
		});		
	},
	render: function() {
		this.graph_1();
	},
});