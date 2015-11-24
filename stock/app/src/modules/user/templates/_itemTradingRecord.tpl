<div class="pull-right">
	<p><a href="#/trading/update" id="">成交</a>&nbsp;</p>
</div>
<div>
	<%
	 var date = new Date(model.lastupdatetime);
	%>
	<h4><a href="#trading/graph/<%= model.symbol %>"><%= model.symbol %></a>&nbsp;&nbsp;<% if(model.direction == '买入'){ %><span style="background-color: green;color:white;"><%= model.direction %></span><% }else{ %><span style="background-color: red;color:white;"><%= model.direction %></span><% } %>：￥<u><%= model.price %></u>&nbsp;&nbsp;<%= model.status.message %></h4>
	<p>交易日期：<%= model.date %>，交易时间：<%= model.time %></p>
	<p>生成时间：<%= date.getFullYear() +'-' + (1+date.getMonth()) + '-' + (date.getDate()) + ' '+ date.getHours() + ':'+ date.getMinutes() + ':'+ date.getSeconds() %></p>
</div>
<hr>