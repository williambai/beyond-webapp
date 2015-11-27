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
		<p></p>
		<p></p>
		<div class="">
			<div class="">
				<div class="">
					<div class="panel panel-default" id="strategyForm">
						<div class="pull-left">
							<button onclick="window.history.back();return false;" class="btn btn-primary" id="back">返回</button>
						</div>
						<div class="panel-heading">
							<h3 class="panel-title text-center">新增交易品种</h3>
						</div>
						<div class="panel-body">
							<div id="error"></div>
							<form role="form">
								<div class="form-group" id="symbol">
									<label>品种编号：</label>
									<input type="text" name="symbol" value="<%= model.symbol %>" class="form-control input-sm" placeholder="sh600030">
									<span class="help-block"></span>
								</div>
								<div class="form-group" id="stock_name">
									<label>股票名称：</label>
									<input type="text" name="stock_name" value="<%= model.stock.name %>" class="form-control input-sm" placeholder="中信证券">
									<span class="help-block"></span>
								</div>
								<div class="form-group" id="stock_code">
									<label>股票代码：</label>
									<input type="text" name="stock_code" value="<%= model.stock.code %>" class="form-control input-sm" placeholder="600030">
									<span class="help-block"></span>
								</div>
								<fiedset>
									<legend>参数设置</legend>
									<div class="form-group" id="name">
										<label>交易策略名称：</label>
										<input type="text" name="name" value="<%= model.params.name %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="description">
										<label>交易策略描述：</label>
										<input type="text" name="description" value="<%= model.params.description %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="risk_h">
										<label>风险上限：</label>
										<input type="text" name="risk_h" value="<%= model.params.risk_h %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="risk_l">
										<label>风险下限：</label>
										<input type="text" name="risk_l" value="<%= model.params.risk_l %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="init_p">
										<label>起始交易价格：</label>
										<input type="text" name="init_p" value="<%= model.params.init_p %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="init_v">
										<label>首次交易量：</label>
										<input type="text" name="init_v" value="<%= model.params.init_v %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="buy_lt">
										<label>下跌买入(%)：</label>
										<input type="text" name="buy_lt" value="<%= model.params.buy_lt %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="sell_gt">
										<label>上涨卖出(%)：</label>
										<input type="text" name="sell_gt" value="<%= model.params.sell_gt %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="quantity">
										<label>单次交易量：</label>
										<input type="text" name="quantity" value="<%= model.params.quantity %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="times_max">
										<label>最大交易次数：</label>
										<input type="text" name="times_max" value="<%= model.params.times_max %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="depth">
										<label>最大交易深度：</label>
										<input type="text" name="depth" value="<%= model.params.depth %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="method">
										<label>交易方法：</label>
										<input type="text" name="method" value="<%= model.params.method %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
								</fiedset>
								<div class="form-group" id="status">
									<label>交易状态：</label>
									<% if( model.status.code == 1){ %>
									<input type="radio" name="status" value="0">
									&nbsp;&nbsp;停止
									<input type="radio" name="status" value="1" checked>
									&nbsp;&nbsp;开启
									<% }else{ %>
									<input type="radio" name="status" value="0" checked>
									&nbsp;&nbsp;停止
									<input type="radio" name="status" value="1">
									&nbsp;&nbsp;开启
									<% } %>
									<span class="help-block"></span>
								</div>
								<div class="form-group" id="submit">
									<input type="submit" value="提&nbsp;&nbsp;交" class="btn btn-danger btn-block"></div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="viewTemplate">
		<p></p>
		<p></p>
		<div class="">
			<div class="">
				<div class="">
					<div class="panel panel-default" id="strategyForm">
						<div class="pull-left">
							<button onclick="window.history.back();return false;" class="btn btn-primary" id="back">返回</button>
						</div>
						<div class="pull-right">
							<% if(model._id){ %>
							<a href="#strategy/edit/<%= model._id %>" class="btn btn-primary" id="edit">编辑</a>
							<% } %>
						</div>
						<div class="panel-heading">
							<h3 class="panel-title text-center">交易品种</h3>
						</div>
						<div class="panel-body">
							<div id="error"></div>
							<form role="form">
								<div class="form-group" id="symbol">
									<label>品种编号：</label>
									<input type="text" name="symbol" value="<%= model.symbol %>" class="form-control input-sm" placeholder="" readonly>
									<span class="help-block"></span>
								</div>
								<div class="form-group" id="stock_name">
									<label>股票名称：</label>
									<input type="text" name="stock_name" value="<%= model.stock.name %>" class="form-control input-sm" placeholder="" readonly>
									<span class="help-block"></span>
								</div>
								<div class="form-group" id="stock_code">
									<label>股票代码：</label>
									<input type="text" name="stock_code" value="<%= model.stock.code %>" class="form-control input-sm" placeholder="" readonly>
									<span class="help-block"></span>
								</div>
								<fiedset>
									<legend>参数设置</legend>
									<div class="form-group" id="name">
										<label>交易策略名称：</label>
										<input type="text" name="name" value="<%= model.params.name %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="description">
										<label>交易策略描述：</label>
										<input type="text" name="description" value="<%= model.params.description %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="risk_h">
										<label>风险上限：</label>
										<input type="text" name="risk_h" value="<%= model.params.risk_h %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="risk_l">
										<label>风险下限：</label>
										<input type="text" name="risk_l" value="<%= model.params.risk_l %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="init_p">
										<label>起始交易价格：</label>
										<input type="text" name="init_p" value="<%= model.params.init_p %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="init_v">
										<label>首次交易量：</label>
										<input type="text" name="init_v" value="<%= model.params.init_v %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="buy_lt">
										<label>下跌买入(%)：</label>
										<input type="text" name="buy_lt" value="<%= model.params.buy_lt %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="sell_gt">
										<label>上涨卖出(%)：</label>
										<input type="text" name="sell_gt" value="<%= model.params.sell_gt %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="quantity">
										<label>单次交易量：</label>
										<input type="text" name="quantity" value="<%= model.params.quantity %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="times_max">
										<label>最大交易次数：</label>
										<input type="text" name="times_max" value="<%= model.params.times_max %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="depth">
										<label>最大交易深度：</label>
										<input type="text" name="depth" value="<%= model.params.depth %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="method">
										<label>交易方法：</label>
										<input type="text" name="method" value="<%= model.params.method %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
								</fiedset>
								<div class="form-group" id="times">
									<label>已交易次数：</label>
									<input type="text" name="times" value="<%= model.times %>" class="form-control input-sm" placeholder="" readonly>
									<span class="help-block"></span>
								</div>
								<div class="form-group" id="status">
									<label>交易状态：</label>
									<% if( model.status.code == 1){ %>
									<input type="radio" name="status" value="0">
									&nbsp;&nbsp;停止
									<input type="radio" name="status" value="1" checked>
									&nbsp;&nbsp;开启
									<% }else{ %>
									<input type="radio" name="status" value="0" checked>
									&nbsp;&nbsp;停止
									<input type="radio" name="status" value="1">
									&nbsp;&nbsp;开启
									<% } %>
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
		<p></p>
		<p></p>
		<div class="">
			<div class="">
				<div class="">
					<div class="panel panel-default" id="strategyForm">
						<div class="pull-left">
							<button onclick="window.history.back();return false;" class="btn btn-primary" id="back">返回</button>
						</div>
						<div class="pull-right">
							<% if(model._id){ %>
							<a href="#strategy/edit/<%= model._id %>" class="btn btn-primary" id="edit">编辑</a>
							<% } %>
						</div>
						<div class="panel-heading">
							<h3 class="panel-title text-center">交易品种</h3>
						</div>
						<div class="panel-body">
							<div id="error"></div>
							<form role="form">
								<div class="form-group" id="symbol">
									<label>品种编号：</label>
									<input type="text" name="symbol" value="<%= model.symbol %>" class="form-control input-sm" placeholder="">
									<span class="help-block"></span>
								</div>
								<div class="form-group" id="stock_name">
									<label>股票名称：</label>
									<input type="text" name="stock_name" value="<%= model.stock.name %>" class="form-control input-sm" placeholder="">
									<span class="help-block"></span>
								</div>
								<div class="form-group" id="stock_code">
									<label>股票代码：</label>
									<input type="text" name="stock_code" value="<%= model.stock.code %>" class="form-control input-sm" placeholder="">
									<span class="help-block"></span>
								</div>
								<fiedset>
									<legend>参数设置</legend>
									<div class="form-group" id="name">
										<label>交易策略名称：</label>
										<input type="text" name="name" value="<%= model.params.name %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="description">
										<label>交易策略描述：</label>
										<input type="text" name="description" value="<%= model.params.description %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="risk_h">
										<label>风险上限：</label>
										<input type="text" name="risk_h" value="<%= model.params.risk_h %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="risk_l">
										<label>风险下限：</label>
										<input type="text" name="risk_l" value="<%= model.params.risk_l %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="init_p">
										<label>起始交易价格：</label>
										<input type="text" name="init_p" value="<%= model.params.init_p %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="init_v">
										<label>首次交易量：</label>
										<input type="text" name="init_v" value="<%= model.params.init_v %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="buy_lt">
										<label>下跌买入(%)：</label>
										<input type="text" name="buy_lt" value="<%= model.params.buy_lt %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="sell_gt">
										<label>上涨卖出(%)：</label>
										<input type="text" name="sell_gt" value="<%= model.params.sell_gt %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="quantity">
										<label>单次交易量：</label>
										<input type="text" name="quantity" value="<%= model.params.quantity %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="times_max">
										<label>最大交易次数：</label>
										<input type="text" name="times_max" value="<%= model.params.times_max %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="depth">
										<label>最大交易深度：</label>
										<input type="text" name="depth" value="<%= model.params.depth %>" class="form-control input-sm" placeholder="">
										<span class="help-block"></span>
									</div>
									<div class="form-group" id="method">
										<label>交易方法：</label>
										<input type="text" name="method" value="<%= model.params.method %>" class="form-control input-sm" placeholder="" readonly>
										<span class="help-block"></span>
									</div>
								</fiedset>
								<!-- <div class="form-group" id="times">
									<label>已交易次数：</label>
									<input type="text" name="times" value="<%= model.times %>" class="form-control input-sm" placeholder="" readonly>
									<span class="help-block"></span>
								</div> -->
								<div class="form-group" id="status">
									<label>交易状态：</label>
									<% if( model.status.code == 1){ %>
									<input type="radio" name="status" value="0">
									&nbsp;&nbsp;停止
									<input type="radio" name="status" value="1" checked>
									&nbsp;&nbsp;开启
									<% }else{ %>
									<input type="radio" name="status" value="0" checked>
									&nbsp;&nbsp;停止
									<input type="radio" name="status" value="1">
									&nbsp;&nbsp;开启
									<% } %>
									<span class="help-block"></span>
								</div>
								<div class="form-group" id="submit">
									<input type="submit" value="提&nbsp;&nbsp;交" class="btn btn-danger btn-block"></div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="graphTemplate">
		<h4>本轮交易图表</h4>
		<p>自xxx起。</p>
		<hr>
		<div id="graph"></div>
	</div>
</div>