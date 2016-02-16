<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">传统增值服务</h5>
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
				<% if(/MicroMessenger/.test(navigator.userAgent)){ %>
				<p><button class="btn btn-danger promote">推广</button></p>
				<% } %>
				<p><button class="btn btn-success view">订购</button></p>
			</div>
			<h4><%= model.name %></h4>
			<p><%= model.description %></p>
			<p>售价：<%= model.price %>&nbsp;<%= model.unit %>&nbsp;&nbsp;返佣：<%= model.bonus.income %>&nbsp;元&nbsp;&nbsp;积分：<%= model.bonus.points %></p>
			<hr/>
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
		<div id="dataAddView"></div>
	</div>
</div>