<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">流量产品</h5>
			</div>
			<div class="panel-body">
				<div class="btn-group btn-group-justified">
					<div class="btn btn-success" id="g2">2G用户</div>
					<div class="btn btn-default" id="g3">3G用户</div>
				</div>
				<hr/>
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div class="pull-right" id="<%= model._id %>">
			<button class="btn btn-info view">推荐</button>
		</div>
		<h4><%= model.subject %></h4>
		<p><%= model.description %></p>
		<hr/>
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
				<form id="orderForm">
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