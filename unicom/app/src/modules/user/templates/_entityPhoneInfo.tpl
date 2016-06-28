<div>
	<div id="indexTemplate">
		<div>
			<div id="carouselView"></div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h5 class="panel-title text-center">号码检测</h5>
				</div>
				<div class="panel-body">
					<div id="search">
					</div>
					<div id="view">
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="searchTemplate">
		<form id="orderForm">
			<div class="form-group">
				<label></label>
				<input type="text" name="mobile" class="form-control" placeholder="客户手机号码">
				<span class="help-block"></span>
			</div>
				<div class="form-group">
				<div class="btn-group btn-group-justified">
					<div class="btn-group">
					<input type="submit" value="确定" class="btn btn-danger">
				</div>
				<div class="btn-group">
					<button class="btn btn-success back">返回</button>
				</div>
				</div>
			</div>
		</form>
	</div>
	<div id="viewTemplate">
		<hr>
		<h4>检验结果</h4>
		<p style="color:red;"><%= model.errmsg %></p>
		<% if(model.info && (model.info.OpenDate != '')){ %>
		<p>仅能订购2/3G业务</p>
		<% }else if(model.info && (model.info.OpenDate =='')){ %>
		<p>仅能订购4G业务</p>
		<% }else{ %>
		<p>无结果</p>
		<% } %>
	</div>
</div>