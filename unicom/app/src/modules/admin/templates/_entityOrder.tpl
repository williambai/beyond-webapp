<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary export">导出</button>
			</div>
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
			<input type="hidden" name="action" value="search">
			<div class="form-group">
				<label>&nbsp;从：&nbsp;</label>
				<input type="date" name="from" class="form-control" placeholder="yyyy/mm/dd">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<label>&nbsp;到：&nbsp;</label>
				<input type="date" name="to" class="form-control" placeholder="yyyy/mm/dd">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<label>&nbsp;&nbsp;</label>
				<input type="text" name="searchStr" class="form-control" placeholder="手机号码">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<select class="form-control" name="status">
					<option value="">全部</option>
					<option value="新建">新建</option>
					<option value="已确认">用户已确认</option>
					<option value="已处理">系统已处理</option>
					<option value="成功">成功</option>
					<option value="失败">失败</option>
				</select>&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<input type="submit" value="筛选" class="btn btn-info btn-block">
			</div>
		</form>
		<hr/>
	</div>
	<div id="itemTemplate">
		<div class="pull-right" id="<%= model._id %>">
			<button class="btn btn-success edit">详情</button>
		</div>
		<h4><%= model.goods && model.goods.name %>&nbsp;<span style="color:red;"><%= model.status %></span></h4>
		<p><i class="fa fa-user"></i>&nbsp;<%= model.customer && model.customer.mobile %>&nbsp;&nbsp;是&nbsp;<%= model.createBy && model.createBy.mobile %>&nbsp;创建</p>
		<p><i class="fa fa-clock-o"></i>&nbsp;<%= model.deltatime %>&nbsp;&nbsp;<i class="fa fa-calendar"></i>&nbsp;<%= new Date(model.lastupdatetime).toLocaleString() %></p>
		<hr/>
	</div>
	<div id="editTemplate">
		<form>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h5 class="panel-title text-center">编辑订单</h5>
				</div>
				<div class="panel-body">
					<div class="form-group">
						<label>订单号：</label>
						<input type="text" class="form-control" value="<%= model._id %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>业务号码：</label>
							<input type="text" value="<%= model.customer.mobile %>&nbsp;&nbsp;<%= model.customer.name %>" class="form-control" readonly>
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>产品名称：</label>
						<input type="text" class="form-control" value="<%= model.goods.name %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>生效方式：</label>
							<input type="text" value="<%= model.effect %>" class="form-control" readonly>
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>业务(短信)编码：</label>
						<input type="text" class="form-control" value="<%= model.goods.smscode %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料编码：</label>
						<input type="text" class="form-control" value="<%= model.goods.barcode %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>产品数量：</label>
						<input type="text" class="form-control" value="<%= model.quantity %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>总价：</label>
						<input type="text" class="form-control" value="<%= model.total %>" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>佣金：</label>
							<input type="text" value="<%= model.bonus %>" class="form-control"  readonly>
							<span class="help-block"></span>
					</div>
