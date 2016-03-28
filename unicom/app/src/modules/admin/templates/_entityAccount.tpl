<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">用户管理</h4>
			</div>
			<div class="panel-body">
				<div id="search">
				</div>
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="searchTemplate">
		<form id="searchForm" class="form-inline">
			<input type="hidden" name="type" value="search">
			<div class="form-group">
				<label>搜索：</label>
				<input type="text" name="searchStr" class="form-control" placeholder="用户名/用户账号">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<select class="form-control" name="status">
					<option value="">全部</option>
					<option value="正常">正常</option>
					<option value="禁用">禁用</option>
					<option value="未验证">未验证</option>
				</select>&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<input type="submit" value="查询" class="btn btn-info btn-block">
			</div>
		</form>
		<hr/>
	</div>
	<div id="itemTemplate">
 		<div class="pull-right" id="<%= model._id %>">
			<button class="btn btn-success edit">编辑</button>
			<!-- <button class="btn btn-danger delete">删除</button> -->
		</div>
		<h4 class="media-heading"><%= model.username %>&nbsp;&nbsp;<%= model.email %></h4>
		<p>城市：<%= model.department.city %>&nbsp;地区：<%= model.department.district %>&nbsp;网格：<%= model.department.grid %></p>
		<hr/>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改账号</h4>
			</div>
			<div class="panel-body">
				<div class="form-group">
					<input type="file" class="hidden">
					<a id="send-file">
						<img id="avatar" src="/images/avatar.jpg" width="120px" height="160px">
						<br/>
						<span>更换头像</span>
					</a>
				</div>
				<form id="accountForm">
					<div class="form-group">
						<label for="username">姓名：</label>
						<input type="text" name="username" value="<%= model.username %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="email">电子邮件/手机号码：</label>
						<input type="text" name="email" value="<%= model.email %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="department">所在营业厅：</label>
						<input type="text" name="department[name]" value="<%= model.department.name %>" class="form-control" placeholder="请输入营业厅名称，并在列表中选择">
						<div id="departments"></div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="department">营业厅地址：</label>
						<input type="text" name="department[address]" value="<%= model.department.address %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="email">所在城市：</label>
						<input type="text" name="department[city]" value="<%= model.department.city %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="email">所在网格编码：</label>
						<input type="text" name="department[grid]" value="<%= model.department.grid %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="email">所在地区编码：</label>
						<input type="text" name="department[district]" value="<%= model.department.district %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>应用：</label>
						<div style="padding-left:30px;" id="apps">
						</div>
					</div>
					<div class="form-group">
						<label>后台角色：</label>
						<div style="padding-left:30px;" id="roles">
						</div>
					</div>
					<div class="form-group">
						<label for="password">密码：</label>
						<input type="password" name="password" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="password">密码(再次)：</label>
						<input type="password" name="cpassword" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="biography">自传：</label>
						<textarea name="biography" rows="3" class="form-control"><%= model.biography %></textarea>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="正常" checked>&nbsp;&nbsp;正常&nbsp;&nbsp;
							<input type="radio" name="status" value="禁用">&nbsp;&nbsp;禁用&nbsp;&nbsp;
							<input type="radio" name="status" value="未验证">&nbsp;&nbsp;注册但未验证
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
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">更新历史</h4>
			</div>
			<div class="panel-body" id="history">
			</div>
		</div>
	</div>
</div>