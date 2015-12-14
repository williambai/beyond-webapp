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
<!-- 	<div id="itemAppTemplate">
		<hr/>
		<div class="media">
			<div class="media-left">
				<a href="#">
					<img class="media-object" src="" alt="" height="50px" width="50px">
				</a>
			</div>
			<div class="media-body">
				<h5 class="media-heading">100M流量</h5>
				<p>999次下载 1.32M</p>
			</div>
			<div class="media-right">
				<button class="btn btn-info">推荐</button>
			</div>
		</div>
	</div>
 -->
 	<div id="itemTemplate">
		<div>
			<div class="media">
				<div class="media-left">
					<img class="media-object" src="" width="50px" height="50px" style="max-width:50px;">
				</div>
				<div class="media-body">
					<div class="pull-right" id="<%= model._id %>">
						<button class="btn btn-success view">推荐</button>
					</div>
					<h4><%= model.subject %></h4>
					<p><%= model.description %></p>
				</div>
			</div>
			<hr/>
		</div>
	</div>
	<div id="itemActivityTemplate">
	</div>
	<div id="viewTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">推荐业务</h5>
			</div>
			<div class="panel-body">
				<div class="pull-right"><%= model.price %>元/月</div>
				<h5><%= model.subject %></h5>
				<p><%= model.description %></p>
			</div>
		</div>
		<div class="panel panel-default">
			<div class="panel-heading">
				<button class="pull-right">添加</button>
				<h5 class="panel-title text-center">推荐给客户</h5>
			</div>
			<div class="panel-body">
				<form>
					<div class="form-group">
						<label></label>
						<input name="customer" class="form-control" placeholder="手机号码">
					</div>
					<div class="form-group">
						<label></label>
						<input name="customer" class="form-control" placeholder="手机号码">
					</div>
					<div class="form-group">
						<label></label>
						<input name="customer" class="form-control" placeholder="手机号码">
					</div>
					<div class="form-group">
						<input type="submit" value="确认推荐" class="btn btn-primary btn-block">
					</div>
				</form>
			</div>
		</div>
	</div>
</div>