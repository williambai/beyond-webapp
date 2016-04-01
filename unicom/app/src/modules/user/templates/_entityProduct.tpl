<div>
	<div id="indexTemplate">
		<div>
			<div class="nav-back">
				<button class="btn btn-primary pull-left back"><i class="fa fa-reply">&nbsp;</i>返回</button>
				<h4 class="text-center"><%= model.name %></h4>
			</div>
			<p>&nbsp;</p>
			<div id="list">
			</div>
		</div>
	</div>
	<div id="hotTemplate">
		<div class="panel panel-default">
 			<div class="panel-heading">
				<h5 class="panel-title text-center">热门产品</h5>
			</div>
			<div class="panel-body">
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div>
			<div class="item" id="<%= model._id %>" data="<%= model.name %>">
				<div class="media">
					<div class="media-left">
						<img width="50px" height="50px">
					</div>
					<div class="media-body">
						<h4><%= model.name %></h4>
						<p><%= model.tags %></p>
						<!-- <p>售价：<%= model.price %>&nbsp;<%= model.unit %>&nbsp;&nbsp;返佣：<%= model.bonus.income %>&nbsp;元&nbsp;&nbsp;积分：<%= model.bonus.points %></p> -->
					</div>
				</div>
				<p style="text-align:right"><% if(/MicroMessenger/.test(navigator.userAgent)){ %>
				<button class="btn btn-danger promote wechat">微信推广</button>
				<% } %>
				<button class="btn btn-danger sms">短信推广</button>
				<button class="btn btn-success view">订购推荐</button>
				</p>
				<hr/>
			</div>
		</div>
	</div>
	<div id="viewTemplate">
		<div>
			<div class="nav-back">
				<button class="btn btn-primary back"><i class="fa fa-reply">&nbsp;</i>返回</button>
			</div>
			<br/>
			<div class="row">
				<div class="col-xs-10">
					<div class="pull-left">
						<img width="50px" height="50px">
					</div>
					<div style="padding-left:60px;">
						<h4 >
							<%= model.name %>
						</h4>
						<p>佣金：<%= model.goods && model.goods.bonus %>&nbsp;元</p>
						<p></p>
					</div>
				</div>
				<div class="col-xs-2">
					<h4><%= model.price %>&nbsp;<%= model.unit %></h4>
				</div>
			</div>
			<div id="orderView"></div>
			<h4>产品说明：</h4>
			<hr/>
			<p><%= model.description %></p>
		</div>
	</div>
	<div id="orderTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
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
							<input type="submit" value="确定" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<button class="btn btn-success cancel">取消</button>
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