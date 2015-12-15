<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
<!--
 			<div class="pull-right">
				<button class="btn btn-primary search">过滤</button>
			</div>
 -->
 			<div class="panel-heading">
				<h5 class="panel-title text-center">流量产品</h5>
			</div>
			<div class="panel-body">
				<div id="search"></div>
				<div class="btn-group btn-group-justified">
					<div class="btn btn-success" id="g2">2G用户</div>
					<div class="btn btn-default" id="g3">3G用户</div>
				</div>
				<hr/>
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div class="pull-right" id="<%= model._id %>">
			<button class="btn btn-danger view">订购</button>
		</div>
		<h4><%= model.subject %></h4>
		<p><%= model.price %>&nbsp;<%= model.unit %></p>
		<hr/>
	</div>
	<div id="searchTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">筛选条件</h4>
			</div>
			<div class="panel-body">
				<form id="searchForm">
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="确定" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<input type="reset" value="重置" class="btn btn-primary">
						</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div id="viewTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">订购业务</h5>
			</div>
			<div class="panel-body">
				<div class="pull-right"><%= model.price %>&nbsp;<%= model.unit %></div>
				<h5><%= model.subject %></h5>
				<p><%= model.description %></p>
			</div>
		</div>
		<div id="recommendAddTemplate"></div>
	</div>
</div>