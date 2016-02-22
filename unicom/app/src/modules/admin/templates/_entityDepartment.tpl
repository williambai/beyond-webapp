<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary import">导入</button>
				<button class="btn btn-primary export">导出</button>
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">组织管理</h4>
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
				<label>搜索：</label>
				<input type="hidden" name="type" value="search">
				<input type="text" name="searchStr" class="form-control" placeholder="组织名称">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<input type="submit" value="查询" class="btn btn-info btn-block">
			</div>
		</form>
	</div>
	<div id="itemTemplate">
		<hr/>
		<div class="pull-right" id="<%= model._id %>">
			<button class="btn btn-success edit">编辑</button>
			<button class="btn btn-danger delete">删除</button>
		</div>
		<h4><%= model.name %></h4>
		<p>组织关系：<%= model.path %></p>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改组织</h4>
			</div>
			<div class="panel-body">
				<form id="roleForm">
					<div class="form-group">
						<label>组织名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>组织编码：</label>
						<input type="text" name="nickname" value="<%= model.name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>组织描述：</label>
						<textarea name="description" class="form-control"><%= model.description %></textarea>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>所在地址：</label>
						<input type="text" name="address" value="<%= model.address %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>邮政编码：</label>
						<input type="text" name="zipcode" value="<%= model.zipcode %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>负责人：</label>
						<input type="text" name="manager" value="<%= model.manager %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>联系电话：</label>
						<input type="text" name="phone" value="<%= model.phone %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>网站地址：</label>
						<input type="text" name="website" value="<%= model.website %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>归属(上级组织)：</label>
						<input type="hidden" name="parent" value="<%= model.parent %>">
						<input type="text" name="path" value="<%= model.path %>" class="form-control" placeholder="请输入上一级组织名称">
						<div id="departments"></div>
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
				<h4 class="panel-title text-center">导入组织</h4>
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
						<label>导入方式：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="method" value="增量" checked>&nbsp;&nbsp;增量&nbsp;&nbsp;
							<input type="radio" name="method" value="全量">&nbsp;&nbsp;全量&nbsp;&nbsp;
						</div>
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
							<td>组织名称</td>
						</tr>
						<tr>
							<td>2</td>
							<td>nickname</td>
							<td>组织编码</td>
						</tr>
						<tr>
							<td>3</td>
							<td>description</td>
							<td>组织描述</td>
						</tr>
						<tr>
							<td>4</td>
							<td>address</td>
							<td>所在地址</td>
						</tr>
						<tr>
							<td>5</td>
							<td>postcode</td>
							<td>邮政编码</td>
						</tr>
						<tr>
							<td>6</td>
							<td>contact</td>
							<td>负责人</td>
						</tr>
						<tr>
							<td>7</td>
							<td>phone</td>
							<td>联系电话</td>
						</tr>
						<tr>
							<td>8</td>
							<td>website</td>
							<td>网站地址</td>
						</tr>
						<tr>
							<td>9</td>
							<td>path</td>
							<td>组织关系路径，以"&gt;&gt;"分隔</td>
						</tr>
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
				<h3 class="panel-title text-center">导出组织</h3>
			</div>
			<div class="panel-body">
				<form>
					<input type="hidden" name="type" value="export">
					<div class="form-group">
						<label>组织(路径)名称：</label>
						<input type="text" name="path" class="form-control" placeholder="请输入组织名称，并从列表中选择；为空，则表示导出全部组织">
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
							<td>组织名称</td>
						</tr>
						<tr>
							<td>2</td>
							<td>nickname</td>
							<td>组织编码</td>
						</tr>
						<tr>
							<td>3</td>
							<td>description</td>
							<td>组织描述</td>
						</tr>
						<tr>
							<td>4</td>
							<td>address</td>
							<td>所在地址</td>
						</tr>
						<tr>
							<td>5</td>
							<td>postcode</td>
							<td>邮政编码</td>
						</tr>
						<tr>
							<td>6</td>
							<td>contact</td>
							<td>负责人</td>
						</tr>
						<tr>
							<td>7</td>
							<td>phone</td>
							<td>联系电话</td>
						</tr>
						<tr>
							<td>8</td>
							<td>website</td>
							<td>网站地址</td>
						</tr>
						<tr>
							<td>9</td>
							<td>path</td>
							<td>组织关系路径，以"&gt;&gt;"分隔</td>
						</tr>
<!-- 					
						<tr>
							<td>9</td>
							<td>department[0]</td>
							<td>所属部门根层级名称</td>
						</tr>
						<tr>
							<td>10</td>
							<td>deparment[1]</td>
							<td>所属部门第二层级名称</td>
						</tr>
						<tr>
							<td>11</td>
							<td>deparment[2]</td>
							<td>所属部门第三层级名称</td>
						</tr>
						<tr>
							<td>12</td>
							<td>department[...]</td>
							<td>所属部门第...层级名称</td>
						</tr>
						<tr>
							<td>13</td>
							<td>deparment[n]</td>
							<td>所属部门第n层级名称</td>
						</tr>
 -->
 					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>