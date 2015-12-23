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
			<div class="media">
				<div class="media-left">
					<img class="media-object" src="" width="80px" height="80px" style="max-width:100px;">
				</div>
				<div class="media-body">
					<div class="pull-right" id="<%= model._id %>">
						<button class="btn btn-success view">推荐</button>
					</div>
					<h4><%= model.subject %></h4>
					<p>
						<span><%= model.description %></span>
					</p>
					<p>
						<% if(model.starttime){ %>
						<span>时间：<%= model.starttime %>到<%= model.endtime %></span>
						<% } %>
					</p>
				</div>
			</div>
			<hr/>
		</div>
	</div>
	<div id="viewTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">推荐业务</h5>
			</div>
			<div class="panel-body">
				<div class="pull-right"></div>
				<h4><%= model.subject %></h4>
				<p><%= model.description %></p>
				<p>
					<% if(model.starttime){ %>
					<span>时间：<%= model.starttime %>到<%= model.endtime %></span>
					<% } %>
				</p>
			</div>
		</div>
		<div id="dataAddView"></div>
	</div>
</div>