<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">内容推荐</h5>
			</div>
			<div class="panel-body">
				<div class="btn-group btn-group-justified">
					<div class="btn btn-success" id="app">应用推荐</div>
					<div class="btn btn-default" id="activity">活动推荐</div>
				</div>
				<hr/>
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div>
			<div class="item" id="<%= model._id %>">
				<div class="media">
					<div class="media-left">
						<img class="media-object" src="" width="80px" height="80px" style="max-width:100px;">
					</div>
					<div class="media-body">
						<div class="pull-right">
							<% if(/MicroMessenger/.test(navigator.userAgent)){ %>
							<p><button class="btn btn-danger promote">推广</button></p>
							<% } %>
							<p><button class="btn btn-success view">推荐</button></p>
						</div>
						<h4><%= model.name %></h4>
						<p><%= model.description %></p>
						<p>
							<% if(model.starttime){ %>
							<span>时间：<%= model.starttime %>到<%= model.endtime %></span>
							<% } %>
						</p>
						<p>售价：<%= model.price %>&nbsp;<%= model.unit %>&nbsp;&nbsp;返佣：<%= model.bonus.income %>&nbsp;元&nbsp;&nbsp;积分：<%= model.bonus.points %></p>
					</div>
				</div>
				<hr/>
			</div>
		</div>
	</div>
	<div id="viewTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">推荐业务</h5>
			</div>
			<div class="panel-body">
				<div class="pull-right"><%= model.price %>&nbsp;<%= model.unit %></div>
				<h5><%= model.name %></h5>
				<p><%= model.description %></p>
				<p>
					<% if(model.starttime){ %>
					<span>时间：<%= model.starttime %>到<%= model.endtime %></span>
					<% } %>
				</p>
				<p>佣金：<%= model.bonus.income %>&nbsp;元（用户订购成功后，分&nbsp;<%= model.bonus.times %>&nbsp;批返佣）</p>
				<p>积分：<%= model.bonus.points %></p>
			</div>
		</div>
		<div id="orderView"></div>
	</div>
</div>