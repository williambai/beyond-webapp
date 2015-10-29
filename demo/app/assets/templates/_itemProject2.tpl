<a class="list-group-item"  href="#project/<%= _id %>/index">
<!--  	<span class="pull-right">
 		<i class="fa fa-chevron-right"></i>
 	</span>
 -->
 	<div class="media">
		<div class="media-body">
			<div class="media-heading">
				<h4><%= name %>&nbsp;&nbsp;<span class="small"><%= ('presenter' == 'presenter') ? '主持' : '参与' %></span></h4>
			</div>
			<p><%= description %></p>
			<p>人数：<%= members %>&nbsp;&nbsp;
			
			</p>
		</div>
	</div>
</a>