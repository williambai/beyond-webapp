<%
 var date = new Date(model.lastupdatetime);
%>
<div class="pull-right">
	<p><a href="#strategy/edit/<%= model._id %>" id="">编辑</a>&nbsp;&nbsp;<a href="#strategy/trading/record/<%= model.symbol %>/<%= date.getTime() %>" id="">交易明细</a></p>
	<!-- <button class="btn btn-primary btn-small">实时交易</button> -->
</div>
<div>
	<h4><a href="#strategy/trading/graph/<%= model.symbol %>/<%= date.getTime() %>"><%= model.symbol %></a>&nbsp;&nbsp;<%= model.stock.name %>&nbsp;&nbsp;<% if(model.status.code == 0){ %><span style="background-color: red; color: white;"><%= model.status.message %></span><% }else{ %><span style="background-color: green; color: white;"><%= model.status.message %></span><% } %></h4>
	<p>创建时间：<%= date.getFullYear() +'-' + (1+date.getMonth()) + '-' + (date.getDate()) + ' '+ date.getHours() + ':'+ date.getMinutes() + ':'+ date.getSeconds() %>&nbsp;&nbsp;交易次数：<%= model.times %></p>
</div>
<div class="graph"></div>
<hr>