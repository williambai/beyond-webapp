<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">股票账户管理</h4>
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
				<% if(!model.login){ %>
					<button class="btn btn-primary login">登录</button>
				<% } %>
				<button class="btn btn-success edit">编辑</button>
				<button class="btn btn-danger delete">删除</button>
			</div>
			<h4>[<%= model.company.name %>]&nbsp;&nbsp;<%= model.user.name %></h4>
			<p>账户：<%= model.username %>
			<p>登录状态：<%= model.login %>&nbsp;&nbsp;账户状态：<%= model.status %></p>
		</div>
		<hr/>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改账户</h4>
			</div>
			<div class="panel-body">
				<form id="accountForm">
					<div class="form-group">
						<label for="username">证券公司：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="company[name]" value="中信证券" checked>&nbsp;&nbsp;中信证券&nbsp;&nbsp;
						</div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="user">用户姓名：</label>
						<input type="text" name="user[name]" value="<%= model.user.name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="username">账户名称：</label>
						<input type="text" name="username" value="<%= model.username %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="password">账户密码：</label>
						<input type="password" name="password" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="cpassword">密码(再次)：</label>
						<input type="password" name="cpassword" class="form-control">
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