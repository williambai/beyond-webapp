<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">微信公众号管理</h4>
			</div>
			<div class="panel-body">
				<div id="search">
				</div>
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div class="item" id="<%= model._id %>">
	 		<div class="pull-right">
				<button class="btn btn-success menu"><i class="fa fa-plus fa-log"></i>菜单</button>
				<button class="btn btn-success edit">编辑</button>
				<button class="btn btn-danger delete">删除</button>
			</div>
			<h4><%= model.name %></h4>
			<p>描述：<%= model.description.slice(0,40) %>&nbsp;&nbsp;</p>
		</div>
		<hr/>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改微信公众号</h4>
			</div>
			<div class="panel-body">
				<form id="accountForm">
					<div class="form-group">
						<label for="name">名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="description">描述：</label>
						<textarea name="description" class="form-control"><%= model.description %></textarea>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="appid">微信号：</label>
						<input type="text" name="appname" value="<%= model.appname %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="appid">APP_ID：</label>
						<input type="text" name="appid" value="<%= model.appid %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="appsecret">APP_SECRET：</label>
						<input type="text" name="appsecret" value="<%= model.appsecret %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="apptoken">Token：</label>
						<input type="text" name="apptoken" value="<%= model.apptoken %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="有效" checked>&nbsp;&nbsp;有效&nbsp;&nbsp;
							<input type="radio" name="status" value="无效">&nbsp;&nbsp;无效&nbsp;&nbsp;
						</div>
					</div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
								<input type="submit" value="提交" class="btn btn-danger">
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