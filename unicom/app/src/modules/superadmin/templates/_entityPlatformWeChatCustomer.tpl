<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">微信客户管理</h4>
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
				<button class="btn btn-success edit">编辑</button>
				<button class="btn btn-danger delete">删除</button>
			</div>
			<h4><%= model.openid %></h4>
			<p>推荐者Id：<%= model.creator.id %>&nbsp;&nbsp;</p>
		</div>
		<hr/>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改微信客户</h4>
			</div>
			<div class="panel-body">
				<form id="accountForm">
					<div class="form-group">
						<label for="openid">openId：</label>
						<input type="text" name="openid" value="<%= model.openid %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="creator">推荐者Id：</label>
						<textarea name="creator[id]" class="form-control"><%= model.creator.id %></textarea>
						<span class="help-block"></span>
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