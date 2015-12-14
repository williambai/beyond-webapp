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
				<button class="pull-right add">添加</button>
				<h5 class="panel-title text-center">推荐给客户</h5>
			</div>
			<div class="panel-body">
				<form id="recommendForm">
					<input type="hidden" name="product[id]" value="<%= model._id %>">
					<input type="hidden" name="product[name]" value="<%= model.subject %>">
					<input type="hidden" name="product[category]" value="<%= model.category %>">
					<input type="hidden" name="goods[name]" value="<%= model.goods.name %>">
					<input type="hidden" name="goods[nickname]" value="<%= model.goods.nickname %>">
					<input type="hidden" name="goods[sourceId]" value="<%= model.goods.sourceId %>">
					<div id="insertItemAfter"></div>
					<div class="form-group">
						<label></label>
						<input type="text" name="mobile[]" class="form-control" placeholder="手机号码">
					</div>
					<div class="form-group">
						<label></label>
						<input type="text" name="mobile[]" class="form-control" placeholder="手机号码">
					</div>
					<div class="form-group">
						<label></label>
						<input type="text" name="mobile[]" class="form-control" placeholder="手机号码">
					</div>
					<div id="insertItemBefore"></div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
								<input type="submit" value="确认订购" class="btn btn-danger">
							</div>
							<div class="btn-group">
								<button class="btn btn-primary back">取消</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>