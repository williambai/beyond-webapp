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
		<div class="pull-right" id="<%= model._id %>">
			<button class="btn btn-info view">订购</button>
		</div>
		<h4><%= model.subject %></h4>
		<p><%= model.description %></p>
		<hr/>
	</div>
	<div id="itemAppTemplate">
		<hr/>
		<div class="media">
			<div class="media-left">
				<a href="#">
					<img class="media-object" src="" alt="" height="50px" width="50px">
				</a>
			</div>
			<div class="media-body">
				<h5 class="media-heading">手机报</h5>
				<p>999次下载 1.32M</p>
			</div>
			<div class="media-right view">
				<button class="btn btn-info">推荐</button>
			</div>
		</div>
	</div>
	<div id="viewTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">推荐业务</h5>
			</div>
			<div class="panel-body">
				<div class="pull-right">5元/月</div>
				<h5>100M流量业务</h5>
				<p>业务描述</p>
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