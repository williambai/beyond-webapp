<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">兑换订单</h5>
			</div>
			<div class="panel-body">
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
<!-- 		<div class="pull-right" id="<%= model._id %>">
			<button class="btn btn-info view"></button>
		</div>
 -->
 		<div class="pull-right">
 			<h4>￥<%= model.total.toFixed(2) %></h4>
 		</div>
 		<h4>客户：<%= model.customer.id %>&nbsp;&nbsp;<%= model.customer.name %></h4>
		<p>产品名称：<%= model.name %>&nbsp;[<%= model.category %>]</p>
		<p>发布于：<%= model.deltatime %>&nbsp;&nbsp;&nbsp;当前状态：<%= model.status %></p>
		<hr/>
	</div>
</div>
