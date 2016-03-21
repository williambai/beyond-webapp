/********************************************************************************************
* BlueShoes Framework;
 This file is part of the php application framework.
* NOTE: This code is stripped (obfuscated). To get the clean documented code goto 
*       www.blueshoes.org and register for the free open source *DEVELOPER* version or 
*       buy the commercial version.
*       
*       In case you've already got the developer version, then this is one of the few 
*       packages/classes that is only available to *PAYING* customers.
*       To get it go to www.blueshoes.org and buy a commercial version.
* 
* @copyright www.blueshoes.org
* @author    Samuel Blume <sam at blueshoes dot org>
* @author    Andrej Arn <andrej at blueshoes dot org>
*/
if (!Objects) { var Objects = []; }
function TabSet(outerElmId, style) {
	var a = arguments;
	this.style = (style == null) ? '' : '_' + style;
	this._outerElmId = outerElmId;
	this._id;
	this._objectId;
	this.tabs = new Array;
	this._activeTabIdx = 0;
	this._onTabSelectEvent
	this._constructor = function() {
		this._id = Objects.length;
		Objects[this._id] = this;
		this._objectId = "TabSet_" + this._id;
	}
	this.addTab = function(caption,container) {
		if (typeof(caption) == 'object') {
			var o = caption;
		} else {
			var o = new Object;
			o.caption   = caption;
			o.container = container;
		}
		o.tabIdx = this.tabs.length;
		this.tabs[o.tabIdx] = o;
	}
	this.render = function() {
		var ret = new Array;
		ret[ret.length] = '<div class="tabsetTabsDiv' + this.style + '">';
		//next line add "float:left;"  modify tangzhi@2007-11-4 15:37
		ret[ret.length] = '<div style="width:2px;min-width:2px;display:inline;"></div>';
		//ret[ret.length] = '<div style="width:4px;min-width:2px;display:inline;float:left;"></div>';
		//ret[ret.length] = '<div id="' + this._outerElmId + 'gomove" style="float:right;display:inline;z-index:9998;"><a href="javascript:void(0)" class="tabgo"><img src="component/images/tabgoto.gif" alt="更多..." width="12" height="20" border="0"/></a></div>';
		for (var i=0; i<this.tabs.length; i++) {
			if (i == this._activeTabIdx) {
				var cls = 'TabsetActive' + this.style;
			} else {
				var cls = 'TabsetInactive' + this.style;
				if (this.tabs[i].container) this.tabs[i].container.style.display = 'none';
			}
			ret[ret.length] = '<div unselectable="On" id="' + this._objectId + '_tabCap_' + i + '" class="Tabset' + this.style + ' ' + cls + '" style="display:inline;" onclick="Objects['+this._id+'].switchTo(' + i + ');"><span class="left"></span><span class="text">' + this.tabs[i].caption + '</span><span class="right"></span></div>';
		}
		ret[ret.length] = '</div>';
		return ret.join('');
	}
	this.draw = function() {
		var elem = document.getElementById(this._outerElmId + '_tabs');
		elem.className = "TabsetTabs" + this.style;
		if (elem) elem.innerHTML = this.render();
	}
	this.switchTo = function(theReg) {
		newRegIdx = -1;
		if (theReg=='') theReg = '0';
		if (isNaN(parseInt(theReg))) {
			for (var i=0; i<this.tabs.length; i++) {
				if (this.tabs[i].caption == theReg) (newRegIdx = i);
			}
		} else {
			newRegIdx = theReg;
		}
		if (newRegIdx<0) return;
		for (var i=0; i<this.tabs.length; i++) {
			var elem = document.getElementById(this._objectId + '_tabCap_' + i);
			if (!elem) continue;
			if (newRegIdx == i) {
				this._activeTabIdx = i;
				elem.className = 'Tabset' + this.style + ' TabsetActive' + this.style;
				this.tabs[i].container.style.display = 'block';
				if (typeof(this.tabs[i].onFocus) != 'undefined') {
					this._triggerFunction(this.tabs[i].onFocus);
				}
				this.fireOnTabSelect();
			} else {
				elem.className = 'Tabset' + this.style + ' TabsetInactive' + this.style;
				this.tabs[i].container.style.display = 'none';
				if (typeof(this.tabs[i].onBlur) != 'undefined') {
					this._triggerFunction(this.tabs[i].onBlur);
				}
			}
		}
	}
	this.getActiveTab = function() {
		return this.tabs[this._activeTabIdx];
	}
	this.onTabSelect = function(yourEvent) {
		this._onTabSelectEvent = yourEvent;
	}
	this.fireOnTabSelect = function() {
		if (this._onTabSelectEvent) {
			func = this._onTabSelectEvent;
			if (this._onTabSelectEvent == 'string') {
				eval(func);
			} else {
				func(this);
			}
		}
		return true;
	}
	this._triggerFunction = function(func) {
		if (typeof(func) == 'function') {
			func();
		} else if (typeof(func) == 'string') {
			eval(func);
		}
	}
	this._constructor();
}