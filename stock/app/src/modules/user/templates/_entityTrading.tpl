<div>
	<div id="indexTemplate">
		<div id="search"></div>
		<hr>
		<div id="panel">
			<div class="panel panel-default">
				<div class="pull-right">
					<a href="#trading/export" class="btn btn-info">导出</a>
				</div>
				<div class="panel-heading">
					<h3 class="panel-title text-center">&nbsp;</h3>
				</div>
				<div class="panel-body">
					<div id="list"></div>
				</div>
			</div>
		</div>
	</div>
	<div id="searchTemplate">
		<div class="">
			<form class="form-inline">
				<div class="form-group">
					<label>从：</label>
					<input type="date" name="from" class="form-control" placeholder="">
				</div>
				<div class="form-group">
					<label>&nbsp;&nbsp;到：</label>
					<input type="date" name="to" class="form-control" placeholder="">
				</div>
				<div class="form-group">
					<label>&nbsp;&nbsp;</label>
					<input type="text" name="searchStr" class="form-control" placeholder="股票代码">
				</div>
				<div class="form-group">
					<label>&nbsp;&nbsp;</label>
					<input type="submit" value="过滤" class="btn btn-primary">
				</div>
			</form>
		</div>
	</div>
	<hr/>
	<div id="search2Template">
		<div class="">
			<form class="form-inline">
				<div class="form-group">
					<label>从：</label>
					<input type="date" name="from" class="form-control" placeholder="">
				</div>
				<div class="form-group">
					<label>&nbsp;&nbsp;到：</label>
					<input type="date" name="to" class="form-control" placeholder="">
				</div>
				<div class="form-group">
					<label>&nbsp;&nbsp;</label>
					<input type="submit" value="过滤" class="btn btn-primary">
				</div>
			</form>
		</div>
	</div>
	<hr/>
	<div id="listTemplate">
	</div>
	<hr/>
	<div id="itemTemplate">
		<div class="pull-right">
			<p>
				<a href="#/trading/update" id="">成交</a>
				&nbsp;
			</p>
		</div>
		<div>
			<% var date = new Date(model.lastupdatetime); %>
			<h4>
				<a href="#trading/graph/<%= model.symbol %>
					">
					<%= model.symbol %></a>
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
	</div>
</div>