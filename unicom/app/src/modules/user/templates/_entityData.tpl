<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
<!--
 			<div class="pull-right">
				<button class="btn btn-primary search">过滤</button>
			</div>
 -->
 			<div class="panel-heading">
				<h5 class="panel-title text-center">流量产品</h5>
			</div>
			<div class="panel-body">
				<div id="search"></div>
				<div class="btn-group btn-group-justified">
					<div class="btn btn-success" id="g2">2G用户</div>
					<div class="btn btn-default" id="g3">3G用户</div>
					<div class="btn btn-default" id="g3">4G用户</div>
				</div>
				<hr/>
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div class="pull-right" id="<%= model._id %>">
			<% if(/MicroMessenger/.test(navigator.userAgent)){ %>
			<p><button class="btn btn-danger promote">推广</button></p>
			<% } %>
			<p><button class="btn btn-success view">订购</button></p>
		</div>
		<h4><%= model.name %></h4>
		<p><%= model.description %></p>
		<p>价格：<%= model.price %>&nbsp;<%= model.unit %></p>
		<hr/>
	</div>
	<div id="searchTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">筛选条件</h4>
			</div>
			<div class="panel-body">
				<form id="searchForm">
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="确定" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<input type="reset" value="重置" class="btn btn-primary">
						</div>
						</div>
					</div>
				</form>
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
				<h5><%= model.subject %></h5>
				<p><%= model.description %></p>
			</div>
		</div>
		<div id="addView"></div>
	</div>
	<div id="addTemplate">
		<div class="panel panel-primary">
			<div class="panel-heading">
				<button class="btn btn-success pull-right addItem"><i class="fa fa-plus-circle"></i>添加</button>
				<h5 class="panel-title text-center">推荐给客户</h5>
			</div>
			<div class="panel-body">
				<form>
					<div class="form-group">
						<label></label>
						<input type="text" name="mobile[]" class="form-control" placeholder="手机号码">
						<span class="help-block"></span>
					</div>
<!-- 					<div class="form-group">
						<label></label>
						<input type="text" name="mobile[]" class="form-control" placeholder="手机号码">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label></label>
						<input type="text" name="mobile[]" class="form-control" placeholder="手机号码">
						<span class="help-block"></span>
					</div> -->
					<div id="insertItemBefore"></div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="确定订购" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<button class="btn btn-primary cancel">取消</button>
						</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div id="successTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">推荐成功</h5>
			</div>
			<div class="panel-body">
				<p>恭喜你，推荐成功！</p>
				<button class="btn btn-primary btn-block back">返回</button>
			</div>
		</div>
	</div>
	<div id="failTemplate">
		<p>推荐失败页面，查看</p>
		<div>
		</div>
	</div>
</div>