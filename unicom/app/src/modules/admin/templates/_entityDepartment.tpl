<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary import">导入</button>
				<button class="btn btn-primary export">导出</button>
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">渠道管理</h4>
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
				<input type="text" name="searchStr" class="form-control" placeholder="渠道名称">&nbsp;&nbsp;
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
		<p>城市：<%= model.city %>&nbsp;地区：<%= model.district %>&nbsp;网格：<%= model.grid %></p>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改渠道</h4>
			</div>
			<div class="panel-body">
				<form id="roleForm">
					<div class="form-group">
						<label>渠道名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>渠道编码：</label>
						<input type="text" name="nickname" value="<%= model.nickname %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>所在城市：</label>
						<input type="text" name="city" value="<%= model.city %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>所在地区：</label>
						<input type="text" name="district" value="<%= model.district %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>所在网格：</label>
						<input type="text" name="grid" value="<%= model.grid %>" class="form-control">
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
						<label>渠道描述：</label>
						<textarea name="description" class="form-control"><%= model.description %></textarea>
						<span class="help-block"></span>
					</div>
<!-- 					<div class="form-group">
						<label>归属(上级渠道)：</label>
						<input type="hidden" name="parent" value="<%= model.parent %>">
						<input type="text" name="path" value="<%= model.path %>" class="form-control" placeholder="请输入上一级渠道名称">
						<div id="departments"></div>
						<span class="help-block"></span>
					</div>
 -->
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
				<h4 class="panel-title text-center">导入渠道</h4>
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
					<div style="color:red;">
						<p>注意1：请慎重选择全量导入方式。全量导入将先删除当前数据表中现有的全部数据，然后导入新数据。</p>
						<p>注意2：导入时，请先将表示列名称的首行删除，并且保证最后一行不要留空行。(即，文件只留数据，不留标题和空行)</p>
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
				<h4>导入csv数据表格列格式如下：</h4>
				<table class="table table-striped">
					<thead>
						<tr>
							<th>列序号</th>
							<th>列名称(即：csv第一行名称)</th>
							<th>列含义</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>name</td>
							<td>渠道名称</td>
						</tr>
						<tr>
							<td>2</td>
							<td>nickname</td>
							<td>渠道编码</td>
						</tr>
						<tr>
							<td>3</td>
							<td>city</td>
							<td>所在城市</td>
						</tr>
						<tr>
							<td>4</td>
							<td>district</td>
							<td>所在地区</td>
						</tr>
						<tr>
							<td>5</td>
							<td>grid</td>
							<td>所在网格</td>
						</tr>
						<tr>
							<td>6</td>
							<td>address</td>
							<td>所在地址</td>
						</tr>
						<tr>
							<td>7</td>
							<td>zipcode</td>
							<td>邮政编码</td>
						</tr>
						<tr>
							<td>8</td>
							<td>manager</td>
							<td>负责人</td>
						</tr>
						<tr>
							<td>9</td>
							<td>phone</td>
							<td>联系电话</td>
						</tr>
						<tr>
							<td>10</td>
							<td>website</td>
							<td>网站地址</td>
						</tr>
						<tr>
							<td>11</td>
							<td>description</td>
							<td>渠道描述</td>
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
				<h3 class="panel-title text-center">导出渠道</h3>
			</div>
			<div class="panel-body">
				<form>
					<input type="hidden" name="type" value="export">
<!-- 					<div class="form-group">
						<label>渠道(路径)名称：</label>
						<input type="text" name="path" class="form-control" placeholder="请输入渠道名称，并从列表中选择；为空，则表示导出全部渠道">
						<div id="departments"></div>
						<span class="help-block"></span>
					</div>
 -->
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
							<th>列名称(即：csv第一行名称)</th>
							<th>列含义</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>name</td>
							<td>渠道名称</td>
						</tr>
						<tr>
							<td>2</td>
							<td>nickname</td>
							<td>渠道编码</td>
						</tr>
						<tr>
							<td>3</td>
							<td>city</td>
							<td>所在城市</td>
						</tr>
						<tr>
							<td>4</td>
							<td>district</td>
							<td>所在地区</td>
						</tr>
						<tr>
							<td>5</td>
							<td>grid</td>
							<td>所在网格</td>
						</tr>
						<tr>
							<td>6</td>
							<td>address</td>
							<td>所在地址</td>
						</tr>
						<tr>
							<td>7</td>
							<td>zipcode</td>
							<td>邮政编码</td>
						</tr>
						<tr>
							<td>8</td>
							<td>manager</td>
							<td>负责人</td>
						</tr>
						<tr>
							<td>9</td>
							<td>phone</td>
							<td>联系电话</td>
						</tr>
						<tr>
							<td>10</td>
							<td>website</td>
							<td>网站地址</td>
						</tr>
						<tr>
							<td>11</td>
							<td>description</td>
							<td>渠道描述</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>