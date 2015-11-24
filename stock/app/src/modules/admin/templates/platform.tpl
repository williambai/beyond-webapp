<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">实时报价[<% if(model.platform){ %><span style="color:green;">&nbsp;已启动&nbsp;</span><% }else{ %><span style="color:red;">&nbsp;已停止&nbsp;</span><% } %>]</h3>
  </div>
  <div class="panel-body">
    当开启时，平台与远程实时报价系统连接，此时在平台上的交易品种可以收到实时报价，评估收益。
  </div>
  <div class="panel-footer">
  	<% if(!model.platform){ %>
  	<button class="btn btn-block btn-success" id="quote_start">开启</button>
  	<% }else{ %>
  	<button class="btn btn-block btn-danger" id="quote_stop">停止</button>
  	<% } %>
  </div>
</div>
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">实时交易[<% if(model.trade){ %><span style="color:green;">&nbsp;已启动&nbsp;</span><% }else{ %><span style="color:red;">&nbsp;已停止&nbsp;</span><% } %>]</h3>
  </div>
  <div class="panel-body">
    当开启时，平台与远程下单交易系统连接，此时在平台上的交易品种可以实时交易。
  </div>
  <div class="panel-footer">
  	<% if(!model.trade){ %>
  	<button class="btn btn-block btn-success" id="trade_start">开启</button>
  	<% }else{ %>
  	<button class="btn btn-block btn-danger" id="trade_stop">停止</button>
  	<% } %>
  </div>
</div>