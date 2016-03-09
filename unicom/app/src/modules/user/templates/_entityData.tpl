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
					<div class="btn btn-default" id="g4">4G用户</div>
				</div>
				<hr/>
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div class="item" id="<%= model._id %>">
			<div class="pull-right">
				<div style="text-align:right;">
					<p><% if(/MicroMessenger/.test(navigator.userAgent)){ %>
					<button class="btn btn-danger promote wechat">微信</button>&nbsp;&nbsp;
					<% } %>
					<% if(/iPhone/.test(navigator.userAgent)){ %>
						<a href="sms:&body=短信内容" class="btn btn-danger sms">短信</a>
					<% }else{ %>
						<a href="sms:?body=短信内容" class="btn btn-danger sms">短信</a>
					<% } %>
					</p>
					<p><button class="btn btn-success view">订购</button></p>
				</div>
			</div>
			<h4><%= model.name %></h4>
			<p><%= model.description %></p>
			<p>售价：<%= model.price %>&nbsp;<%= model.unit %>&nbsp;&nbsp;返佣：<%= model.bonus.income %>&nbsp;元&nbsp;&nbsp;积分：<%= model.bonus.points %></p>
			<hr/>
		</div>
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
				<div class="pull-right"><h4><%= model.price %>&nbsp;<%= model.unit %></h4></div>
				<h4><%= model.name %></h4>
				<p><%= model.description %></p>
				<p>佣金：<%= model.bonus.income %>&nbsp;元（用户订购成功后，分&nbsp;<%= model.bonus.times %>&nbsp;批返佣）</p>
				<p>积分：<%= model.bonus.points %></p>
			</div>
		</div>
		<div id="orderView"></div>
	</div>
	<div id="orderTemplate">
		<div class="panel panel-primary">
			<div class="panel-heading">
				<button class="btn btn-success pull-right addItem"><i class="fa fa-plus-circle"></i>添加</button>
				<h5 class="panel-title text-center">推荐给客户</h5>
			</div>
			<div class="panel-body">
				<form id="orderForm">
					<div class="form-group">
						<label></label>
						<input type="text" name="mobile[]" class="form-control" placeholder="手机号码">
						<span class="help-block"></span>
					</div>
<!-- 					<div class="form-group">
						<label></label>
						<input type="text" name="mobile[]" class="form-control" placeholder="手机号码">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label></label>
						<input type="text" name="mobile[]" class="form-control" placeholder="手机号码">
						<span class="help-block"></span>
					</div> -->
					<div id="insertItemBefore"></div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="确定订购" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<button class="btn btn-primary cancel">取消</button>
						</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div id="successTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">推荐成功</h5>
			</div>
			<div class="panel-body">
				<p>恭喜你，推荐成功！</p>
				<button class="btn btn-primary btn-block back">返回</button>
			</div>
		</div>
	</div>
	<div id="failTemplate">
		<p>推荐失败页面，查看</p>
		<div>
		</div>
	</div>
</div>