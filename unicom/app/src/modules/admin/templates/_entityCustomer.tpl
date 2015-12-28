<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary import">导入</button>
				<button class="btn btn-primary export">导出</button>
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">客户管理</h4>
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
			<div class="form-group">
				<label>&nbsp;&nbsp;</label>
				<input type="text" name="searchStr" class="form-control" placeholder="客户姓名或手机号">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<select class="form-control">
					<option>全部</option>
					<option>有效</option>
					<option>无效</option>
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
		<h4><%= model.mobile %>&nbsp;&nbsp;<%= model.name %></h4>
		<p>渠道：<%= model.channel%>&nbsp;
			<br/>网格：<%= model.grid %>
			<br/>管理部门：<%= model.department %>
		</p>
		<hr/>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改客户</h4>
			</div>
			<div class="panel-body">
				<form id="customerForm">
					<div class="form-group">
						<label>客户姓名：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control" placeholder="请输入客户姓名">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>客户手机：</label>
						<input type="text" name="mobile" value="<%= model.mobile %>" class="form-control" placeholder="请输入客户手机号码">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>管理部门：</label>
						<input type="text" name="department" value="<%= model.department %>" class="form-control" placeholder="请输入组织名称并从列表中选择">
						<div id="departments"></div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>渠道名称：</label>
						<input type="text" name="channel" value="<%= model.channel %>" class="form-control" placeholder="请输入渠道名称并从列表中选择">
						<div id="channels"></div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>网格名称：</label>
						<input type="text" name="grid" value="<%= model.grid %>" class="form-control" placeholder="请输入网格名称并从列表中选择">
						<div id="grids"></div>
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
	<div id="importTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">导入客户</h4>
			</div>
			<div class="panel-body">
				<p>请点击<i class="fa fa-plus-circle"></i>选择要上传的文件，点击已上传的文件，可以取消上传。</p>
				<form>
					<div class="form-group">
						<span class="attachments"></span>
						<span>
							<button class="btn btn-promary send-file"> <i class="fa fa-5x fa-plus-circle"></i>
							</button>
						</span>
					</div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="导入" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<button class="btn btn-primary back">取消</button>
						</div>
						</div>
					</div>
				</form>
				<input class="hidden" type="file" name="file"/>
				<hr>
				<p>导入数据列依次为：</p>
			</div>
		</div>
	</div>	
	<div id="exportTemplate">
		<div class="panel panel-default" id="exportForm">
			<div class="panel-heading">
				<h3 class="panel-title text-center">导出客户</h3>
			</div>
			<div class="panel-body">
				<form>
					<input type="hidden" name="type" value="search">
					<div class="form-group">
						<label>管理部门：</label>
						<input type="text" name="department" value="<%= model.department %>" class="form-control" placeholder="请输入组织名称并从列表中选择">
						<div id="departments"></div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>渠道名称：</label>
						<input type="text" name="channel" value="<%= model.channel %>" class="form-control" placeholder="请输入渠道名称并从列表中选择">
						<div id="channels"></div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>网格名称：</label>
						<input type="text" name="grid" value="<%= model.grid %>" class="form-control" placeholder="请输入网格名称并从列表中选择">
						<div id="grids"></div>
						<span class="help-block"></span>
					</div>
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
				<p>导出数据列依次为：</p>
			</div>
		</div>

	</div>
</div>