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
				<input type="hidden" name="type" value="search">
				<input type="text" name="searchStr" class="form-control" placeholder="客户姓名或手机号">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<select class="form-control" name="status">
					<option value="">全部</option>
					<option value="有效">有效</option>
					<option value="无效">无效</option>
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
		<p>管理部门：<%= model.department %></p>
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
<!-- 					<div class="form-group">
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
					</div> -->
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="有效" checked>&nbsp;&nbsp;有效
							<input type="radio" name="status" value="无效">&nbsp;&nbsp;无效
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
	<div id="importTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">导入客户</h4>
			</div>
			<div class="panel-body">
				<p>请点击<i class="fa fa-plus-circle"></i>选择要上传的文件，点击已上传的文件，可以取消上传。</p>
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
				<input class="hidden" type="file" name="file"/>
				</form>
				<hr>
				<h4>导入excel数据表格列格式如下：</h4>
				<p></p>
				<table class="table table-striped">
					<thead>
						<tr>
							<th>列序号</th>
							<th>列名称(即：excel第一行名称)</th>
							<th>列含义</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>name</td>
							<td>客户姓名</td>
						</tr>
						<tr>
							<td>2</td>
							<td>mobile</td>
							<td>客户手机</td>
						</tr>
						<tr>
							<td>3</td>
							<td>deparment</td>
							<td>管理部门，用&gt;&gt;分隔部门层级</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>	
	<div id="importReportTemplate">
		<div class="panel panel-default" id="reportForm">
			<div class="panel-heading">
				<h3 class="panel-title text-center">导入报告</h3>
			</div>
			<div class="panel-body">
				<button class="btn btn-primary btn-block back">返回</button>
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
					<input type="hidden" name="type" value="export">
					<div class="form-group">
						<label>管理部门：</label>
						<input type="text" name="department" value="<%= model.department %>" class="form-control" placeholder="请输入组织名称，并从列表中选择">
						<div id="departments"></div>
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
				<h4>导出excel数据表格列格式如下：</h4>
				<p></p>
				<table class="table table-striped">
					<thead>
						<tr>
							<th>列序号</th>
							<th>列名称(即：excel第一行名称)</th>
							<th>列含义</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>name</td>
							<td>客户姓名</td>
						</tr>
						<tr>
							<td>2</td>
							<td>mobile</td>
							<td>客户手机</td>
						</tr>
						<tr>
							<td>3</td>
							<td>deparment</td>
							<td>管理部门，用&gt;&gt;分隔部门层级</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

	</div>
</div>