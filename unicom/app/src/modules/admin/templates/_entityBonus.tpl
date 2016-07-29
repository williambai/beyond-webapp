<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">佣金管理</h4>
			</div>
			<div class="panel-body">
				<div>
					<div class="">
						<div class="btn btn-danger import">1.局方出账导入</div>
						<div class="btn btn-primary export">2.我方出账导出</div>
<!-- 						<div class="btn btn-danger">3.佣金发放导出</div>
						<div class="btn btn-primary">4.佣金发放后导入</div>
 -->					</div>
				</div>
				<p>&nbsp;</p>
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
				<label>&nbsp;年份：</label>
				<input type="text" name="year" class="form-control" value="<%= (new Date()).getFullYear() %>">
			</div>
			<div class="form-group">
				<label>&nbsp;月份：</label>
				<select class="form-control" name="month">
					<option value="1">1 月</option>
					<option value="2">2 月</option>
					<option value="3" selected>3 月</option>
					<option value="4">4 月</option>
					<option value="5">5 月</option>
					<option value="6">6 月</option>
					<option value="7">7 月</option>
					<option value="8">8 月</option>
					<option value="9">9 月</option>
					<option value="10">10 月</option>
					<option value="11">11 月</option>
					<option value="12">12 月</option>
				</select>
			</div>
			<div class="form-group">
				<label>&nbsp;状态：</label>
				<select class="form-control" name="status">
					<option value="">全部</option>
					<option value="未核算">未核算</option>
					<option value="已核算">已核算</option>
				</select>
			</div>
			<div class="form-group">
				<label>&nbsp;搜索：</label>
				<input type="text" name="searchStr" class="form-control" placeholder="用户名或手机号">
			</div>
			<div class="form-group">
				<input type="submit" value="过滤" class="btn btn-info btn-block">
			</div>
		</form>
		<hr/>
	</div>
	<div id="itemTemplate">
		<div class="item" id="<%= model._id %>">
			<div class="pull-right" >
				<button class="btn btn-success edit">修改</button>
				<button class="btn btn-danger delete">删除</button>
			</div>
			<h4><%= model.name %>&nbsp;&nbsp;<%= model.mobile %></h4>
			<p><%= model.year %>&nbsp;年<%= model.month %>&nbsp;月&nbsp;&nbsp;<%= model.status %></p>
			<hr/>
		</div>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">发放佣金</h4>
			</div>
			<div class="panel-body">
				<form id="roleForm">
					<div class="form-group">
						<label>用户名：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>手机号码：</label>
						<input type="text" name="mobile" value="<%= model.mobile %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>年份：</label>
						<input type="text" name="year" value="<%= model.year %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>月份：</label>
						<input type="text" name="month" value="<%= model.month %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>业务金额：</label>
						<input type="text" name="amount" value="<%= model.amount %>" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>扣除税收：</label>
						<input type="text" name="tax" value="<%= model.tax %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>实际发放：</label>
						<input type="text" name="cash" value="<%= model.cash %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>变更原因：</label>
						<textarea class="form-control" name="reason"><%= model.reason %></textarea>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="未核算" checked>&nbsp;&nbsp;未核算&nbsp;&nbsp;
							<input type="radio" name="status" value="已核算">&nbsp;&nbsp;已核算&nbsp;&nbsp;
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
				<h4 class="panel-title text-center">导入局方出账数据</h4>
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
				<h3 class="panel-title text-center">导出我方出账数据</h3>
			</div>
			<div class="panel-body">
				<form>
					<input type="hidden" name="action" value="export">
					<div class="form-group">
						<label>&nbsp;年份：</label>
						<input type="text" name="year" class="form-control" value="<%= (new Date()).getFullYear() %>">
					</div>
					<div class="form-group">
						<label>&nbsp;月份：</label>
						<select class="form-control" name="month">
							<option value="1" selected>1 月</option>
							<option value="2">2 月</option>
							<option value="3">3 月</option>
							<option value="4">4 月</option>
							<option value="5">5 月</option>
							<option value="6">6 月</option>
							<option value="7">7 月</option>
							<option value="8">8 月</option>
							<option value="9">9 月</option>
							<option value="10">10 月</option>
							<option value="11">11 月</option>
							<option value="12">12 月</option>
						</select>
					</div>
					<div class="form-group">
						<label>地区：</label>
						<select class="form-control" name="city">
							<option value="">不限</option>
							<option value="贵阳">贵阳</option>
							<option value="遵义">遵义</option>
							<option value="黔东南">黔东南</option>
							<option value="安顺">安顺</option>
							<option value="黔南">黔南</option>
							<option value="六盘水">六盘水</option>
							<option value="黔西南">黔西南</option>
							<option value="铜仁">铜仁</option>
							<option value="毕节">毕节</option>
						</select>
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
				<h4>导出Excel数据列格式如下：</h4>
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