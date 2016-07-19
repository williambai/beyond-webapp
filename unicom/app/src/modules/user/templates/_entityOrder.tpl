<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">我的工作成绩</h5>
			</div>
			<div class="panel-body">
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div>
			<div class="item" id="<%= model._id %>">
				<div class="media">
					<div class="media-left">
						<img src="" width="50px" height="50px">
					</div>
					<div class="media-body">
						<h4><span style="color:red;"><!-- <i class="fa fa-flag"></i>&nbsp; --><%= model.status %></span>&nbsp;<%= model.goods && model.goods.name %></h4>
				 		<p><i class="fa fa-user"></i>&nbsp;<%= model.customer && model.customer.mobile %></p>
				 		<div class="payment"></div>
						<p><i class="fa fa-clock-o"></i>&nbsp;<%= model.deltatime %></p>
					</div>
					<div class="media-right">
				 		<div class="pull-right">
				 			<h4><!-- <i class="fa fa-cart-arrow-down"></i> -->￥<%= model.total && model.total.toFixed(2) %></h4>
				 			<h4><i class="fa fa-gift"></i>&nbsp;<%= model.bonus %></h4>
				 			<!-- <h4><i class="fa fa-thumbs-o-up"></i>&nbsp;+&nbsp;<%= model.bonus.points %></h4> -->
				 		</div>
					</div>
				</div>

			</div>
			<hr/>
		</div>
	</div>
</div>