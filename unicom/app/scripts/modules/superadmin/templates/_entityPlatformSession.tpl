<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">会话管理</h4>
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
		<div class="pull-right" id="<%= model._id %>">
			<button class="btn btn-success edit">编辑</button>
			<button class="btn btn-danger delete">删除</button>
		</div>
		<h4><%= model._id %></h4>
		<p>用户：<%= model.username %>&nbsp;[<%= model.email %>]</p>
		<p>应用：<%= model.apps %></p>
		<p>权限：<%= model.grants %></p>
		<hr/>
	</div>
	<div id="searchTemplate">
		<form id="searchForm" class="form-inline">
			<input type="hidden" name="type" value="search">
			<div class="form-group">
				<label>搜索：</label>
				<input type="text" name="searchStr" class="form-control" placeholder="会话ID/用户账号">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<input type="submit" value="查询" class="btn btn-info btn-block">
			</div>
		</form>
		<hr/>
	</div>
 	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改会话</h4>
			</div>
			<div class="panel-body">
				<form id="sessionForm">
					<div class="form-group">
						<label>会话ID：</label>
						<p style="padding-left:30px;"><%= model._id %></p>
						<input type="hidden" name="_id" value="<%= model._id %>" class="form-control">
					</div>
					<div class="form-group">
						<label>用户：</label>
						<p style="padding-left:30px;"><%= model.email %></p>
					</div>
					<div class="form-group">
						<label>用户名：</label>
						<p style="padding-left:30px;"><%= model.username %></p>
					</div>
					<div class="form-group">
						<label>应用：</label>
						<p style="padding-left:30px;"><%= model.apps %></p>
					</div>
					<div class="form-group">
						<label>权限：</label>
						<p style="padding-left:30px;"><%= model.grants %></p>
					</div>
					<div class="form-group">
						<label>会话内容：</label>
						<p style="color:red;">注意：您必须明白您所做的操作！<u>(警告：可能会造成用户不能访问)</u></p>
						<textarea name="session" class="form-control" rows=10><%= model.session %></textarea>
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