<!-- 					<div class="form-group">
						<label>积分：</label>
							<input type="text" value="<%= model.bonus.points %>" class="form-control" readonly>
							<span class="help-block"></span>
					</div>
 -->
 					<div class="form-group">
						<label>订单创建人：</label>
							<input type="text" value="<%= model.createBy.mobile %>" class="form-control" readonly>
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>所属营业厅：</label>
							<input type="text" value="<%= model.department.name %>" class="form-control" readonly>
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>所属城市：</label>
							<input type="text" value="<%= model.department.city %>" class="form-control" readonly>
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>所属地区编码：</label>
							<input type="text" value="<%= model.department.district %>" class="form-control" readonly>
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>所属网络编码：</label>
							<input type="text" value="<%= model.department.grid %>" class="form-control" readonly>
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>订单状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="新建" checked>&nbsp;&nbsp;新建&nbsp;&nbsp;
							<input type="radio" name="status" value="已确认">&nbsp;&nbsp;客户已确认&nbsp;&nbsp;
							<input type="radio" name="status" value="已处理">&nbsp;&nbsp;系统已处理&nbsp;&nbsp;
							<input type="radio" name="status" value="成功">&nbsp;&nbsp;成功&nbsp;&nbsp;
							<input type="radio" name="status" value="失败">&nbsp;&nbsp;失败&nbsp;&nbsp;
						</div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
								<input type="submit" value="更改订单状态" class="btn btn-danger">
							</div>
							<div class="btn-group">
								<button class="btn btn-primary back">取消</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">更新历史</h4>
			</div>
			<div class="panel-body" id="history">
			</div>
		</div>
	</div>
	<div id="exportTemplate">
		<div class="panel panel-default" id="exportForm">
			<div class="panel-heading">
				<h3 class="panel-title text-center">导出订单</h3>
			</div>
			<div class="panel-body">
				<form>
					<input type="hidden" name="action" value="export">
					<div class="form-group">
						<label>起始日期：</label>
							<input type="date" name="from" value="" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>截止日期：</label>
							<input type="date" name="to" value="" class="form-control">
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
				<p></p>
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
							<td>customer.mobile</td>
							<td>客户号码</td>
						</tr>
						<tr>
							<td>2</td>
							<td>goods.name</td>
							<td>产品名称</td>
						</tr>
						<tr>
							<td>3</td>
							<td>goods.category</td>
							<td>产品类别</td>
						</tr>
						<tr>
							<td>4</td>
							<td>goods.barcode</td>
							<td>产品编码</td>
						</tr>
						<tr>
							<td>5</td>
							<td>goods.price</td>
							<td>产品价格</td>
						</tr>
						<tr>
							<td>6</td>
							<td>createBy.name</td>
							<td>推荐人姓名</td>
						</tr>
						<tr>
							<td>7</td>
							<td>createBy.mobile</td>
							<td>推荐人号码</td>
						</tr>
						<tr>
							<td>8</td>
							<td>goods.bonus</td>
							<td>推荐人佣金</td>
						</tr>
						<tr>
							<td>9</td>
							<td>department.name</td>
							<td>渠道名称</td>
						</tr>
						<tr>
							<td>10</td>
							<td>department.city</td>
							<td>所在城市</td>
						</tr>
						<tr>
							<td>11</td>
							<td>department.district</td>
							<td>所在地区</td>
						</tr>
						<tr>
							<td>12</td>
							<td>department.grid</td>
							<td>所在网格</td>
						</tr>
						<tr>
							<td>13</td>
							<td>lastupdatetime</td>
							<td>发生时间</td>
						</tr>
						<tr>
							<td>14</td>
							<td>status</td>
							<td>订单状态</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<!-- 
	<div id="viewTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-danger edit">编辑</button>
			</div>
			<button class="btn btn-primary back">返回</button>
			<div class="panel-heading">
				<h5 class="panel-title text-center">查看订单</h5>
			</div>
			<div class="panel-body">
				<form class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-2">订单号：</label>
						<div class="col-sm-10">
							<p><%= model._id %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2">客户：</label>
						<div class="col-sm-10">
							<p><%= model.customer.id %>&nbsp;&nbsp;<%= model.customer.name %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2">订单名称：</label>
						<div class="col-sm-10">
							<p><%= model.name %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2">订单描述：</label>
						<div class="col-sm-10">
							<p><%= model.description %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2">订单状态：</label>
						<div class="col-sm-10">
							<p><%= model.status %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2">佣金总额：</label>
						<div class="col-sm-10">
							<p><%= model.bonus.income %>&nbsp;&nbsp;元</p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2">返佣方式：</label>
						<div class="col-sm-10">
							<p><%= model.bonus.times %>&nbsp;&nbsp;批</p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2">返佣状态：</label>
						<div class="col-sm-10">
							<p><%= model.bonus.cashStatus %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2">佣金兑现：</label>
						<div class="col-sm-10">
							<p><%= model.bonus.cash %>&nbsp;&nbsp;元</p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2">积分：</label>
						<div class="col-sm-10">
							<p><%= model.bonus.points %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2">物料名称：</label>
						<div class="col-sm-10">
							<p><%= model.goodId %></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2">物料ID：</label>
						<div class="col-sm-10">
							<p><%= model.goodName %></p>
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
							<table class="table table-striped">
								<tbody>
									<tr>
										<td>客户姓名：</td>
										<td><%= model.customerInfo.name %></td>
									</tr>
									<tr>
										<td>客户电话：</td>
										<td><%= model.customerInfo.phone %></td>
									</tr>
									<tr>
										<td>证件类型：</td>
										<td><%= model.customerInfo.idType %></td>
									</tr>
									<tr>
										<td>证件号码</td>
										<td><%= model.customerInfo.idNo %></td>
									</tr>
									<tr>
										<td>证件地址</td>
										<td><%= model.customerInfo.idAddress %></td>
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
									<td><%= model.dispatch.method %></td>
								</tr>
								<tr>
									<td>联系电话</td>
									<td><%= model.dispatch.phone %></td>
								</tr>
								<tr>
									<td>收货地址</td>
									<td><%= model.dispatch.address %></td>
								</tr>
							</table>
						</div>
					</div>
					<div>
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
								<button class="btn btn-danger edit">编辑</button>
							</div>
							<div class="btn-group">
								<button class="btn btn-primary back">返回</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div> -->