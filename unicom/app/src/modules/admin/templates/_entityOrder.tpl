<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">订单管理</h4>
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
				<input type="text" name="searchStr" class="form-control" placeholder="客户手机号码">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<select class="form-control">
					<option>全部</option>
					<option>新建</option>
					<option>完成</option>
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
			<button class="btn btn-success view">详情</button>
<!-- 			<button class="btn btn-success delete">删除</button>
 -->		</div>
		<h4><%= model.name %></h4>
		<p><%= model.description %>, <%= model.lastupdatetime %></p>
		<hr/>
	</div>
	<div id="editTemplate">
		<form class="form-horizontal">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h5 class="panel-title text-center">编辑订单</h5>
				</div>
				<div class="panel-body">
					<div class="form-group">
						<label class="col-sm-2 control-label">订单号：</label>
						<div class="col-sm-10">
							<p class="form-control-static"><%= model._id %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">订单名称：</label>
						<div class="col-sm-10">
							<p class="form-control-static"><%= model.name %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">订单描述：</label>
						<div class="col-sm-10">
							<p class="form-control-static"><%= model.description %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">订单状态：</label>
						<div class="col-sm-10">
							<select name="status">
								<option>新建</option>
								<option>新建</option>
								<option>新建</option>
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title text-center">商品清单</h4>
				</div>
				<div class="panel-body">
					<div id="items">
					</div>
					<div>
						<h3 class="text-right">总价：<%= Number(model.total).toFixed(2) %>元</h3>
					</div>
				</div>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title text-center">客户信息</h4>
				</div>
				<div class="panel-body">
					<div class="form-group">
						<label>客户姓名：</label>
							<input type="text" name="customer[name]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>证件类型：</label>
							<input type="text" name="customer[idType]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>证件号码：</label>
							<input type="text" name="customer[idNo]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>证件地址：</label>
							<input type="text" name="customer[idAddress]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>联系电话：</label>
							<input type="text" name="customer[phone]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>联系地址：</label>
							<input type="text" name="customer[address]" class="form-control">
							<span class="help-block"></span>
					</div>
				</div>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title text-center">配送信息</h4>
				</div>
				<div class="panel-body">
					<div class="form-group">
						<label>配送方式：</label>
							<input type="text" name="dispatch" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>联系电话：</label>
							<input type="text" name="" value="<%= model.customer.mobile %>" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>收货地址：</label>
							<input type="text" name="" value="<%= model.customer.address %>" class="form-control">
							<span class="help-block"></span>
					</div>
				</div>
			</div>
			<div class="form-group">
				<div class="btn-group btn-group-justified">
					<div class="btn-group">
						<input type="submit" value="更改客户信息" class="btn btn-danger">
					</div>
					<div class="btn-group">
						<button class="btn btn-primary back">取消</button>
					</div>
				</div>
			</div>
		</form>
	</div>
	<div id="viewTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary edit">编辑</button>
			</div>
			<div class="panel-heading">
				<h5 class="panel-title text-center">查看订单</h5>
			</div>
			<div class="panel-body">
				<form class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-2 control-label">订单号：</label>
						<div class="col-sm-10">
							<p class="form-control-static"><%= model._id %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">订单名称：</label>
						<div class="col-sm-10">
							<p class="form-control-static"><%= model.name %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">订单描述：</label>
						<div class="col-sm-10">
							<p class="form-control-static"><%= model.description %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">订单状态：</label>
						<div class="col-sm-10">
							<p class="form-control-static"><%= model.status %></p>
						</div>
					</div>
<!-- 					<div class="form-group">
						<label class="col-sm-2 control-label">物料名称：</label>
						<div class="col-sm-10">
							<p class="form-control-static"><%= model.goodId %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">物料ID：</label>
						<div class="col-sm-10">
							<p class="form-control-static"><%= model.goodName %></p>
						</div>
					</div>
 -->					<div class="panel panel-default">
						<div class="panel-heading">
							<h4 class="panel-title text-center">商品清单</h4>
						</div>
						<div class="panel-body">
							<div id="items">
							</div>
							<div>
								<h3 class="text-right">总价：<%= Number(model.total).toFixed(2) %>元</h3>
							</div>
						</div>
					</div>
					<div class="panel panel-default">
						<div class="panel-heading">
							<h4 class="panel-title text-center">客户信息</h4>
						</div>
						<div class="panel-body">
							<table class="table table-striped">
								<tbody>
									<tr>
										<td>客户姓名：</td>
										<td><%= model.customer.name %></td>
									</tr>
									<tr>
										<td>客户电话：</td>
										<td><%= model.customer.phone %></td>
									</tr>
									<tr>
										<td>证件类型：</td>
										<td><%= model.customer.idType %></td>
									</tr>
									<tr>
										<td>证件号码</td>
										<td><%= model.customer.idNo %></td>
									</tr>
									<tr>
										<td>证件地址</td>
										<td><%= model.customer.idAddress %></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div class="panel panel-default">
						<div class="panel-heading">
							<h4 class="panel-title text-center">配送信息</h4>
						</div>
						<div class="panel-body">
							<table class="table table-striped">
								<tr>
									<td>配送方式：</td>
									<td>物流配送</td>
								</tr>
								<tr>
									<td>联系电话</td>
									<td><%= model.customer.mobile %></td>
								</tr>
								<tr>
									<td>收货地址</td>
									<td><%= model.customer.address %></td>
								</tr>
							</table>
						</div>
					</div>
				</form>
  				<button class="btn btn-primary btn-block back">返回</button>
			</div>
		</div>
	</div>
</div>