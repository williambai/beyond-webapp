<div class="pull-right">
	<% if(record.status == 0){ %>
	<p><a href="#update" id="">立即出票</a>&nbsp;</p>
	<p><a href="#record/update/<%= record._id %>">修改</a></p>
	<% }else if(record.status == 1){ %>
	<p>正在出票</p>
	<p></p>
	<% }else if(record.status == 2){ %>
	<p>已经出票</p>
	<p><a href="#record/cash" id="">兑奖</a></p>
	<% }else if(record.status == 3){ %>
	<p>已经兑奖</p>
	<p><%= Number(record.bonus).toFixed(2) %>&nbsp;元</p>
	<% } %>
</div>
<div>
	<%
	 var date = new Date(record.lastupdatetime);
	%>
	<h4>手机号：<%= record.customer.email %>，姓名：<%= record.customer.username %></h4>
	<p>类型：<%= record.game.name %>，期号：<%= record.game.periodnum %>，生成时间：<%= date.getFullYear() +'-' + (1+date.getMonth()) + '-' + (date.getDate()) + ' '+ date.getHours() + ':'+ date.getMinutes() + ':'+ date.getSeconds() %></p>
</div>
<hr>