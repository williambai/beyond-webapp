<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary import">导入</button>
				<button class="btn btn-primary export">导出</button>
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">物料管理</h4>
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
			<input type="hidden" name="action" value="search">
			<div class="form-group">
				<label>&nbsp;&nbsp;</label>
				<input type="text" name="searchStr" class="form-control" placeholder="物料名称或物料类型">&nbsp;&nbsp;
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
		<h4><%= model.name %>&nbsp;&nbsp;<%= model.price %><%= model.unit %></h4>
		<p>类型：<%= model.category %>, 状态：<%= model.status %></p>
		<p></p>
		<hr/>
	</div>
 	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改物料</h4>
			</div>
			<div class="panel-body">
				<form id="goodsForm">
					<div class="form-group">
						<label>物料名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料编码：</label>
						<input type="text" name="barcode" value="<%= model.barcode %>" class="form-control" placeholder="BSS系统对应的业务ID">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料描述：</label>
						<textarea name="description" class="form-control"><%= model.description%></textarea>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料类型：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="category" value="2G" checked>&nbsp;&nbsp;2G
							<input type="radio" name="category" value="3G">&nbsp;&nbsp;3G
							<input type="radio" name="category" value="4G">&nbsp;&nbsp;4G
						</div>
					</div>
					<div class="form-group">
						<label>参考价格：</label>
						<input type="text" name="price" value="<%= model.price %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>价格单位：</label>
						<input type="text" name="unit" value="<%= model.unit %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>参考数量：</label>
						<input type="text" name="quantity" value="<%= model.quantity %>" class="form-control">
						<span class="help-block"></span>
					</div>
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
				<h4 class="panel-title text-center">导入物料</h4>
			</div>
			<div class="panel-body">
				<p>请点击<i class="fa fa-plus-circle"></i>选择要上传的文件，点击已上传的文件，可以取消上传。</p>
				<p>友情提示：为保证导入效率，每次最好仅选择导入一个文件。</p>
				<form>
					<input type="hidden" name="action" value="import">
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
				<h3 class="panel-title text-center">导出物料</h3>
			</div>
			<div class="panel-body">
				<form>
					<input type="hidden" name="action" value="export">
					<div class="form-group">
						<label>物料分类：</label>
						<input type="text" name="category" class="form-control" placeholder="请输入物料分类名称，为空，则全部导出">
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
					</tbody>
				</table>
			</div>
		</div>
	</div>	
</div>