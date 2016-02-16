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
		<div class="item" id="<%= model._id %>">
	 		<div class="pull-right">
	 			<h4>￥<%= model.total.toFixed(2) %></h4>
	 			<h4><i class="fa fa-gift"></i>&nbsp;&nbsp;+<%= model.bonus.income %></h4>
	 			<h4><i class="fa fa-thumbs-o-up"></i>&nbsp;&nbsp;+<%= model.bonus.points %></h4>
	 		</div>
	 		<h4><i class="fa fa-user"></i>&nbsp;<%= model.customer.id %>&nbsp;&nbsp;<%= model.customer.name %></h4>
			<p><i class="fa fa-cart-arrow-down"></i>&nbsp;<%= model.name %>&nbsp;[<%= model.category %>]</p>
			<p><i class="fa fa-clock-o"></i>&nbsp;<%= model.deltatime %>&nbsp;<i class="fa fa-flag"></i>&nbsp;<%= model.status %></p>
			<hr/>
		</div>
	</div>
</div>
