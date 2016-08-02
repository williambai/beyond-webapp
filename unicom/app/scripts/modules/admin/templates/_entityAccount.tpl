<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary import">导入</button>
				<button class="btn btn-primary export">导出</button>
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
			<button class="btn btn-danger delete">删除</button>
		</div>
		<h4 class="media-heading"><span style="color:red;">[<%= model.department && model.department.city %>]</span><%= model.username %>&nbsp;&nbsp;<%= model.email %>&nbsp;<span style="color:red;"><%= model.status %></span></h4>
		<h5><%= model.department.name %></h5>
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
					<input type="hidden" name="department[id]" value="<%= model.department.id %>">
					<div class="form-group">
						<label for="department">渠道名称：</label>
						<input type="text" name="department[name]" value="<%= model.department.name %>" class="form-control" placeholder="请输入渠道名称，并在列表中选择">
						<div id="departments"></div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="department">渠道编码：</label>
						<input type="text" name="department[nickname]" value="<%= model.department.nickname %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="email">所在城市：</label>
						<input type="text" name="department[city]" value="<%= model.department.city %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="email">所在地区：</label>
						<input type="text" name="department[district]" value="<%= model.department.district %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="email">所在网格：</label>
						<input type="text" name="department[grid]" value="<%= model.department.grid %>" class="form-control" readonly>
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
	<div id="importTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">导入用户</h4>
			</div>
			<div class="panel-body">
				<p style="color:red;">请点击<i class="fa fa-plus-circle"></i>选择要上传的文件，点击已上传的文件，可以取消上传。</p>
				<p>友情提示：为保证导入效率，每次最好仅选择导入一个文件。</p>
				<form>
					<input type="hidden" name="type" value="import">
					<div class="form-group">
						<span class="attachments"></span>
						<span>
							<button class="btn btn-promary send-file"> <i class="fa fa-5x fa-plus-circle"></i>
							</button>
						</span>
					</div>
					<!-- <div class="form-group">
						<label>导入方式：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="method" value="增量" checked>&nbsp;&nbsp;增量&nbsp;&nbsp;
							<input type="radio" name="method" value="全量">&nbsp;&nbsp;全量&nbsp;&nbsp;
						</div>
					</div>
					<div style="color:red;">
						<p>注意1：请慎重选择全量导入方式。全量导入将先删除当前数据表中现有的全部数据，然后导入新数据。</p>
						<p>注意2：导入时，请先将表示列名称的首行删除，并且保证最后一行不要留空行。(即，文件只留数据，不留标题和空行)</p>
					</div> -->
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
								<input type="submit" value="确定" class="btn btn-danger">
							</div>
							<div class="btn-group">
								<button class="btn btn-success exportTpl">下载模板</button>
							</div>
						<div class="btn-group">
							<button class="btn btn-primary back">取消</button>
						</div>
						</div>
					</div>
				<input class="hidden" type="file" name="file"/>
				</form>
				<hr>
				<h4>导入Excel数据表格列格式如下：</h4>
				<table class="table table-striped">
					<thead>
						<tr>
							<th>序号</th>
							<th>名称(</th>
							<th>备注</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
		</div>
	</div>	
	<div id="importReportTemplate">
		<div class="panel panel-default" id="reportForm">
			<div class="panel-heading">
				<h3 class="panel-title text-center">导入结果报告</h3>
			</div>
			<div class="panel-body">
				<button class="btn btn-primary btn-block back">返回</button>
			</div>
		</div>
	</div>
	<div id="exportTemplate">
		<div class="panel panel-default" id="exportForm">
			<div class="panel-heading">
				<h3 class="panel-title text-center">导出用户</h3>
			</div>
			<div class="panel-body">
				<form>
					<input type="hidden" name="type" value="export">
 					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="导出" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<button class="btn btn-primary back">取消</button>
						</div>
						</div>
					</div>
				</form>
				<hr>				
				<h4>导出excel数据表格列格式如下：</h4>
				<table class="table table-striped">
					<thead>
						<tr>
							<th>序号</th>
							<th>名称</th>
							<th>备注</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>