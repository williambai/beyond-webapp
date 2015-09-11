<div class="pull-right">
	<p>
		<a href="#order/update/<%= order._id %>">编辑</a>
		&nbsp;
		<a href="#order/detail/<%= order._id %>">打印</a>
		&nbsp;
		<a>出票</a>
		&nbsp;
		<a href="#" class="remove" id="<%= order._id %>">删除</a>
	</p>
	<p>
		<a href="#records/order/<%= order._id %>">出票记录</a>
		&nbsp;
		<a>变更记录</a>
	</p>
</div>
<div>
	<h4>
		 手机号：
		<%= order.customer.email %>，姓名：
		<%= order.customer.username %>
		</h4>
	<p>
		类型：<%= order.game.name %>，共&nbsp;<%= order.game.periods %>&nbsp;期，剩余&nbsp;<%= order.game.remained %>&nbsp;期</p>
</div>
<div class="list"></div>
<hr>