<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">我的工作成绩</h5>
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
 		<h4>客户：<%= model.customer.mobile %></h4>
		<p>产品名称：<%= model.product.name %>&nbsp;[<%= model.product.category %>]</p>
		<p>发布于：<%= model.deltatime %>&nbsp;&nbsp;&nbsp;当前状态：<%= model.status %></p>
		<hr/>
	</div>
</div>
