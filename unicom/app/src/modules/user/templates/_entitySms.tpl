<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">所有产品</h5>
			</div>
			<div class="panel-body">
				<div class="row">
					<div id="list">
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div>
			<div class="item col-xs-6" id="<%= model._id %>">
				<div class="text-center">
					<img src="" width="80px" height="80px">
					<h4><%= model.name %></h4>
					<p>&nbsp;</p>
				</div>
			</div>
		</div>
	</div>
	<div id="viewTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">订购业务</h5>
			</div>
			<div class="panel-body">
				<div class="pull-right"><%= model.price %>&nbsp;<%= model.unit %></div>
				<h5><%= model.name %></h5>
				<p><%= model.description %></p>
				<p>佣金：<%= model.bonus.income %>&nbsp;元（用户订购成功后，分&nbsp;<%= model.bonus.times %>&nbsp;批返佣）</p>
				<p>积分：<%= model.bonus.points %></p>
			</div>
		</div>
		<div id="orderView"></div>
	</div>
</div>