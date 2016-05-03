<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
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
				<h4><%= model.accountName %></h4>
				<p><%= model.bankName %></p>
				<p><i class="fa fa-user"></i>&nbsp;<%= model.mobile %></p>
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
							<td>mobile</td>
							<td>手机号码</td>
						</tr>
						<tr>
							<td>2</td>
							<td>bankName</td>
							<td>银行名称</td>
						</tr>
						<tr>
							<td>3</td>
							<td>bankCode</td>
							<td>银行代码</td>
						</tr>
						<tr>
							<td>4</td>
							<td>bankAddr</td>
							<td>开户地址</td>
						</tr>
						<tr>
							<td>5</td>
							<td>accountName</td>
							<td>银行卡主姓名</td>
						</tr>
						<tr>
							<td>6</td>
							<td>accountNo</td>
							<td>银行卡号码</td>
						</tr>
						<tr>
							<td>7</td>
							<td>cardId</td>
							<td>身份证号码</td>
						</tr>
						<tr>
							<td>8</td>
							<td>expired</td>
							<td>有效期</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>