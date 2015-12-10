<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">号卡订单管理</h4>
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
			<button class="btn btn-success delete">删除</button>
		</div>
		<h4><%= model.name %></h4>
		<p></p>
		<hr/>
	</div>
	<div id="addTemplate">
		<form>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h5 class="panel-title text-center">新增号卡订单</h5>
				</div>
				<div class="panel-body">
					<div class="form-group">
						<label>号卡：</label>
						<input type="text" name="mobile" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>套餐：<a id="selectPackage">选择套餐</a></label>
						<div id="package"></div>
						<input type="text" name="packageName" class="form-control" readonly>
						<input type="hidden" name="package" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<hr/>
					<div class="form-group">
						<label>总价：</label>
						<input type="text" name="price" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
				</div>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h5 class="panel-title text-center">客户信息</h5>
				</div>
				<div class="panel-body">
					<div class="form-group">
						<label>客户姓名：</label>
							<input type="text" name="customer[name]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>证件类型：</label>
							<input type="text" name="customer[cardtype]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>证件号码：</label>
							<input type="text" name="customer[cardno]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>证件地址：</label>
							<input type="text" name="customer[address]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>联系电话：</label>
							<input type="text" name="customer[contact][phone]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>联系地址：</label>
							<input type="text" name="customer[contact][address]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>营业厅：</label>
							<input type="text" name="" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="确定订购" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<button class="btn btn-primary back">取消</button>
						</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">修改号卡订单</h5>
			</div>
			<div class="panel-body">
				<form>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="确定订购" class="btn btn-danger">
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
	<div id="viewTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary edit">编辑</button>
			</div>
			<div class="panel-heading">
				<h5 class="panel-title text-center">查看号卡订单</h5>
			</div>
			<div class="panel-body">
				<form class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-2 control-label">订单号：</label>
						<div class="col-sm-10">
							<p class="form-control-static"></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">用户号码：</label>
						<div class="col-sm-10">
							<p class="form-control-static"></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">用户姓名：</label>
						<div class="col-sm-10">
							<p class="form-control-static"></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">物料名称：</label>
						<div class="col-sm-10">
							<p class="form-control-static"></p>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">物料ID：</label>
						<div class="col-sm-10">
							<p class="form-control-static"></p>
						</div>
					</div>
					<div class="panel panel-default">
						<div class="panel-heading">
							<h4 class="panel-title text-center">商品清单</h4>
						</div>
						<div class="panel-body">
							<div id="items">
								<h4>产品名称：</h4>
								<p>产品类型：产品价格：产品数量：</p>
							</div>
							<hr/>
							<div>
								<h3 class="text-right">总价：</h3>
							</div>
						</div>
					</div>
					<div class="panel panel-default">
						<div class="panel-heading">
							<h4 class="panel-title text-center">客户信息</h4>
						</div>
						<div class="panel-body">
							<table class="table table-striped">
								<tr>
									<td>客户姓名</td>
									<td></td>
								</tr>
								<tr>
									<td>证件类型</td>
									<td></td>
								</tr>
								<tr>
									<td>证件号码</td>
									<td></td>
								</tr>
								<tr>
									<td>证件地址</td>
									<td></td>
								</tr>
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
									<td></td>
								</tr>
								<tr>
									<td>收货地址</td>
									<td></td>
								</tr>
							</table>
						</div>
					</div>
				</form>
  				<button class="btn btn-primary btn-block back">返回</button>
			</div>
		</div>
	</div>
	<div id="packageTemplate">
		<div class="panel panel-success">
			<div class="panel-heading">
				<h4 class="panel-title text-center">号卡套餐</h4>
			</div>
			<div class="panel-body">
				<div class="btn-group btn-group-justified">
					<div class="btn btn-success tabControl">A套餐</div>
					<div class="btn btn-default tabControl">B套餐</div>
					<div class="btn btn-default tabControl">C套餐</div>
					<div class="btn btn-default tabControl">自由组合</div>
				</div>
				<hr/>
				<div class="tabs">
					<div class="tab">
						<div class="form-group">
							<input type="hidden" name="package" value="A">
							<a class="bg-success selectItem"><input type="radio" name="item[]" value="46" class="hidden">&nbsp; 46元套餐</a>&nbsp;
							<input type="radio" name="item[]" value="66">&nbsp;66元套餐&nbsp;
							<input type="radio" name="item[]" value="96">&nbsp;96元套餐&nbsp;
							<input type="radio" name="item[]" value="126">&nbsp;126元套餐&nbsp;
							<input type="radio" name="item[]" value="156">&nbsp;156元套餐&nbsp;
							<input type="radio" name="item[]" value="186">&nbsp;186元套餐&nbsp;
							<input type="radio" name="item[]" value="226">&nbsp;226元套餐&nbsp;
							<input type="radio" name="item[]" value="286">&nbsp;286元套餐&nbsp;
							<input type="radio" name="item[]" value="386">&nbsp;386元套餐&nbsp;
						</div>
					</div>
					<div class="tab">
						<div class="form-group">
							<input type="hidden" name="package" value="B">
							<input type="radio" name="item[]" value="46">&nbsp;46元套餐&nbsp;
							<input type="radio" name="item[]" value="66">&nbsp;66元套餐&nbsp;
							<input type="radio" name="item[]" value="96">&nbsp;96元套餐&nbsp;
							<input type="radio" name="item[]" value="126">&nbsp;126元套餐&nbsp;
							<input type="radio" name="item[]" value="156">&nbsp;156元套餐&nbsp;
							<input type="radio" name="item[]" value="186">&nbsp;186元套餐&nbsp;
						</div>
					</div>
					<div class="tab">
						<div class="form-group">
							<input type="hidden" name="package" value="C">
							<input type="radio" name="item[]" value="46">&nbsp;46元套餐&nbsp;
							<input type="radio" name="item[]" value="66">&nbsp;66元套餐&nbsp;
							<input type="radio" name="item[]" value="96">&nbsp;96元套餐&nbsp;
						</div>
					</div>
					<div class="tab">
							<h4>全国流量包</h4>
							<input type="hidden" name="package" value="D">
							<div class="form-group">
								<input type="radio" name="chinaData" value="">8元包100MB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;16元包300MB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;24元包500MB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;48元包1GB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;72元包2GB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;96元包3GB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;120元包4GB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;152元包5GB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;232元包11GB&nbsp;
							</div>
							<hr/>
							<h4>全国语音包</h4>
							<div class="form-group">
								<input type="radio" name="chinaVoice" value="">32元包200分钟&nbsp;
								<input type="radio" name="chinaVoice" value="">&nbsp;40元包300分钟&nbsp;
								<input type="radio" name="chinaVoice" value="">&nbsp;56元包500分钟&nbsp;
								<input type="radio" name="chinaVoice" value="">&nbsp;112元包1000分钟&nbsp;
								<input type="radio" name="chinaVoice" value="">&nbsp;160元包3000分钟&nbsp;
								<input type="radio" name="chinaVoice" value="">&nbsp;暂不需要&nbsp;
							</div>
							<hr/>
							<h4>短/彩信包</h4>
							<div class="form-group">
								<input type="radio" name="sms" value="">&nbsp;10元包200条&nbsp;
								<input type="radio" name="sms" value="">&nbsp;20元包400条&nbsp;
								<input type="radio" name="sms" value="">&nbsp;30元包600条&nbsp;
								<input type="radio" name="sms" value="">&nbsp;暂不需要&nbsp;
							</div>
							<h4>来电显示</h4>
							<div class="form-group">
								<input type="radio" name="displayNo" value="">&nbsp;6元/月来电显示&nbsp;
								<input type="radio" name="displayNo" value="">&nbsp;暂不需要&nbsp;
							</div>
					</div>
					<div class="form-group">
							<button class="btn btn-primary btn-block" id="packageSelected">确认</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>