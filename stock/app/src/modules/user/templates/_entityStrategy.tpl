<div>
	<div id="searchTemplate">
		<form class="form-inline">
			<div class="form-group">
				<label>从：</label>
				<div class="input-group">
					<input type="date" name="from" class="form-control" placeholder="" />
				</div>
			</div>
			<div class="form-group">
				<label>到：</label>
				<div class="input-group">
					<input type="date" name="to" class="form-control" placeholder="" />
				</div>
			</div>
			<div class="form-group">
				<label></label>
				<div class="input-group">
					<input type="text" name="searchStr" class="form-control" placeholder="股票代码" />
				</div>
			</div>
			<input type="submit" value="过滤" class="btn btn-primary"/>
		</form>
	</div>
	<div id="listTemplate">
		<div class="panel panel-default">
			<div class="pull-left">
				<a href="/export/strategy" class="btn btn-info" onclick="return false;">导出</a>
				<button class="btn btn-danger">编辑</button>
			</div>
			<div class="pull-right">
				<a href="#strategy/new" class="btn btn-info">新增</a>
			</div>
			<div class="panel-heading">
				<h3 class="panel-title text-center">&nbsp;</h3>
			</div>
			<div class="panel-body">
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div class="pull-right">
			<% var date = new Date(model.lastupdatetime); %>
			<p>
				<a href="#strategy/view/<%= model._id %>" id="">具体参数</a>
				&nbsp;&nbsp;
				<a href="#strategy/trading/record/<%= model.symbol %>
					/
					<%= date.getTime() %>" id="">交易明细</a>
			</p>
		</div>
		<div>
			<h4>
				<a href="#strategy/trading/graph/<%= model.symbol %>
					/
					<%= date.getTime() %>
					">
					<%= model.symbol %></a>
				&nbsp;&nbsp;
				<%= model.stock.name %>
				&nbsp;&nbsp;
				<% if(model.status.code == 0){ %>
				<span style="background-color: red; color: white;">
					<%= model.status.message %></span>
				<% }else{ %>
				<span style="background-color: green; color: white;">
					<%= model.status.message %></span>
				<% } %></h4>
			<p>
				创建时间：
				<%= date.getFullYear() +'-' + (1+date.getMonth()) + '-' + (date.getDate()) + ' '+ date.getHours() + ':'+ date.getMinutes() + ':'+ date.getSeconds() %>
				&nbsp;&nbsp;交易次数：
				<%= model.times %></p>
		</div>
		<div class="graph"></div>
		<hr/>
	</div>
	<div id="addTemplate">
		<div class="pull-left">
			<button onclick="window.history.back();return false;" class="btn btn-primary" id="back">返回</button>
		</div>
		<p>&nbsp;</p>
		<hr/>
		<div class="">
			<div class="">
				<div class="">
					<div class="panel panel-default" id="strategyForm">
						<div class="panel-heading">
							<h3 class="panel-title text-center">新增交易品种</h3>
						</div>
						<div class="panel-body">
							<form role="form">
								<div class="form-group">
									<label>品种编号：</label>
									<input type="text" name="symbol" value="<%= model.symbol %>" class="form-control input-sm" placeholder="如，sh600030">
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<label>股票名称：</label>
									<input type="text" name="stock[name]" value="<%= model.stock.name %>" class="form-control input-sm" placeholder="如，中信证券">
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<label>股票代码：</label>
									<input type="text" name="stock[code]" value="<%= model.stock.code %>" class="form-control input-sm" placeholder="如，600030">
									<span class="help-block"></span>
								</div>
								<fiedset>
									<legend>参数设置</legend>
									<div class="form-group">
										<label>风险上限：</label>
										<input type="text" name="params[risk_h]" value="<%= model.params.risk_h %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>风险下限：</label>
										<input type="text" name="params[risk_l]" value="<%= model.params.risk_l %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>起始交易价格：</label>
										<input type="text" name="params[init_p]" value="<%= model.params.init_p %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>首次交易量：</label>
										<input type="text" name="params[init_v]" value="<%= model.params.init_v %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>下跌买入(%)：</label>
										<input type="text" name="params[buy_lt]" value="<%= model.params.buy_lt %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>上涨卖出(%)：</label>
										<input type="text" name="params[sell_gt]" value="<%= model.params.sell_gt %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>单次交易量：</label>
										<input type="text" name="params[quantity]" value="<%= model.params.quantity %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>最大交易次数：</label>
										<input type="text" name="params[times_max]" value="<%= model.params.times_max %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>最大交易深度：</label>
										<input type="text" name="params[depth]" value="<%= model.params.depth %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
								</fiedset>
								<div class="form-group">
									<input type="hidden" name="status[code]" value="0">
									<input type="checkbox" name="status[code]" value="1">
									&nbsp;&nbsp;开启交易
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<input type="submit" value="提&nbsp;&nbsp;交" class="btn btn-danger btn-block"></div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="viewTemplate">
		<div class="pull-left">
			<button onclick="window.history.back();return false;" class="btn btn-primary" id="back">返回</button>
		</div>
		<div class="pull-right">
			<% if(model._id){ %>
			<a href="#strategy/edit/<%= model._id %>" class="btn btn-primary" id="edit">编辑</a>
			<% } %>
		</div>
		</p>&nbsp;<p>
		<hr/>
		<div class="">
			<div class="">
				<div class="">
					<div class="panel panel-default" id="strategyForm">
						
						<div class="panel-heading">
							<h3 class="panel-title text-center">交易品种详情</h3>
						</div>
						<div class="panel-body">
							<form role="form">
								<div class="form-group">
									<label>品种编号：</label>
									<input type="text" name="symbol" value="<%= model.symbol %>" class="form-control input-sm" placeholder="" readonly>
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<label>股票名称：</label>
									<input type="text" name="stock[name]" value="<%= model.stock.name %>" class="form-control input-sm" placeholder="" readonly>
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<label>股票代码：</label>
									<input type="text" name="stock[code]" value="<%= model.stock.code %>" class="form-control input-sm" placeholder="" readonly>
									<span class="help-block"></span>
								</div>
								<fiedset>
									<legend>参数设置</legend>
									<div class="form-group">
										<label>交易策略名称：</label>
										<input type="text" name="params[name]" value="<%= model.params.name %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>交易策略描述：</label>
										<input type="text" name="params[description]" value="<%= model.params.description %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>风险上限：</label>
										<input type="text" name="params[risk_h]" value="<%= model.params.risk_h %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>风险下限：</label>
										<input type="text" name="params[risk_l]" value="<%= model.params.risk_l %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>起始交易价格：</label>
										<input type="text" name="params[init_p]" value="<%= model.params.init_p %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>首次交易量：</label>
										<input type="text" name="params[init_v]" value="<%= model.params.init_v %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>下跌买入(%)：</label>
										<input type="text" name="params[buy_lt]" value="<%= model.params.buy_lt %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>上涨卖出(%)：</label>
										<input type="text" name="params[sell_gt]" value="<%= model.params.sell_gt %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>单次交易量：</label>
										<input type="text" name="params[quantity]" value="<%= model.params.quantity %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>最大交易次数：</label>
										<input type="text" name="params[times_max]" value="<%= model.params.times_max %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>最大交易深度：</label>
										<input type="text" name="params[depth]" value="<%= model.params.depth %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>交易方法：</label>
										<input type="text" name="params[method]" value="<%= model.params.method %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
								</fiedset>
								<div class="form-group">
									<label>已交易次数：</label>
									<input type="text" name="times" value="<%= model.times %>" class="form-control input-sm" placeholder="" readonly>
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<label>交易状态：</label>
									<input type="text" name="status[message]" value="<%= model.status.message %>" class="form-control input-sm" placeholder="" readonly>
									<span class="help-block"></span>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="editTemplate">
		<div class="pull-left">
			<button onclick="window.history.back();return false;" class="btn btn-primary" id="back">返回</button>
		</div>
		<div class="pull-right">
			<% if(model._id){ %>
			<a href="#strategy/edit/<%= model._id %>" class="btn btn-primary" id="edit">编辑</a>
			<% } %>
		</div>
		<p>&nbsp;</p>
		<hr/>
		<div class="">
			<div class="">
				<div class="">
					<div class="panel panel-default" id="strategyForm">
						<div class="panel-heading">
							<h3 class="panel-title text-center">修改交易品种</h3>
						</div>
						<div class="panel-body">
							<form role="form">
								<div class="form-group">
									<label>品种编号：</label>
									<input type="text" name="symbol" value="<%= model.symbol %>" class="form-control input-sm" placeholder="">
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<label>股票名称：</label>
									<input type="text" name="stock[name]" value="<%= model.stock.name %>" class="form-control input-sm" placeholder="">
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<label>股票代码：</label>
									<input type="text" name="stock[code]" value="<%= model.stock.code %>" class="form-control input-sm" placeholder="">
									<span class="help-block"></span>
								</div>
								<fiedset>
									<legend>参数设置</legend>
									<div class="form-group">
										<label>交易策略名称：</label>
										<input type="text" name="params[name]" value="<%= model.params.name %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>交易策略描述：</label>
										<input type="text" name="params[description]" value="<%= model.params.description %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>风险上限：</label>
										<input type="text" name="params[risk_h]" value="<%= model.params.risk_h %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>风险下限：</label>
										<input type="text" name="params[risk_l]" value="<%= model.params.risk_l %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>起始交易价格：</label>
										<input type="text" name="params[init_p]" value="<%= model.params.init_p %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>首次交易量：</label>
										<input type="text" name="params[init_v]" value="<%= model.params.init_v %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>下跌买入(%)：</label>
										<input type="text" name="params[buy_lt]" value="<%= model.params.buy_lt %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>上涨卖出(%)：</label>
										<input type="text" name="params[sell_gt]" value="<%= model.params.sell_gt %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>单次交易量：</label>
										<input type="text" name="params[quantity]" value="<%= model.params.quantity %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>最大交易次数：</label>
										<input type="text" name="params[times_max]" value="<%= model.params.times_max %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>最大交易深度：</label>
										<input type="text" name="params[depth]" value="<%= model.params.depth %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group">
										<label>交易方法：</label>
										<input type="text" name="params[method]" value="<%= model.params.method %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
								</fiedset>
								<div class="form-group">
									<input type="hidden" name="status[code]" value="0">
									<% if( model.status.code == 1){ %>
									<input type="checkbox" name="status[code]" value="1" checked>
									&nbsp;&nbsp;开启交易
									<% }else{ %>
									<input type="checkbox" name="status[code]" value="1">
									&nbsp;&nbsp;开启交易
									<% } %>
									<span class="help-block"></span>
								</div>
								<div class="form-group">
									<input type="submit" value="重新开始" class="btn btn-danger btn-block"></div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="listTradingTemplate">
	</div>
	<hr/>
	<div id="itemTradingTemplate">
		<div class="pull-right">
			<p>
				<a href="#/trading/update" id="">成交</a>
				&nbsp;
			</p>
		</div>
		<div>
			<% var date = new Date(model.lastupdatetime); %>
			<h4>
				<%= model.symbol %>
				&nbsp;&nbsp;
				<% if(model.direction == '买入'){ %>
				<span style="background-color: green;color:white;">
					<%= model.direction %></span>
				<% }else{ %>
				<span style="background-color: red;color:white;">
					<%= model.direction %></span>
				<% } %>
				：￥ <u><%= model.price %></u>
				&nbsp;&nbsp;
				<%= model.status.message %></h4>
			<p>
				交易日期：
				<%= model.date %>
				，交易时间：
				<%= model.time %></p>
			<p>
				生成时间：
				<%= date.getFullYear() +'-' + (1+date.getMonth()) + '-' + (date.getDate()) + ' '+ date.getHours() + ':'+ date.getMinutes() + ':'+ date.getSeconds() %></p>
		</div>
		<hr/>
	</div>
	<hr>
	<div id="graphTemplate">
		<div>
			<a class="btn btn-primary" onclick="window.history.back();return false;">返回</a>
		</div>
		<hr/>
		<p><strong><%= symbol %></strong>&nbsp;自&nbsp;<strong><%= from %></strong>&nbsp;起的交易记录。</p>
		<div id="graph"></div>
	</div>
</div>