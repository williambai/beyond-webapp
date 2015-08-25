<div class="pull-right">
	<p>数量：<%= record.items %>条</p>
	<p>价格：<%= record.price*record.items %>元</p>
</div>
<div>
	<%
	 var date = new Date(record.createtime);
	%>
	<h4>发生时间：<%= date.getFullYear() +'-' + date.getMonth() + '-' + date.getDay() + ' '+ date.getHours() + ':'+ date.getMinutes() + ':'+ date.getSeconds() %></h4>
	<p>业务类型：<%= record.ywlx %>&nbsp;&nbsp;业务代码：<%= record.sbm %>&nbsp;&nbsp;发生地：<%= record.fsd %></p>
</div>
<hr>