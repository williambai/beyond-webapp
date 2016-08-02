<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-danger apply">审核</button>
				<button class="btn btn-primary import">导入</button>
				<button class="btn btn-primary export">导出</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">银行卡管理</h4>
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
				<input type="text" name="searchStr" class="form-control" placeholder="手机号码">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<input type="submit" value="查询" class="btn btn-info btn-block">
			</div>
		</form>
		<hr/>
	</div>
	<div id="itemTemplate">
		<div>
			<div class="item"  id="<%= model._id %>">
				<div class="pull-right">
					<button class="btn btn-success edit">详情</button>
				</div>
				<h4>[<%= model.username %>]<%= model.mobile %></h4>
				<p><%= model.bankName %></p>
				<p style="color:red;">账户：<%= model.accountName %>&nbsp;卡号：<%= model.accountNo %></p>
			</div>
			<hr/>
		</div>
	</div>
	<div id="editTemplate">
		<form>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h5 class="panel-title text-center">银行卡</h5>
				</div>
				<div class="panel-body">
					<div class="form-group">
						<label>用户姓名：</label>
						<input type="text" class="form-control" value="<%= model.username %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>邮箱/手机号码：</label>
						<input type="text" class="form-control" value="<%= model.mobile %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>开户银行：</label>
						<input type="text" class="form-control" value="<%= model.bankName %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>账户姓名：</label>
						<input type="text" class="form-control" value="<%= model.accountName %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>账号：</label>
							<input type="text" value="<%= model.accountNo %>" class="form-control" readonly>
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>账户有效期：</label>
						<input type="text" class="form-control" value="<%= model.expired %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>开户行地址：</label>
						<input type="text" class="form-control" value="<%= model.bankAddr %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>身份证号码：</label>
						<input type="text" class="form-control" value="<%= model.cardId %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
<!-- 							<div class="btn-group">
								<input type="submit" value="更改订单状态" class="btn btn-danger">
							</div>
 -->							
 							<div class="btn-group">
								<button class="btn btn-primary back">返回</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
	<div id="importTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">导入渠道</h4>
			</div>
			<div class="panel-body">
				<p style="color:red;">请点击<i class="fa fa-plus-circle"></i>选择要上传的文件，点击已上传的文件，可以取消上传。</p>
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
				<h3 class="panel-title text-center">导出银行卡</h3>
			</div>
			<div class="panel-body">
				<form>
					<input type="hidden" name="action" value="export">
<!-- 					<div class="form-group">
						<label>起始日期：</label>
							<input type="date" name="starttime" value="" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>截止日期：</label>
							<input type="date" name="endtime" value="" class="form-control">
							<span class="help-block"></span>
					</div>
 -->					<div class="form-group">
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
				<h4>导出Excel数据表格列格式如下：</h4>
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