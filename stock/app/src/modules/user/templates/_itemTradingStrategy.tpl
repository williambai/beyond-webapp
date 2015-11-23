<div class="pull-right">
	<p><a href="#strategy/update" id="">编辑</a>&nbsp;&nbsp;<a href="#strategy/trading/record" id="">交易明细</a></p>
</div>
<div>
	<%
	 var date = new Date(model.lastupdatetime);
	%>
	<h4><a href="#strategy/trading/graph/<%= model.symbol %>"><%= model.symbol %></a>&nbsp;&nbsp;<%= model.stock.name %>&nbsp;&nbsp;<%= model.status.message %></h4>
	<p>创建时间：<%= date.getFullYear() +'-' + (1+date.getMonth()) + '-' + (date.getDate()) + ' '+ date.getHours() + ':'+ date.getMinutes() + ':'+ date.getSeconds() %>&nbsp;&nbsp;交易次数：<%= model.times %></p>
</div>
<hr>