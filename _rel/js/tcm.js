(function(){
IX.ns("TCM.Const");
TCM.Const.SiteTypes = {TCC : 0, OCC: 1, Depot: 2, Station: 3, BOCC: 4, LinePolice: 5, PTSD:6};
TCM.Const.SiteTypeNames = ["指挥中心", "控制中心", "车辆段／停车场", "车站", "备用控制中心", "公安派出所", "公交总队"];
TCM.Const.UserTypes = {Super: 0, Admin:1, User :2};
TCM.Const.UserTypeNames = ["超级用户", "管理员", "普通用户"];
TCM.Const.DeviceTypes = {
	TNM: 0, TVS: 1, TAS: 2, TVR: 3,
	Storage: 10, 
	IPCFixed: 20, IPCSemiSphere: 21, IPCSphere: 22, 
	CameraFixed: 31, CameraSemiSphere: 32, CameraSphere: 33, 
	RedirectPickup: 40, OmnidirectPickup: 41,
	Coder: 50, Decoder: 51, Spliter: 52, Monitor: 53, Terminal: 54, 
	HUB: 60, PDH: 61, FiberConvertor: 62, KVM: 63, PDU: 64, VDM: 65,
	Other: 90
};
TCM.Const.DeviceTypeNames = {
	0: "网管服务器", 1: "视频服务器", 2: "视频分析服务器", 3: "存储服务器",
	10: "存储设备",
	20: "固定枪机",  21: "半球机",  22: "球机",
	31: "固定枪机",  32: "半球机",  33: "球机",
	40: "定向拾音器",41: "全向拾音器",
	50: "编码器",  51: "解码器",  52: "画面分割器",53: "监视器",  54: "控制终端",
	60: "交换机",  61: "光端机",  62: "光纤收发器",63: "数字KVM",64: "数字PDU", 65: "字符叠加器",
	90: "其他设备"
};
TCM.Const.DriverId = {
	DH_host_IPC : "1",//大华通用
	DH_host_coder : "9",//大华通用
	YS_host_IPC : "2",//宇视通用
	YS_host_coder : "10",//宇视通用
	JS_decoder : "16",//巨视通用
	AXS_rtsp_IPC : "5",//安讯视rstp
	AXS_rtsp_coder : "13",//安讯视rstp
	DH_rtsp_IPC : "6",//大华rstp
	DH_rtsp_coder : "14",//大华rstp
	YS_rtsp_IPC : "7",//宇视rstp
	YS_rtsp_coder : "15",//宇视rstp
	NKF_rtsp_IPC : "8",//NKF rstp
	NKF_rtsp_coder : "19",//NKF rstp
	AVS_IPC : "3",//安维斯通用
	AVS_coder : "11"//安维斯通用
};

TCM.Const.Days = "周日,周一,周二,周三,周四,周五,周六".split(",");

})();
(function(){

function GroupedHT(items, grpKeys){
	var arr = [].concat(items);
	var idGrp = {}, nameGrp = {}, grps = {};

	function equalFn(a, b){return a=== null || b === null || a.id == b.id;}
	function assignToGroup(item, key){
		if (!(key in grps))
			grps[key] = {};
		var grp = grps[key];
		var _key = item[key];
		if (!(_key in grp))
			grp[_key] = [];
		grp[_key].push(item.id);
	}
	function assignToGroups(item, idx){
		idGrp[item.id] = idx;
		nameGrp[item.name] = idx;
		IX.iterate(grpKeys, function(key){
			assignToGroup(item, key);
		});
	}
	function _refresh(){
		arr = IX.Array.toSet(arr,equalFn);
		idGrp = {};
		nameGrp = {};
		grps = {};
		IX.iterate(arr, assignToGroups);
	}
	_refresh();

	return {
		getAll : function(){return arr;},
		get : function(id){return arr[idGrp[id]];},
		getByName : function(name){return arr[nameGrp[name]];},
		getBy: function(key, value){
			return IX.map(grps[key][value], function(idx){return arr[idx];});
		},
 
		add : function(item){
			arr.push(item);
			_refresh();
		},
		update : function(item){
			var idx = idGrp[item.id];
			if (idx!==null && idx !== undefined)
				arr[idx] = item;
			else
				arr.push(item);
			_refresh();
		},
		remove : function(item){
			arr[item.id] = null;
			_refresh();
		},
		refresh : function(_items){
			arr = [].concat(_items);
			_refresh();
		}
	};
}

/* { id : lineId, name:lineName,
	sites : [{id, name, type, no, desc}],
	roles : [{id, name, siteType, promptable}],
	levels : [{id, name, level, depot:{id, prompted}, station:{id, prompted}}]
*  }
*/
var lineName  = "";
var siteHT = new GroupedHT([], ["type"]);
var roleHT = new GroupedHT([], ["siteType"]);
var levelHT = new GroupedHT([], ["level"]);
function applyLineInfo(lineInfo){
	lineName  = $XP(lineInfo, "name", "");
	siteHT.refresh($XP(lineInfo, "sites", []));
	roleHT.refresh($XP(lineInfo, "roles", []));
	levelHT.refresh($XP(lineInfo, "levels", []));
}

var SiteTypeNames = TCM.Const.SiteTypeNames;

IX.ns("TCM.LineInfo");
TCM.LineInfo.init = function(data){
	applyLineInfo(data);
};
TCM.LineInfo.refresh = function(data){
	applyLineInfo(data);
};
TCM.LineInfo.destroy = function(){
	lineName  = "";
	siteHT.refresh([]);
	roleHT.refresh([]);
	levelHT.refresh([]);
};

TCM.LineInfo.getName = function(){return lineName;};
TCM.LineInfo.setName = function(_name){lineName = _name;};

TCM.LineInfo.getSites = function(){return siteHT;};
TCM.LineInfo.getSiteName = function(siteId){
	var site = siteHT.get(siteId);
	return site ? site.name : "";
};

TCM.LineInfo.getRoles = function(){return roleHT;};
TCM.LineInfo.getRoleName = function(roleId){
	var role = roleHT.get(roleId);
	return role ? role.name : "";
};
TCM.LineInfo.getSiteTypeNameOfRole =function(roleId) {
	var role = roleHT.get(roleId);
	return !role || role.siteType === null ? "" :SiteTypeNames[role.siteType];
};

TCM.LineInfo.getLevels = function(){return levelHT;};

IX.ns("TCM.DeviceType");
TCM.DeviceType.getNodeName = function(type){
	switch(type){
	case TCM.Const.DeviceTypes.TNM:
	case TCM.Const.DeviceTypes.TVS:
	case TCM.Const.DeviceTypes.TAS:
	case TCM.Const.DeviceTypes.TVR:
		return "server";
	case TCM.Const.DeviceTypes.Storage:
		return "storage";
	case TCM.Const.DeviceTypes.IPCFixed:
	case TCM.Const.DeviceTypes.IPCSemiSphere:
	case TCM.Const.DeviceTypes.IPCSphere:
		return "IPC";

	case TCM.Const.DeviceTypes.CameraFixed:
	case TCM.Const.DeviceTypes.CameraSemiSphere:
	case TCM.Const.DeviceTypes.CameraSphere:
		return "camera";
	case TCM.Const.DeviceTypes.RedirectPickup:
	case TCM.Const.DeviceTypes.OmnidirectPickup:
		return "pickup";
	case TCM.Const.DeviceTypes.Coder:
		return "coder";
	case TCM.Const.DeviceTypes.Decoder:
		return "decoder";
	case TCM.Const.DeviceTypes.Spliter:
		return "spliter";
	case TCM.Const.DeviceTypes.Monitor:
		return "monitor";
	case TCM.Const.DeviceTypes.Terminal:
		return "terminal";
	case TCM.Const.DeviceTypes.VDM:
		return "vdm";
	case TCM.Const.DeviceTypes.HUB:
	case TCM.Const.DeviceTypes.PDH:
	case TCM.Const.DeviceTypes.FiberConvertor:
	case TCM.Const.DeviceTypes.KVM:
	case TCM.Const.DeviceTypes.PDU:
	case TCM.Const.DeviceTypes.Other:
		return "other";
	}
};
})();
(function(){

/** def : {
	name : ""	
	title : ""
  }
 */

function ColumnModelBase(def){
	var name = $XP(def, "name"), title = $XP(def, "title", name), isLongStr = $XP(def, "isLongStr");
	return {
		getTitleTpldata : function(){ return {
			html : IX.encodeTXT(title),
			name : name,
			sortClz : "up"
		};},
		getCellTpldata : function(item){return {
			name : name,
			html : IX.encodeTXT($XP(item, name, "")),
			title : IX.encodeTXT($XP(item, name, "")),
			longClz :"longName"
		};}
	};
}

function RowModelBase(rowData, colModels, actions, moreActions){
	var id = rowData.id;
	function getCellsTpldata(){
		return IX.map(colModels, function(colModel){
			return colModel.getCellTpldata(rowData);
		});
	}
	function getActionsTpldata(){
		return IX.loop(actions,[],function(acc,item){
			acc.push({
				name : item[0],
				title : item[1],
				html : ""
			});
			return acc;
		});
	}
	function getDropdownActs(){
		return IX.map(moreActions,function(item){
			return {
				name : item[0],
				html : item[1]
			};
		});
	}
	var tpldata = {
		id : id,
		clz : "",
		moreClz : moreActions.length===0?"hidden":"",
		dropdowcActs : getDropdownActs(),
		cells : getCellsTpldata(),
		actions : getActionsTpldata()//[{name:"delete", html:""},{name:"poweron", html:""},] //TODO:
	};
	return {
		getId : function(){return id;},
		get : function(attrName){return $XP(rowData, attrName);},
		refresh : function(_rowData){
			rowData = _rowData;
			tpldata.cells = getCellsTpldata();
		},
		getTpldata : function(){return tpldata;}
	};
}

var columnModelHT = {};
IX.ns("IXW.Lib");
/** cfg : {
	pageSize : 20, 

	rowModel : function(rowData, colModels)// default is RowModelBase
	columns : [name], 
	actions  : [["name", function(rowModel, rowEl){}], ...] 
	dataLoader : function(params, cbFn)
	}
 */
IXW.Lib.GridModel = function(id, cfg){
	var clz =  $XP(cfg, "clz", "");
	var pageSize = $XP(cfg, "pageSize", 20);
	var RowModel = $XP(cfg, "rowModel", RowModelBase);
	var dataLoader = $XF(cfg, "dataLoader");
	var colModels = IX.map($XP(cfg, "columns", []), function(colName){
		return (colName in columnModelHT)?(new columnModelHT[colName]()): null;
	});
	var actions = $XP(cfg, "actions", []);
	var moreActions = $XP(cfg,"moreActions",[]);

	var tpldata = {
		clz : clz,
		id : id,
		header : IX.map(colModels, function(m){return m.getTitleTpldata();}),
		rows : []
	};

	var dataModel = new IX.IPagedManager(function(item){
		return new RowModel(item, colModels,actions,moreActions);
	}, null, dataLoader);
	function _load(pageNo, cbFn){
		dataModel.load(pageNo, pageSize, function(rowModels){
			tpldata.rows = IX.map(rowModels, function(row){
				return row.getTpldata();
			});
			cbFn(rowModels);
		});
	}
	return {
		getDataModel : function(){return dataModel;},
		getRow : dataModel.get,
		getFirst : dataModel.getFirst,
		addItems : dataModel.addItems,
		removeItems : dataModel.removeItems,

		getTpldata : function(){return tpldata;},
		getPageCount : function(){return Math.ceil(dataModel.getTotal()/pageSize);},	
		resetPage : function(_pageNo, _pageSize, cbFn){
			//var idx = Math.floor(pageSize *  _pageNo/_pageSize);
			pageSize = _pageSize;
			//_load(idx, cbFn);
			_load(_pageNo, cbFn);
		},
		load : function(pageNo, cbFn){_load(pageNo, cbFn);}
	};
};
IXW.Lib.GridModel.RowModelBase = RowModelBase;
IXW.Lib.GridModel.ColumnModelBase = ColumnModelBase;
IXW.Lib.GridModel.registerColumnModel = function(name, modelClz){
	columnModelHT[name] = modelClz;
};

})();
(function () {
var globalActionConfig = IXW.Actions.configActions;

var dialog = null;
function hideDialog(){if (dialog)dialog.hide();}
var dialogCfg = null; 

var confirmCfg = null;


var t_modal = new IX.ITemplate({tpl: [
	'<div class="head">{title}</div>',
	'<div class="content">{content}</div>',
	'<div class="foot">',
		'<div class="l btns">','<tpl id="lbtns">',
			'<a class="btn {name}btn" data-href="$nvdialog-click" data-key="{name}">{text}</a>',
		'</tpl>','</div>',
		'<div class="r btns">','<tpl id="rbtns">',
			'<a class="btn {name}btn" data-href="$nvdialog-click" data-key="{name}">{text}</a>',
		'</tpl>','</div>',
	'</div>	',
'']});
var t_confirm = new IX.ITemplate({tpl: [
	'<div class="area confirm"><div class="msg">{msg}</div></div>',
'']});

var t_alert = new IX.ITemplate({tpl: [
	'<div id="nv-alert">',
		'<div class="nv-alert animate-shake">',
			'<div class="nv-bg alert"></div>',
			'<span class="nv-close"><a data-href="$colse-alert">&times;</a></span>',
			'<span class="alert-content">{content}</span>',
		'</div>',
	'</div>',
'']});

var t_confirmBtn = new IX.ITemplate({tpl: [
	'<div class="confirm-btn">',
		'<a data-href="$confirm.ok" class="firm firm-ok">确定</a>',
		'<a data-href="$confirm.no" class="firm firm-no">取消</a>',
	'</div>',
'']});

var CommonBtns = {
	left : [],
	right : [{name:"ok", text: "确定"}, {name:"cancel", text:"取消"}] 
};
globalActionConfig([["nvdialog-click",function(params,el){
	var action = params.key;
	if (action === "cancel")
		return hideDialog();
	$XF(dialogCfg, "listen." + action)();
}],["ixw.alert.close", function(params, el){
	jQuery($XH.ancestor(el, "ixw-alert")).removeClass("animate-shake");
	jQuery("#IXW-alert").fadeOut();
}],["confirm.ok", function(params, el){
	jQuery("#IXW-alert").fadeOut();
	confirmCfg.okFn();
}],["confirm.no", function(params, el){
	jQuery("#IXW-alert").fadeOut();
}]]);
function dialogBodyRefresh(bodyEl){
	bodyEl.className = "ixw-body nv-dialog " + $XP(dialogCfg, "clz", "");
	bodyEl.innerHTML = t_modal.renderData("", {
		title : $XP(dialogCfg, "title", ""),
		content : $XP(dialogCfg, "content", ""),
		lbtns : $XP(dialogCfg, "btns.left", CommonBtns.left),
		rbtns : $XP(dialogCfg, "btns.right", CommonBtns.right)
	});
	$XF(dialogCfg, "afterShow")(bodyEl);
}

function showDialog(cfg){
	dialogCfg = cfg;
	if (!dialog)
		dialog = new IXW.Lib.ModalDialog({
			id : "nv-dialog",
			bodyRefresh : dialogBodyRefresh
		});
	dialog.show();
}

function _alert(content){
	var alert = IXW.Lib.alert(content);
	$XH.addClass($XH.first(alert, "ixw-alert"), "animate-shake");
}

function _confirm(cfg){
	confirmCfg = cfg;
	var divEl = IXW.Lib.alert(confirmCfg.content);
	jQuery(".ixw-close").remove();
	jQuery($XH.first(divEl, "ixw-alert")).addClass("ixw-confirm").append(jQuery(t_confirmBtn.renderData("", {})));
	$XH.addClass($XH.first(divEl, "ixw-alert"), "animate-shake");
}

IX.ns("NV.Dialog");
/* {
	clz
	title : 
	content: 
	btns: {left: [{name,text}], right:[{name, text}]} // default CommonBtns;
	listen: {
		btnname : function()
	},
	afterShow : function(bodyEl)
 }*/
NV.Dialog.show = showDialog;
NV.Dialog.hide = hideDialog;
NV.Dialog.confirm = function(title, msg, okFn){ showDialog({
	title : IX.encodeTXT(title),
	content : t_confirm.renderData("", {msg: msg}),
	listen : { ok : function(){okFn(hideDialog);} }
});};

NV.Dialog.confirm4login = function(title, msg, btns, okFn){ showDialog({
	title : IX.encodeTXT(title),
	btns : btns,
	content : t_confirm.renderData("", {msg: msg}),
	listen : { ok : function(){okFn(hideDialog);} }
});};

NV.Dialog.alert = _alert;

IX.ns("NV.Lib");
/*
	cfg: {
		content
		okFn
	}
 */
NV.Lib.confirm = _confirm;
})();
(function () {
var globalActionConfig = IXW.Actions.configActions;
var driverId = TCM.Const.DriverId;

var t_leafItem = new IX.ITemplate({tpl: [
'<div class="leaf {clz}">',
	'<a class="nv-checkbox {chkClz}" data-href="${action}" data-key="{key}">',
		'<span class="ixpic-"></span><span class="text">{name}</span></a>',
'</div>',
'']});

var t_combo = new IX.ITemplate({tpl: [
	'<span class="dropdown">',
		'<input type="hidden" id="{valueId}" value="{value}">',
		'<button class="dropdown-toggle" type="button" id="{comboId}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">',
			'<span class="name">{valueText}</span><span class="pic-"></span>',
		'</button>',
		'<ul class="dropdown-menu" aria-labelledby="{comboId}">','<tpl id="items">','<li class="{clz}">',
			'<a data-href="${action}" data-key="{id}">{name}</a>',
		'</li>','</tpl>','</ul>',
	'</span>',
'']});

var t_radioCombo = new IX.ITemplate({tpl: [
	'<span class="dropdown">',
		'<input type="hidden" id="{valueId}" value="{value}">',
		'<button class="dropdown-toggle" type="button" id="{comboId}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">',
			'<span class="name">{valueText}</span><span class="pic-"></span>',
		'</button>',
		'<div class="dropdown-menu {dropdownClz}" aria-labelledby="{comboId}">',
		'<tpl id="items">',
			t_leafItem.renderData('', {clz: "item", key: "{id}", action: "{action}"}),
		'</tpl>',
		'</div>',
	'</span>',
'']});

var t_checkbox = new IX.ITemplate({tpl: [
	'<input type="hidden" id="{valueId}" value="{value}">',
	'<a class="nv-checkbox {clz}" data-href="${action}">',
		'<span class="ixpic-"></span><span>{text}</span></a>',
'']});



globalActionConfig([["nvcombo.pick", function(params,el){
	var id = params.key, name = el.innerHTML;
	// driver关联设备类型为20,21,22,50的用户名与密码端口号
	if(jQuery(".IPC-edit").length > 0 || jQuery(".coder-edit").length > 0){
		switch(id){
			case driverId.DH_host_IPC :
			case driverId.DH_host_coder :
				setParams("admin", "admin", "37777");
				break;
			case driverId.YS_host_IPC :
			case driverId.YS_host_coder :
				setParams("admin", "admin", "0");
				break;
			case driverId.AXS_rtsp_IPC :
			case driverId.AXS_rtsp_coder :
				setParams("root", "pass", "554");
				break;
			case driverId.DH_rtsp_IPC :
			case driverId.DH_rtsp_coder :
			case driverId.YS_rtsp_IPC :
			case driverId.YS_rtsp_coder :
				setParams("admin", "admin", "554");
				break;
			case driverId.AVS_IPC :
			case driverId.AVS_coder :
				setParams("admin", "admin", "4060");
				break;
			case driverId.NKF_rtsp_IPC :
			case driverId.NKF_rtsp_coder :
				setParams("admin", "", "554");
				break;
			default :
				setParams("admin", "admin", "");
				break;
		}
	}
	if (jQuery(".decoder-edit").length > 0) {
		if (id == driverId.JS_decoder) {
			setParams("admin", "admin", "6000");
		}
	}
	// 关联结束
	var dropdownEl = $XH.ancestor(el, "dropdown");
	if (!dropdownEl) return;
	var inputEl = $XD.first(dropdownEl, "input");
	inputEl.value = id;
	var nameEl = $XH.first($XH.first(dropdownEl, "dropdown-toggle"), "name");
	nameEl.innerHTML = name;
}],["nvcheckbox.check", function(params,el){
	var ifChecked = !$XH.hasClass(el, "selected");
	$XH[ifChecked?"addClass":"removeClass"](el, "selected");
	var inputEl = $XD.first(el.parentNode, "input");
	inputEl.value = ifChecked;
}],["nvradiocombo.pick", function(params, el){
	var nodeEls = jQuery(".dropdown-menu").children(".leaf");
	nodeEls.each(function(){
		jQuery(this).children('.nv-checkbox').removeClass('selected');
	});
	$XH.toggleClass(el, "selected");
	var id = params.key, name = jQuery(el).children(".text").html();
	var dropdownEl = $XH.ancestor(el, "dropdown");
	if (!dropdownEl) return;
	var inputEl = $XD.first(dropdownEl, "input");
	inputEl.value = id;
	var nameEl = $XH.first($XH.first(dropdownEl, "dropdown-toggle"), "name");
	nameEl.innerHTML = name;
}]]);
function setParams(name, pass, port){
	jQuery("#device_username").attr("value",name);
	jQuery("#device_password").attr("value",pass);
	jQuery("#device_port").attr("value",port);
}

function getComboHTML(id, cfg, action){return t_combo.renderData("", IX.inherit({
	valueId : id,
	comboId : id + "_combo"
}, cfg)).replaceAll("{action}", action ? action : "nvcombo.pick");}

function getRadioComboHTML(id, cfg){return t_radioCombo.renderData("", IX.inherit({
	valueId : id,
	comboId : id + "_radioCombo"
}, cfg)).replaceAll("{action}", "nvradiocombo.pick");}


function getCheckBoxHTML(id, value, text, actionName){return t_checkbox.renderData("", {
	valueId : id, 
	value : value,
	text: text,
	clz : value ?"selected": ""
}).replaceAll("{action}", actionName ? actionName : "nvcheckbox.check");}

IX.ns("NV.Lib");
/**  (id, cfg : {
	value :
	valueText:
	items :[{id, name[, action]}]
	
})
 */ 
NV.Lib.getComboHTML = getComboHTML;
NV.Lib.getRadioComboHTML = getRadioComboHTML;
/**   (id, value, text[,actionName])
 */ 
NV.Lib.getCheckboxHTML = getCheckBoxHTML;

IX.setNS('TCM.Tpl.nvRadio', t_radioCombo);
})();
(function () {
var globalActionConfig = IXW.Actions.configActions;
var instHT = {};
function getInst(el){
	var  gridEl = $XH.ancestor(el, "ixw-grid");
	if (!gridEl)return null;
	return instHT[gridEl.id];
}

globalActionConfig([["ixw.grid.col", function(params, el){
	var inst = getInst(el);
	if (!inst) return;
	inst.colAction(params.key, el);
}], ["ixw.grid.cell", function(params, el){
	var inst = getInst(el);
	var ulEl = $XH.ancestor(el, "row");
	if (!inst || !ulEl) return;
	inst.cellAction($XD.dataAttr(ulEl, "id"), params.key, el);
}], ["ixw.grid.action", function(params, el){
	var inst = getInst(el);
	var ulEl = $XH.ancestor(el, "row");
	if (!inst || !ulEl) return;
	inst.rowAction($XD.dataAttr(ulEl, "id"), params.key, ulEl);
}]]);


var t_grid = new IX.ITemplate({tpl: [
	'<div id="{id}" class="ixw-grid {clz}">',
		'<ul class="hdr">','<tpl id="header">',
			'<li class="col-{name}">',
				'<a data-href="$ixw.grid.col" data-key="{name}">',
					'<span>{html}</span>',
					'<span class="pic- hide"></span>',
				'</a>',
			'</li>',
		'</tpl>',
		'</ul>',
		'<div class="body">','<tpl id="rows">',
			'<ul data-id="{id}" class="row {clz}">','<tpl id="cells">',
				'<li class="col-{name}">',
					'<a class="cell {longClz}" data-href="$ixw.grid.cell" data-key="{name}" title = "{title}">{html}</a>',
				'</li>',
			'</tpl>',
				'<li class="r col-actions invisible">',
					'<div class="btns-group {moreClz}">',
						'<a class="act-more dropdown-toggle" data-toggle="dropdown" title="更多操作"></a>',
						'<ul class="dropdown-menu">','<tpl id="dropdowcActs">',
							'<li><a data-href="$nvgrid.clickTool" data-key="{name}">{html}</a></li>',
							'</tpl>',
						'</ul>',
					'</div>','<tpl id="actions">',
					'<a class="act-{name}" data-href="$ixw.grid.action" data-key="{name}" title="{title}">{html}</a>',
				'</tpl>','</li>',
			'</ul>',
		'</tpl>','</div>',
	'</div>',
'']});


IX.ns("IXW.Lib");
/** cfg : {
	container : //required if use show function
	id,		// optional

	rowModel : function(rowData, colModels)// default is RowModelBase

	columns : [name],
	actions  : [[name, function(rowModel, rowEl){}], ...
	dataLoader :function(params, cbFn)
	}
 */
IXW.Lib.Grid = function(cfg){
	var container = $XP(cfg,  "container");
	var id = cfg.id || IX.id();
	var actionHT = IX.loop($XP(cfg, "actions", []), {}, function(acc, act){
		acc[act[0]] = act[2];
		return acc;
	});
	var model = new IXW.Lib.GridModel(id, cfg);

	function _show(){
		var el = $X(container);
		if(!el) return;
		el.innerHTML = t_grid.renderData("", model.getTpldata());
	}
	function _refresh(onlyData){
		var bodyEl = $XH.first($X(id), "body");
		if (!bodyEl || onlyData) return;
		var tpldata = model.getTpldata();
		bodyEl.innerHTML = IX.map(tpldata.rows, function(rowData){
			return t_grid.renderData("rows", rowData);
		}).join("");
	}
	var self = {
		getHTML : function(){
			return t_grid.renderData("", model.getTpldata());
		},
		getId : function(){return id;},
		getModel : function(){return model;},
		show :function(){model.load(0, _show);},
		refresh : function(onlyData){_refresh(onlyData);},
		colAction : function(name, colEl){
			// to be overrided;
		},
		cellAction : function(rowId, name, cellEl){
			// to be overrided;
		},
		rowAction : function(rowId, actionName, rowEl){
			actionHT[actionName](model.getRow(rowId), rowEl);
		}
	};
	instHT[id] = self;
	return self;
};
})();
(function () {
var globalActionConfig = IXW.Actions.configActions;
var ixwGrid = IXW.Lib.Grid;

var t_pagin = new IX.ITemplate({tpl: [
	'<div id="{id}-indics" class="l">','<tpl id="indics">',
		'从<span>{stx}</span>到<span>{endx}</span>/共<span>{pagex}</span>条数据',
	'</tpl>','</div>',
	'<div class="m">{paginHTML}</div>',
	'<div class="r">',
		'<span>显示</span><div class="page">',
		'<div class="dropdown">',
			'<a class="changePage dropdown-toggle" data-toggle="dropdown">',
				'<span id="curPage" class="pagesize">{pageInfo}</span><span class="pgFrame"><span class="pic-pg"></span></span>',
			'</a>',
			'<ul class="dropdown-menu">','<tpl id="list">','<li class="{clz}" id="{id}">',
				'<a class="pagesize" data-href="$nvpagin.change" data-key="{value}" data-target="{id}">{html}</a>',
			'</li>','</tpl>','</ul>',
		'</div></div>',
	'</div>',
'']});

var PagesizeList = [
{id : "page-0",value : 20, text : "每页20条"},
{id : "page-1",value : 50, text : "每页50条"},
{id : "page-2",value : 100, text : "每页100条"}
];
var currentPageSize = PagesizeList[0];

function getPaginTpldata(id){ return {
	id : id,
	indics: [{stx : 0,endx : 0, pagex : 0}],
	paginHTML : "",
	pageInfo : currentPageSize.text,
	list : IX.map(PagesizeList,function(item){return {
		value : item.id,
		clz : item.id == currentPageSize.id ? "disabled" : "",
		html : item.text
	};})
};}

var paginListeners = {};
globalActionConfig([["nvpagin.change",function(params,el){
	var liEl = el.parentNode;
	if ($XH.hasClass(liEl, "disabled"))
		return;
	var _el = $XH.ancestor(liEl, "dropdown");
	var curpsEl = $XH.first($XD.first(_el, "a"), "pagesize");
	curpsEl.innerHTML = el.text;

	$XH.removeClass($XH.first(liEl.parentNode,  "disabled"), "disabled");
	$XH.addClass(liEl, "disabled");

	currentPageSize = PagesizeList[params.key.split("-").pop()];
	var fn = paginListeners[$XD.dataAttr(el, "target")];
	if (IX.isFn(fn))
		fn(currentPageSize.value);
}]]);

function NVPagination(id){
	var inst = new IXW.Lib.Pagination({
		id : id + "-pagin",
		total : 0,
		current : 0
	});
	var tpldata = getPaginTpldata(id);
	tpldata.paginHTML = inst.getHTML();

	return {
		getHTML : function(){return t_pagin.renderData("", tpldata);},
		getCurrentPageNo : function(){return inst.getCurrentPageNo();},
		bind : function(pageNoChangedFn, pageSizeChangeFn){
			inst.bind(pageNoChangedFn);
			paginListeners[id] = function(pageSize){
				// pageSizeChangeFn(inst.getCurrentPageNo(), pageSize);
				pageSizeChangeFn(0, pageSize);
			};
		},
		jump : inst.jump,
		refresh : function(totalPages, currentPageNo, itemNum, onlyData){
			inst.apply(currentPageNo, totalPages, onlyData);
			tpldata.paginHTML = inst.getHTML();
			var stx = currentPageNo * currentPageSize.value;
			tpldata.indics = [{stx : stx, endx : stx + itemNum, pagex : itemNum}];
			var el = $X(id + "-indics");
			if (!onlyData && el)
				 el.innerHTML = t_pagin.renderData("indics", tpldata.indics[0]);
		}
	};
}


var t_tools = new IX.ITemplate({tpl: [
	'<div id="{id}_tool">','<tpl id="btns">',
		'<a class="btn-{name} {clz}" data-href="$nvtool.click" data-target="{id}" data-key="{name}"></a>',
	'</tpl>','</div>',
'']});

var toolListens = {};
globalActionConfig([["nvtool.click", function(params, el){
	if ($XH.hasClass(el, "disabled")) return;
	var fn = toolListens[$XD.dataAttr(el, "target")];
	if (IX.isFn(fn))
		fn(params.key);
}]]);

/** cfg :{
	buttons : [{name:, chkEnabled :}]
	actions : {
		name : function(){}
	}	
   }
 */
function NVTools(id, cfg){
	var tpldata = {
		id : id,
		btns : IX.map($XP(cfg, "buttons", []), function(btn){ return {
			name : btn.name,
			clz : $XP(btn, "chkEnabled", true)? "chkEnable disabled" : ""
		};})
	};
	toolListens[id] = function(name){$XF(cfg, "actions." + name)();};
	function _enable(isEnabled){
		var el = jQuery("#" + id + "_tool .chkEnable");
		el[isEnabled?"removeClass":"addClass"]("disabled");
	}
	return {
		getHTML : function(){return t_tools.renderData("", tpldata);},
		enable : function() {_enable(true);},
		disable : function(){_enable(false);}
	};
}


var t_grid = new IX.ITemplate({tpl: [
'<div id="{id}" class="nv-grid nv-box {gridClz}">',
	'<div class="nvgrid-title nv-title">{title}</div>',
	'<div class="nvgrid-tools">{toolHTML}</div>',
	'<div class="nvgrid-body">{gridHTML}</div>',
	'<div class="nvgrid-foot">{paginHTML}</div>',
'</div>',
'']});

/** cfg : {
	container : //required
	id, // optional

	clz : gridClz,
	title : "XXX"
	
	usePagination : false; default true;
	
	rowModel : function(rowData, colModels), //optional
	columns : [name],
	actions : [[name, function(rowModel, rowEl)]]
	dataLoader : function(params, cbFn)
	clickOnRow : function(rowId)

	tools : {
		buttons : [{name, chkEnabled}]
		actions : {
			name : function(){}
		}	
	}
}
 */
IX.ns("NV.Lib");
NV.Lib.Grid = function(cfg){
	var container = $XP(cfg,  "container");
	var id = cfg.id || IX.id();

	var toolCfg = $XP(cfg, "tools");
	var usePagination = $XP(cfg, "usePagination", true);
	var clickOnRow = $XF(cfg, "clickOnRow");

	var grid = new IXW.Lib.Grid(IX.inherit(cfg, {
		id : id + "-grid",
		pageSize : currentPageSize.value,
		dataLoader : $XF(cfg, "dataLoader")
	}));
	var model = grid.getModel();

	function applyHover(){
		jQuery($X(container)).find(".row").hover(
			function(){$XH.addClass(this, "hover");},
			function(){$XH.removeClass(this, "hover");}
		);
	}
	function _getSelectedCells(){
		return jQuery("#" + id + "-grid").find(".row .selected");
	}
	
	var pagin =	null, tools = null, onselectRow = IX.emptyFn;
	function afterLoaded(pageNo, items, onlyData){
		grid.refresh(onlyData);
		if (!onlyData)
			applyHover();
		if(pagin)
			pagin.refresh(model.getPageCount(), pageNo, items.length, onlyData);
		if (tools)
			tools.disable();
	}
	function loadPage(pageNo){
		model.load(pageNo, function(items){afterLoaded(pageNo, items);});
	}
	if (toolCfg) {
		tools = new NVTools(id, toolCfg);
		onselectRow = function(){
			var selectedCells = _getSelectedCells();
			tools[selectedCells.length>0?"enable":"disable"]();
		};
	}

	grid.colAction = function(name, colEl){
		if (name == "_check"){
			var el = jQuery(colEl);
			var ifAllSelected = el.find(".checkbox").hasClass("selected");
			var checkboxEls = el.parents(".ixw-grid").find(".col-_check .checkbox");
			checkboxEls[ifAllSelected?"removeClass":"addClass"]("selected");
			onselectRow();
		}
	};
	grid.cellAction = function(rowId, cellName, cellEl){
		if (cellName == "_check"){
			$XH.toggleClass($XH.first(cellEl, "checkbox"), "selected");
			var isChoseAll = true;
			jQuery(".ixw-grid .body").find(".checkbox").each(function(){
				if (!$XH.hasClass(this, "selected")) isChoseAll = false;
			});
			var choseAllEl = jQuery(".ixw-grid").find(".hdr .checkbox")[0];
			if (isChoseAll){
				$XH.addClass(choseAllEl,"selected");
			}else{
				$XH.removeClass(choseAllEl,"selected");
			}
			onselectRow();
		} else {
			clickOnRow(rowId, cellName, cellEl);
		}
	};

	if (usePagination){
		pagin = new NVPagination(id);
		pagin.bind(loadPage, function(pageNo, pageSize){
			model.resetPage(pageNo, pageSize, function(items){
				afterLoaded(pageNo, items);
			});
		});
	}

	function _show(items){
		var el = $X(container);
		if (!el)
			return;
		afterLoaded(0, items, true);
		el.innerHTML = t_grid.renderData("", {
			id : id, 
			gridClz : $XP(cfg, "clz", ""),
			title : $XP(cfg, "title",  ""),
			toolHTML : tools ? tools.getHTML() :"",
			gridHTML : grid.getHTML(),
			paginHTML : pagin?pagin.getHTML() : ""
		});
		applyHover();
	}
	function _refresh(pageNo){
		jQuery('.nvgrid-body .col-_check .checkbox').removeClass("selected");
		jQuery('.nvgrid-tools .chkEnable').addClass("disable");
		if (pagin) pagin.jump(pageNo);
		else loadPage(0);
	}
	return {
		getModel : function(){return model;},
		getSelectedRows : 	function(){
			return IX.map(_getSelectedCells(), function(el){
				var _el = $XH.ancestor(el, "row");
				return model.getRow($XD.dataAttr(_el, "id"));
			});
		},
		addItems : function(ids){
			model.addItems(ids);
			_refresh(model.getPageCount()-1);
		},
		removeItems : function(ids){
			model.removeItems(ids);
			_refresh(Math.min(pagin ? pagin.getCurrentPageNo(): 0, model.getPageCount()-1));
		},
		show: function(){model.load(0, _show);},
		refresh : function(pageNo){_refresh(pageNo);}
	};
};
})();
(function(){
var GridModel = IXW.Lib.GridModel;
var ColumnModelBase = GridModel.ColumnModelBase;
var registerColumnModel= GridModel.registerColumnModel;

var lineInfo = TCM.LineInfo;
var SiteTypes = TCM.Const.SiteTypeNames;
var UserTypes = TCM.Const.UserTypeNames;
var DeviceTypes= TCM.Const.DeviceTypeNames;

function formatDate(tick,withTime){
	if (!tick) return "";
	return IX.Date.format(new Date(tick*1000), withTime?"":"Date");
}

function getCommonColumnModel(name, title, htmlFn, isLongStr){
	var column = new ColumnModelBase({name: name, title: title});
	column.getCellTpldata = function(item){return {
		name: name,
		html: htmlFn(item),
		title : isLongStr ? htmlFn(item) : "",
		longClz : isLongStr ? "longName" : ""
	};};
	return column;
}

var roleTitle4LevelTpl = new IX.ITemplate({tpl :[
	'<div>{title}</div>',
	'<ul>',
		'<li class="col-role-name">角色名称</li>',
		'<li class="col-role-type">所属单位类型</li>',
		'<li class="col-role-prompt {clz}">特殊处理</li>',
	'</ul>'
]});
var roleCell4LevelTpl = new IX.ITemplate({tpl :[
	'<ul>',
		'<li class="col-role-name">{name}</li>',
		'<li class="col-role-type">{type}</li>',
		'<li class="col-role-prompt">{prompt}</li>',
	'</ul>'
]});
var LevelTypeHdrHTMLs = {
	station : roleTitle4LevelTpl.renderData("", {title : "车站优先级说明",clz:"prompt1"}) ,
	depot : roleTitle4LevelTpl.renderData("", {title : "车辆段／停车场优先级说明",clz:"prompt2"})
};
function getHtml4RoleInLevel(item,typeName){
	var r = item[typeName];
	return roleCell4LevelTpl.renderData("", {
		name : lineInfo.getRoleName(r.id) || "预留",
		type : lineInfo.getSiteTypeNameOfRole(r.id),
		prompt: r.prompted ? "需要启动临时授权" :""
	});
}
function getRoleColumnModel(typeName){return {
	getTitleTpldata : function(){return {
		name : "role",
		html : LevelTypeHdrHTMLs[typeName]
	};},
	getCellTpldata : function(item){return {
		name : "role",
		html : getHtml4RoleInLevel(item, typeName),
		title : "",
		longClz : ""
	};}
};}

var CheckboxTplData = {
	html :"<span class='checkbox'></span>",
	name : "_check",
	title : "",
	longClz : ""
};
IX.iterate([
["_checkbox", function(){return {
	getTitleTpldata : function(){return CheckboxTplData;},
	getCellTpldata : function(){return CheckboxTplData;}
};}],
["_no", "编号"],
["name", {name : "name", title : "名称", isLongStr : true}],
["desc", {name : "desc", title : "说明", isLongStr : true}],

["siteNo", {name : "no", title: "编号"}],
["siteType",function(){return getCommonColumnModel("type", "单位类型", function(item){
	return SiteTypes[item.type] || "";
}, true);}],

["roleName", {name : "name", title: "角色名称", isLongStr : true}],
["roleType", function(){return getCommonColumnModel("type", "角色所属单位类型", function(item){
	return SiteTypes[item.siteType] || "";
}, true);}],
["rolePromptable", function(){return getCommonColumnModel("promptable", "特殊情况下是否允许启动临时授权", function(item){
	return item.promptable ? "允许" : "";
});}],

["levelName", {name : "name", title: "级别"}],
["station", function(){return getRoleColumnModel("station");}],
["depot", function(){return getRoleColumnModel("depot");}],

["userName", {name : "name", title: "用户名称"}],
["account", "登录名称"],
["utype", function(){return getCommonColumnModel("type", "用户类型", function(item){
	return UserTypes[item.type] || "";
}, true);}],
["userSite", function(){return getCommonColumnModel("site", "所属单位", function(item){
	return lineInfo.getSiteName(item.siteId);
}, true);}],
["userRole", function(){return getCommonColumnModel("role", "角色名称", function(item){
	return lineInfo.getRoleName(item.role);
}, true);}],

["devNo", "编号"],
["devType", function(){return getCommonColumnModel("type", "设备类型", function(item){
	return DeviceTypes[item.type] || "";
}, true);}],
["Provider", function(){return getCommonColumnModel("provider", "厂家", function(item){
	return TCM.Device.getDriver(item.driverId).provider || "";
},true);}],
["Style", function(){return getCommonColumnModel("style", "型号", function(item){
	return TCM.Device.getDriver(item.driverId).style || "";
},true);}],
["devName", function(){return getCommonColumnModel("name", "名称", function(item){
	return IX.encodeTXT(item.name || "");
}, true);}],
["devProvider", function(){return getCommonColumnModel("provider", "厂家", function(item){
	return IX.encodeTXT($XP(item, "provider", ""));
},true);}],
["devStyle", function(){return getCommonColumnModel("style", "型号", function(item){
	return IX.encodeTXT($XP(item, "style", ""));
});}],
["devDesc", function(){return getCommonColumnModel("desc", "备注", function(item){
	return IX.encodeTXT($XP(item, "desc", ""));
}, true);}],
["devIp", function(){return getCommonColumnModel("ip", "IP地址", function(item){
	return IX.encodeTXT($XP(item, "ip", ""));
});}],
["devManageIp", function(){return getCommonColumnModel("manageIp", "管理口IP地址", function(item){
	return IX.encodeTXT($XP(item, "manageIp", ""));
});}],
["devPort", function(){return getCommonColumnModel("port", "端口号", function(item){
	return IX.encodeTXT($XP(item, "port", ""));
});}],
["devChannelNum", function(){return getCommonColumnModel("channelNum", "通道数", function(item){
	return IX.encodeTXT($XP(item, "channelNum", ""));
});}], 
["devVersion", function(){return getCommonColumnModel("version", "软件版本", function(item){
	return IX.encodeTXT($XP(item, "version", ""));
},true);}],
["devbcPort", function(){return getCommonColumnModel("bcPort", "组播流端口", function(item){
	return IX.encodeTXT($XP(item, "bcPort", ""));
});}],
["devdiskNum", function(){return getCommonColumnModel("diskNum", "硬盘数量", function(item){
	return IX.encodeTXT($XP(item, "diskNum", ""));
});}],
["devCapacity", function(){return getCommonColumnModel("capacity", "存储总容量", function(item){
	return IX.encodeTXT($XP(item, "capacity", ""))+"GB";
});}],
["devPath", function(){return getCommonColumnModel("path", "对应的软件名称或网页地址", function(item){
	return IX.encodeTXT($XP(item, "path", ""));
}, true);}],
["devRelatedSpliter", function(){return getCommonColumnModel("relatedSpliter", "关联画面分割器", function(item){
	return IX.encodeTXT($XP(item, "relatedSpliter", ""));
},true);}],
["devMaxWindow", function(){return getCommonColumnModel("maxWindow", "最大画面数", function(item){
	return IX.encodeTXT($XP(item, "maxWindow", ""));
});}],


["num", "数量"],

["zno", "编号"],
["zname", "名称"],

["dname", "摄像机名称"],
["dstat", "录像状态"],
["startDate", "录像开始时间"],
["endDate", "录像结束时间"],

["range", function(){
	var column = new ColumnModelBase({name : "range", title : "完整录像周期显示"});
	column.getCellTpldata = function(item){
		return {
			name : "range",
			html :"<span class='range'></span>"
		};
	};
	return column;
}],

], function(col){
	var name = col[0], fn = col[1];
	registerColumnModel(name, IX.isFn(fn)?fn : function(){
		return new ColumnModelBase(IX.isString(fn)?{name : name, title : fn} : fn);
	});
});
})();
(function () {

var RowModelBase = IXW.Lib.GridModel.RowModelBase ;

function RowModel(rowData, colModels,actions,moreActions){
	var rowModel = new RowModelBase(rowData, colModels, actions,moreActions);
	var tpldata = rowModel.getTpldata();
	tpldata.clz = rowData.enabled?"":"disabled";
	rowModel.getTpldata = function(){return tpldata;};
	return rowModel;
}

IX.ns("TCM.Lib");

var AllBtns = {
	"refresh" : false,
	"create" : false,
	"add" : false,

	"delete" : true
};


/***
	container : 'body',
	cfg :{
		title  : "XXX",
		grid : {
			clz : 
			columns:
			actions :  [["name", "title", function()...]],
			usePagination : false; default true;
			clickOnRow : function(rowId){} //optional
			dataLoader : function(parms, cbFn)
		}
		tools : { //default
			buttons: ["refresh", "create", "delete"]

			actions : {name : function(){}}
		}
		listen :{
			createItem : function(cbFn)
			deleteItems : function(rowModels, cbFn){}
		}
	}
 */
TCM.Lib.Grid =function(container, cfg){
	var grid = null;
	var createItemFn = $XF(cfg, "listen.createItem"),
		deleteItemsFn = $XF(cfg, "listen.deleteItems");

	function createFn(){
		createItemFn(function(data){
			grid.addItems(data.ids);
		});
	}
	function deleteFn(rows){
		deleteItemsFn(rows, function(){
			grid.removeItems(IX.map(rows, function(row){return row.getId();}));
		});
	}
	function _deleteItem(rowModel){deleteFn([rowModel]);}

	grid = new NV.Lib.Grid(IX.inherit(cfg.grid, {
		container : container,
		title : $XP(cfg, "title", ""),
		rowModel : $XP(cfg, "rowModel", RowModel),
		actions : IX.loop($XP(cfg, "grid.actions", []), [],  function(acc, action){
			if (IX.isString(action)) {
				if (action == "delete")
					acc.push(["delete", "删除",_deleteItem]);
				return acc;
			}	
			if (action.length<=2 && action[0] == "delete")
				action[2] = _deleteItem;
			acc.push(action);
			return acc;
		}),
		tools : {
			buttons : IX.map($XP(cfg, "tools.buttons", []), function(btnName){
				return {name : btnName, chkEnabled : AllBtns[btnName]};
			}),
			actions : IX.inherit({
				refresh : function(){grid.refresh();},
				create : createFn,
				add : createFn,
				"delete" : function(){deleteFn(grid.getSelectedRows());}
			}, $XP(cfg, "tools.actions"))
		}
	}));

	grid.show();
	return grid;
};
})();
(function () {
var getComboHTML = NV.Lib.getComboHTML;

IX.ns("TCM.Lib");

var siteTypeNames = TCM.Const.SiteTypeNames;
var siteTypeComboTpldata = IX.map(siteTypeNames, function(name, idx){
	return {id : idx, name : name, action : "sys.changeSiteType"};
});
TCM.Lib.getSiteTypeComboHTML = function(id, siteType){
	var _type = IX.isEmpty(siteType)? 3 : siteType;
	return getComboHTML(id, {
		value : _type, 
		valueText : siteTypeNames[_type],
		items : siteTypeComboTpldata
	});
};

TCM.Lib.getRoleComboHTML = function(id, roleId, bool){
	var roleHT = TCM.LineInfo.getRoles();
	var role = roleHT.get(roleId);
	var roleName = role ? role.name : "";
	var siteType = TCM.Env.getSession().getCurrentSiteType();
	var roleList = IX.loop(roleHT.getAll(), [], function(acc, item){
					if (siteType == item.siteType)
						acc.push(item);
					return acc;
				});
	return getComboHTML(id, {
		value : roleId, 
		valueText : roleName,
		items : bool ? roleHT.getAll() :  roleList 
	});
};
})();
(function () {
// function TreeModel(nodes){
// 	var nodeHT = IX.IListManager();
// 	var treeHT = IX.I1ToNManager();
// 	function getNodesHTML(nodes){
// 		return t_treeNodes.renderData("", {
// 			items : IX.map(nodes, function(node){
// 				var HTML = node.children.length === 0 ? "" : getNodesHTML(node.children);
// 				return  {
// 					clz: Array.isArray(node.key) ? "node-"+node.key.join("-"):"node", 
// 					expandClz: HTML === "" ? "none" : "expand", 
// 					html: cfg.htmlFn(node), 
// 					key: node.key,
// 					siteId: node.siteId,
// 					name: node.name, 
// 					zoneId: node.zoneId, 
// 					HTML : HTML
// 				};
// 			})
// 		});
// 	}

// 	return {
// 		getTplData: function(nodes){

// 		},
// 		getNode: function(id){
// 			return nodeHT.get(id);
// 		},
// 		getRelation: function(id){
// 			return treeHT.get(id);
// 		}
// 	};
// }	


var t_treeNodes = new IX.ITemplate({tpl: [
	'<ul>',
		'<tpl id="items">',
			'<li class="{expandClz}">',
				'<a class="{clz}" data-href="$tree.click" data-key="{key}" data-siteId="{siteId}" data-name="{name}" data-zoneId="{zoneId}">',
					'<span class="pic-expand"></span>',
					'<span>{html}</span>',
				'</a>{HTML}',
			'</li>',
		'</tpl>',
	'</ul>',
'']});

var t_tree = new IX.ITemplate({tpl: [
'<div class="nv-tree" id="{id}">{html}</div>',
'']});


var treeActionsConfig = IXW.Actions.configActions;
var treeClickHT = {};
function getTreeClick(el){
	var treeEl = $XH.ancestor(el, "nv-tree");
	if(!treeEl)
		return null;
	return treeClickHT[treeEl.id];
}
treeActionsConfig([
	["tree.click", function(params, el, evt){
		if ($XH.hasClass(evt.target, "pic-expand")){
			var li = jQuery(el).parent().get(0);
			if(jQuery(el).parent().children('ul').css("display") == "none"){
				jQuery(el).parent().children('ul').slideDown();
				if(!$XH.hasClass(li, "none")){
					$XH.removeClass(li, "rotation");
					jQuery(el).parent().find("ul>li").removeClass("rotation");
					$XH.removeClass(li, "expand");
					$XH.addClass(li, "fold");
				}
			}else{
				jQuery(el).parent().children('ul').slideUp();
				if(!$XH.hasClass(li, "none")){
					$XH.removeClass(li, "fold");
					$XH.addClass(li, "expand");
					$XH.addClass(li, "rotation");
				}
			}
		}else{
			if(params.key == "{key}")
				return;
			jQuery(".nv-tree").find("a").removeClass('select');
			jQuery(el).addClass('select');
			getTreeClick(el)({
				keys: params.key, 
				siteId: $XD.dataAttr(el, "siteId"), 
				name: $XD.dataAttr(el, "name"),
				zoneId: $XD.dataAttr(el, "zoneId"), 
				el: el
			});
		}
	}]
]);

/**
 *  cfg: {
 *  	data: [{name[, key], nodes: [
 *  		{name[, key], nodes: []},
 *  		...
 *  	]}]
 *  	htmlFn: function(node){},
 *  	click: function(nodeData){}
 *  }
 */

IX.ns("TCM.Lib");
TCM.Lib.Tree = function(cfg){
	var container = $XP(cfg, "container");
	var id = IX.id();
	treeClickHT[id] = $XF(cfg,"click");
	// var model = new IXW.Lib.TreeModel(id, cfg);
	function getNodesHTML(nodes){
		return t_treeNodes.renderData("", {
			items : IX.map(nodes, function(node){
				var HTML = node.nodes.length === 0 ? "" : getNodesHTML(node.nodes);
				return  {
					clz: "tree-node", 
					expandClz: HTML === "" ? "none" : "expand", 
					html: cfg.htmlFn(node), 
					key: node.key,
					siteId: node.siteId,
					name: node.name, 
					zoneId: node.zoneId, 
					HTML : HTML
				};
			})
		});
	}
	function getHTML(){
		return t_tree.renderData("",{
			id : id,
			html : getNodesHTML(cfg.nodes)
		});
	}
	/*function _show(){
		var el = $X(container);
		if(!el) return;
		el.innerHTML = t_tree.renderData("", model.getTpldata());
	}*/
	var tree = {
		getHTML : function(){return getHTML();},
		// show : function(){model.load(_show);},
		refresh : function(){}
	};
	return tree;
};

})();
(function () {
var sysCaller = TCM.Global.sysCaller;
var globalActionConfig = IXW.Actions.configActions;
var SiteTypes = TCM.Const.SiteTypes;

var showDialog = NV.Dialog.show;
var hideDialog = NV.Dialog.hide;

var getCheckboxHTML = NV.Lib.getCheckboxHTML;


var t_leafItem = new IX.ITemplate({tpl: [
'<div class="leaf {clz}">',
	'<a class="nv-checkbox {chkClz}" data-href="$cameraTree.check" data-key="{key}">',
		'<span class="ixpic-"></span><span class="text">{name}</span></a>',
'</div>',
'']});
var t_nodeItem = new IX.ITemplate({tpl: [
'<div class="leaf {clz}">',
	'<a class="nv-checkbox {chkClz}" data-href="$cameraTree.check" data-key="{key}">',
		'<span class="ixpic-"></span><span class="text">{name}</span></a>',
	'<a class="nv-collapse {expClz}" data-href="$cameraTree.expand">',
		'<span class="pic-"></span></a>',
'</div>',
'']});
var t_cameraTree = new IX.ITemplate({tpl: [
'<div class="node line-cameras {expClz}">',
	t_nodeItem.renderData('', {clz: "line", key:"", name: "全线路"}),
	'<tpl id="sites">','<div class="node site-cameras {expClz}">',
		t_nodeItem.renderData('', {clz: "site", key:"{id}"}),
		'<tpl id="zones">','<div class="node zone-cameras {expClz}">',
			t_nodeItem.renderData('', {clz: "zone", key:""}),
			'<tpl id="types">','<div class="node type-cameras">',
				t_leafItem.renderData('', {clz: "type", key:"type"}),
				'<tpl id="items">',
					t_leafItem.renderData('', {clz: "item", key:"{id}"}),
				'</tpl>',
			'</div>','</tpl>',
		'</div>','</tpl>',
	'</div>','</tpl>',
'</div>',
'']});

globalActionConfig([["cameraTree.check",function(params,el){
	var ifChecked = !$XH.hasClass(el, "selected");
	var nodeEl = jQuery(el.parentNode.parentNode);
	if(params.key===""){
		if(jQuery(el.parentNode).next().length===0){
			NV.Dialog.alert("该分区下没有摄像机，授权失败！");
			return ;
		}
	}
	if ($XH.hasClass(el.parentNode, "item")) {
		$XH.toggleClass(el, "selected");
		jQuery(el)[ifChecked?"addClass":"removeClass"]("part");
		var acc=nodeEl.find("div.item a");
		var n=0;
		var length=acc.length;
		for(var i=0;i<length;i++){
			if($XH.hasClass(acc[i], "selected"))
				n=n+1;
		}
		if(n==length){
			nodeEl.find(".type .nv-checkbox").addClass("selected");
			nodeEl.find(".type .nv-checkbox").addClass("part");
		}
		if(n>0&&n!=length){
			nodeEl.find(".type .nv-checkbox").removeClass("selected");
			nodeEl.find(".type .nv-checkbox").addClass("part");
		}
		if(n===0){
			nodeEl.find(".type .nv-checkbox").removeClass("selected");
			nodeEl.find(".type .nv-checkbox").removeClass("part");
		}
	} else{
		nodeEl.find(".nv-checkbox")[ifChecked?"addClass":"removeClass"]("selected");
		nodeEl.find(".nv-checkbox")[ifChecked?"addClass":"removeClass"]("part");
	}
	setCheck(nodeEl);
	// nodeEl.parents(".node").children(".leaf").children(".nv-checkbox").removeClass("selected");
}],["cameraTree.expand",function(params,el){
	if($XH.hasClass(el.parentNode, "site")){
		if(!el.parentNode.nextSibling){
			NV.Dialog.alert("该站点下没有摄像机！");
			return ;
		}
	}
	$XH.toggleClass(el, "expanded");
	$XH.toggleClass(el.parentNode, "expanded");
}]]);
function setCheck(nodeEl){
	var acc=nodeEl.parent().find(".node .nv-checkbox");
	var n=0;
		var length=acc.length;
		for(var i=0;i<length;i++){
			if($XH.hasClass(acc[i], "selected"))
				n=n+1;
		}
		if(n==length){
			nodeEl.parent().children(".leaf").find(".nv-checkbox").addClass("selected");
			nodeEl.parent().children(".leaf").find(".nv-checkbox").addClass("part");
		}
		if(n>0&&n!=length){
			nodeEl.parent().children(".leaf").find(".nv-checkbox").removeClass("selected");
			nodeEl.parent().children(".leaf").find(".nv-checkbox").addClass("part");
		}
		if(n===0){
			nodeEl.parent().children(".leaf").find(".nv-checkbox").removeClass("selected");
			nodeEl.parent().children(".leaf").find(".nv-checkbox").removeClass("part");
		}
		if(nodeEl.parent().hasClass("node"))
		setCheck(nodeEl.parent());
}

function getCameraAccess(treeEl){
	var el = jQuery(treeEl);
	var lineCheckboxEl = el.find(".line>.nv-checkbox")[0];
	if ($XH.hasClass(lineCheckboxEl, "selected"))
		return "all";
	var siteEls = el.find(".site");
	return IX.loop(siteEls, [], function(acc, siteEl){
		var checkboxEl = $XH.first(siteEl, "nv-checkbox");
		var siteId = $XD.dataAttr(checkboxEl, "key")-0;
		if ($XH.hasClass(checkboxEl, "selected")){
			acc.push([siteId, "all"]);
			return acc;
		}
		var selectedCameraEls = jQuery(siteEl.parentNode).find(".item>.selected");
		if (selectedCameraEls.length===0)
			return acc;
		var ids = IX.map(selectedCameraEls, function(_el){
			return $XD.dataAttr(_el, "key") - 0;
		});
		acc.push([siteId, ids]);
		return acc;
	});
}

var DevTypes = TCM.Const.DeviceTypes;
var DevNames = ["枪机", "球机", "半球机"];
function getTypeIdx(cameraType){
	switch(cameraType){
	case DevTypes.IPCFixed:
	case DevTypes.CameraFixed: return 0;
	case DevTypes.IPCSphere:
	case DevTypes.CameraSphere: return 1;
	case DevTypes.IPCSemiSphere:
	case DevTypes.CameraSemiSphere: return 2;
	}
	return 0;
}
function getChkSelected(acc, newValue){
	if (acc === null)
		return newValue;
	if (acc != newValue || acc === "part" || newValue == "part")
		return "part";
	return acc;
}
/**  (cameras: [{id, type, name}], accessHT : {id:true} or "all")

	return {
		selected : "", // "selected", "part"
		data : [{}]
	}
 */
function getCameraTreeTpldatData4Cameras(cameras, accessHT, bool){
	var types = [[],[],[]]; // 0 :枪机， 1:球机， 2:半球机
	var isAll = accessHT == "all";
	var selected = [null, null, null];
	var typesSelected = null;
	if(cameras.length===0){
		typesSelected=accessHT == "all"?"selected":"";
	}

	IX.iterate(cameras, function(c){
		var typeIdx = getTypeIdx(c.type);
		var cid = c.id;
		var chkClz = isAll || (cid in accessHT) ? "selected":"";
		selected[typeIdx] = getChkSelected(selected[typeIdx], chkClz);
		types[typeIdx].push({
			chkClz: chkClz,
			id : c.id,
			name: c.name
		});
	});
	if(bool){
		types[0] = [];
		types[2] = [];
	}
	var arr = IX.loop(types, [], function(acc, typeData, idx){
		if (typeData.length===0) return acc;
		var chkClz = isAll?"selected" : selected[idx];
		typesSelected = getChkSelected(typesSelected, chkClz);
		acc.push({
			chkClz: chkClz,
			name : DevNames[idx],
			items : typeData
		});
		return acc;
	});
	return {
		selected : typesSelected,
		data : arr
	};
}
/**  (siteId, zones: [{
		name:zoneName, cameras: [{id, type, name}]
	]}], accessHT :{id:true} or "all")

	return {
		selected : "", // "selected", "part"
		data : {}
	}
 */
function getCameraTreeTpldatData4Zone(zoneName, cameras, accessHT, bool){
	var typesDatas = getCameraTreeTpldatData4Cameras(cameras, accessHT, bool);
	var flag=accessHT=="all";
	return {
		selected : flag ? "selected" : typesDatas.selected,
		data : {
			name : zoneName,
			chkClz : flag ? "selected" : typesDatas.selected,
			expClz : "expanded",
			types : typesDatas.data
		}
	};
}
/**  (siteId, zones: [{
		name:zoneName, cameras: [{id, type, name}]
	]}], accessValue : [cameraId] or "all")
	return {
		selected : "", // "selected", "part"
		data : {}
	}
 */
function getCameraTreeTpldatData4Site(siteId, zones, accessValue, siteHT, bool){
	var accessHT = accessValue=="all" ? "all" : IX.loop(accessValue, {}, function(acc, item){
		acc[item] = true;
		return acc;
	});
	var zonesInfo=zones;
	var siteSelected = null;
	if(bool&&zones.length>0){
			zonesInfo=IX.loop(zonesInfo, [], function(aww, zone){
			var axx=zone.cameras;
			var azz=[];
			for(var i=0;i<axx.length;i++){
				var ayy=zone.cameras[i];
				if (ayy.type==22||ayy.type==33){
					azz.push(ayy);
				}
			}
			if(azz.length>0)
			aww.push({name:zone.name,cameras:azz});
			return aww;
		});
	}
	var zoneData =IX.map(zonesInfo, function(zone){
		var data = getCameraTreeTpldatData4Zone(zone.name, zone.cameras, accessHT, bool);
		siteSelected = getChkSelected(siteSelected, data.selected);
		return data.data;
	});
	var site = siteHT && siteHT.get(siteId);
	if (zoneData.length===0) {
		siteSelected =  accessValue=="all" ?"selected" : "";
	}
	return {
		selected : siteSelected, 
		data : {
			id : siteId,
			name : site ? site.name : "",
			chkClz : siteSelected,
			expClz : "expanded",
			zones : zoneData
		}
	};
}
/**	 (cameras : [siteId, [{
		name:zoneName, cameras: [{id, type, name}]
	}]]

	accessValue : "all" or [] or [siteId, [cameraId]] or [siteId, "all"]
	)
 */

function getCameraTreeHTML(cameras, accessValue, siteHT, bool){
	var isOCC = TCM.Env.getSession().getCurrentSiteType() == SiteTypes.OCC;
	var tplname = isOCC ? "" : "sites";
	var isAll = accessValue=="all";
	var accessHT = isAll?{} : IX.loop(accessValue, {}, function(acc, item){
		acc[item[0]] = isAll? "all": item[1];
		return acc;
	});

	var sitesSelected = null;
	var siteDatas = IX.map(cameras, function(siteData){
		var siteId = siteData[0], zones = siteData[1];
		var data = getCameraTreeTpldatData4Site(siteId, zones, accessHT[siteId] || [], siteHT, bool);
		sitesSelected = getChkSelected(sitesSelected, data.selected);
		return data.data;
	});

	if(cameras.length===0){
		var siteName=TCM.Env.getSession().getCurrentSite().name;
		var siteId = TCM.Env.getSession().getCurrentSite().id;
		var siteData={chkClz:"part",expClz:"",id:siteId,name:siteName};
		return t_cameraTree.renderData("sites",siteData);
	}

	return t_cameraTree.renderData(isOCC ? "" : "sites", isOCC?{
		chkClz : sitesSelected,
		expClz : "expanded",
		sites : siteDatas
	} : siteDatas[0]);
}

var t_leafItem1 = new IX.ITemplate({tpl: [
'<div class="leaf {clz}">',
	'<a class="nv-checkbox {chkClz}" data-type="{type}" data-href="${action}" data-key="{key}">',
		'<span class="ixpic-"></span><span class="text">{name}</span></a>',
'</div>',
'']});
var t_nodeItem1 = new IX.ITemplate({tpl: [
'<div class="leaf {clz}">',
	'<a class="nv-checkbox {chkClz}" data-href="${action}" data-type="{type}">',
		'<span class="ixpic-"></span><span class="text">{name}</span></a>',
	'<a class="nv-collapse {expClz}" data-href="$camera.expand">',
		'<span class="pic-"></span></a>',
'</div>',
'']});
var t_addCamera = new IX.ITemplate({tpl: [
	'<tpl id="types">',
		t_nodeItem1.renderData('', {clz: "type", type:"{type}"}),
		'<div class="node type-cameras {clz}">','<tpl id="items">',
			t_leafItem1.renderData('', {clz: "item", key:"{id}"}),
		'</tpl>','</div>',
	'</tpl>',
'']});

globalActionConfig([["camera.check",function(params,el){
	var ifChecked = !$XH.hasClass(el, "selected");
	var nodeEl = jQuery(el.parentNode);
	if ($XH.hasClass(el.parentNode, "item")) {
		$XH.toggleClass(el, "selected");
		var acc=nodeEl.parent().find(".nv-checkbox");
		var n=0;
		var length=acc.length;
		for(var i=0;i<length;i++){
			if($XH.hasClass(acc[i], "selected"))
				n=n+1;
		}
		if(n==length){
			nodeEl.parent().prev().find(".nv-checkbox").removeClass("part");
			nodeEl.parent().prev().find(".nv-checkbox").addClass("selected");
		}
		if(n>0&&n!=length){
			nodeEl.parent().prev().find(".nv-checkbox").removeClass("selected");
			nodeEl.parent().prev().find(".nv-checkbox").addClass("part");
		}
		if(n===0){
			nodeEl.parent().prev().find(".nv-checkbox").removeClass("selected");
			nodeEl.parent().prev().find(".nv-checkbox").removeClass("part");
		}
	} else{
		$XH.toggleClass(el, "selected");
		jQuery(el)[ifChecked?"addClass":"removeClass"]("part");
		nodeEl.next().find(".nv-checkbox")[ifChecked?"addClass":"removeClass"]("selected");
	}
}],["camera.expand",function(params,el){
	$XH.toggleClass(el, "expanded");
	$XH.toggleClass(el.parentNode, "expanded");
	var ee=$XH.ancestor(jQuery(el.parentNode).siblings(".type").get(0),"expanded");
	if(ee){
		$XH.toggleClass(ee, "expanded");
		$XH.toggleClass($XH.first(ee, "nv-collapse"), "expanded");
	}
	var ex=$XH.ancestor(jQuery(el.parentNode).siblings(".type").get(1),"expanded");
	if(ex){
		$XH.toggleClass(ex, "expanded");
		$XH.toggleClass($XH.first(ex, "nv-collapse"), "expanded");
	}
}]]);
function getCamera4TypeAccess(treeEl){
	var selectedCameraEls = jQuery(treeEl).find(".item>.selected");
	if (selectedCameraEls.length===0)
		return [];
	var ids = IX.map(selectedCameraEls, function(_el){
		return $XD.dataAttr(_el, "key");
	});
	return {ids: ids};
}

function getCameraTpldatData4Cameras(cameras, type, action){
	var types = [[],[],[]]; // 0 :枪机， 1:球机， 2:半球机
	IX.iterate(cameras, function(c){
		var typeIdx = getTypeIdx(c.type);
		types[typeIdx].push({
			action : action ? action : "camera.check",
			chkClz: "",
			id : c.id,
			name : c.name,
			type : c.type
		});
	});
	return IX.loop(types, [], function(acc, typeData, idx){
		if (typeData.length===0) return acc;
		acc.push({
			clz : "cameras"+idx,
			action : action ? action : "camera.check",
			chkClz : "",
			expClz : "expanded",
			name : DevNames[idx],
			type : idx === 0? 20: (idx === 1? 22: 21),
			items : typeData
		});
		return acc;
	});
}

function getCamera4TypesHTML(cameras, types, action){
	var typeData = getCameraTpldatData4Cameras(cameras, types, action);
	return t_addCamera.renderData("", {
		types: typeData
	});
}

IX.ns("TCM.Lib");
TCM.Lib.CameraTree = {
	getCameraTreeHTML : function(cameras, accessValue, siteHT, bool){return getCameraTreeHTML(cameras, accessValue, siteHT, bool);},
	getCameraAccess : function(treeEl){return getCameraAccess(treeEl);},
	getCamera4TypesHTML : function(cameras, types, action){return getCamera4TypesHTML(cameras, types, action);},
	getCamera4TypeAccess : function(treeEl){return getCamera4TypeAccess(treeEl);}
};
})();
(function () {
var deviceCaller = TCM.Global.deviceAndZoneCaller;
var globalActionConfig = IXW.Actions.configActions;
var nvAlert = NV.Dialog.alert;

var t_leafItem4Map = new IX.ITemplate({tpl: [
'<div class="c{type} {chkClz}" data-key="{id}" data-type="{type}">',
	'<div class="name">{name}</div>',
	'<a class="delete" data-href="$delete.cameraXY" data-key="{id}"></a>',
'</div> ',
'']});
var t_nodeItem4Map = new IX.ITemplate({tpl: [
'<div class="leaf {clz}">',
	'<span class="text">{name}</span>',
	'<a class="nv-collapse {expClz}" data-href="$camera.expand">',
		'<span class="pic-"></span></a>',
'</div>',
'']});

var t_dragTree = new IX.ITemplate({tpl: [
'<tpl id="types">',
	t_nodeItem4Map.renderData('', {clz: "type", key:"type"}),
	'<div class="node type-cameras {clz}">','<tpl id="items">',
		t_leafItem4Map.renderData('', {clz: "item", key:"{id}"}),
	'</tpl>','</div>',
'</tpl>',
'']});


var DevTypes = TCM.Const.DeviceTypes;
var DevNames = ["枪机", "球机", "半球机"];
var UploadClz = null;
var view = null;
var baseDrag = {
	revert: "invalid",
	start: dragToggle,
	stop: function(event, ui){
		sendData(event, ui, this, "editDeviceOfMap");
	}
};
function getTypeIdx(cameraType){
	switch(cameraType){
		case DevTypes.IPCFixed:
		case DevTypes.CameraFixed: return 0;
		case DevTypes.IPCSphere:
		case DevTypes.CameraSphere: return 1;
		case DevTypes.IPCSemiSphere:
		case DevTypes.CameraSemiSphere: return 2;
	}
	return 0;
}

function getCameraTpldatData4Map(cameras, type){
	var types = [[],[],[]]; // 0 :枪机， 1:球机， 2:半球机
	IX.iterate(cameras, function(c){
		var typeIdx = getTypeIdx(c.type);
		var cid = c.id;
		types[typeIdx].push({
			type : c.type,
			chkClz: "lost",
			id : c.id,
			name: c.name
		});
	});
	return IX.loop(types, [], function(acc, typeData, idx){
		if (typeData.length===0) return acc;
		acc.push({
			clz : "cameras"+idx,
			expClz : "expanded",
			name : DevNames[idx],
			items : typeData
		});
		return acc;
	});
}

function getCamera4Map(cameras, types){
	var typeData = getCameraTpldatData4Map(cameras, types);
	return t_dragTree.renderData("", {
		types: typeData
	});
}

function _init(){
	if (UploadClz)
		return;
	UploadClz = IXW.Lib.FileUploader;
	if (!TCM.Global.filUploadUrl)
		return nvAlert("没有配置检索图片上传路径，文件无法上传");
	UploadClz.init(TCM.Global.filUploadUrl);
}

/**  
 * id :  dom btn ID, // required
 */
function FileUploadBtn(id, afterLoaded, url){
	_init();
	var fileUploader = null, ifUploading = false; 
	function onchangeFn(fileEl){
		var file = (fileEl && "files" in fileEl) ? fileEl.files[0] : null;
		if (file && file.type.indexOf("image")<0)
			return nvAlert("这里只能上传图片，谢谢！");
		if (file && file.size > 1024*1024*100)
			return nvAlert("请不要上传大于 100MB 的图片，谢谢！");
		ifUploading = true;
		jQuery('<div id="mask"></div>').appendTo(jQuery(document.body));
		IXW.Lib.info("正在上传地图，请稍等...", "exist", -1);
		fileUploader.submit(function(data){
			ifUploading = false;
			if (data.message){
				jQuery("#mask").remove();
				jQuery(".ixw-info").remove();
				nvAlert(data.message);
				return;
			}
			afterLoaded(data);
		});
	}
	var cfg = {
		trigger : id,
		onchange : onchangeFn
	};
	if (IX.isString(url))
		cfg.fileUploadURL = url;
	fileUploader = new UploadClz(cfg);
	var zoneId = jQuery(".chooseBar").attr("data-zoneid");
	jQuery("form").append('<input type="hidden" name="zoneId" value="'+ zoneId +'">');
}

var t_camera = new IX.ITemplate({tpl: [
	'<div class="cameraOne c{type}" data-key="{id}" data-type="{type}" style="top: {y}px; left: {x}px;">',
		'<div class="name">{name}</div>',
		'<a class="delete" data-href="$delete.cameraXY" data-key="{id}"></a>',
	'</div> ',
'']});

var t_mapPage = new IX.ITemplate({tpl: [
'<a id="updateFile">选择地图文件</a>',
'<div class="zoom">',
	'<a data-href="$img.shrink" class="shrink"></a>',
	'<a data-href="$img.add" class="add"></a>',
'</div>',
'<div class="suspend">',
	'<a class="notCameras">未指定坐标的摄像机&nbsp;<span class="count"></span></a>',
	'<div id="content" class="tri-title"></div>',
'</div>',
'<div id="imgFrame">',
	'<div class="fix">',
		'<img id="image" src="{imgURL}">','<tpl id="cameras">',
			t_camera.getTpl(),'</tpl>',
	'</div>',
'</div>',
'']});


globalActionConfig([["delete.cameraXY", function(params, el){
	var key = params.key;
	deviceCaller("deleteDeviceOfMap", {id: key}, function(data){
		jQuery(el.parentNode).remove();
		view.deleteCamera(key);
		setCount(1);
	});
}],["img.add", function(params, el){
	view.zoom(1);
}],["img.shrink", function(params, el){
	view.zoom(0);
}]]);
/*
	data: {
		width,
		height,
		url,
		cameras: [{id, name, x, y, type}]
	}
 */
function mapModel(data){
	var width = data.width;
	var height = data.height;
	var url = data.url;
	var cameras = data.cameras || [];
	function _editCamera(camera){
		for (var i = 0; i < cameras.length; i++) {
			if(cameras[i].id == camera.id){
				cameras[i].x = camera.x;
				cameras[i].y = camera.y;
				return;
			}
		}
	}
	return {
		getData: function(){return {
			width: width,
			height: height,
			url: url,
			cameras: cameras
		};},
		resetData: function(newData){
			width = newData.width;
			height = newData.height;
			url = newData.url;
		},
		editCamera: _editCamera,
		addCamera: function(camera){cameras.push(camera);},
		deleteCamera: function(id){
			for (var i = 0; i < cameras.length; i++) {
				if(cameras[i].id == id)
					return cameras.splice(i, 1);
			}
		}
	};
}
/*
	viewData = data
 */
function viewData4Show(viewData, mapEl){
	var positionHT = {}, widthMax, heightMax;
	var widthMap, widthFrame, centerX;
	var heightMap, heightFrame, centerY;
	var scrolling = false, isSmall = false;
	var mapData = new mapModel(viewData);
	var $fix = jQuery(".fix");
	var $imgFrame = jQuery("#imgFrame");
	var $zoom = jQuery(".zoom");
	var $suspend = jQuery(".suspend");

	function resize(isOCC){
		var clientHeight = $X('Grid').clientHeight;
		$X('Tree').style.height = clientHeight + "px";
		if($X("imgFrame"))
			$X('imgFrame').style.height = clientHeight - 110 + "px";
		widthFrame = $imgFrame.width();
		heightFrame = $imgFrame.height();
		centerX = widthFrame/2;
		centerY = heightFrame/2;
		$fix.css("top", "0px");
		if(!isOCC)
			jQuery(".nv-tree").css("maxHeight", clientHeight - 85 + "px");
		else
			jQuery(".nv-tree").css("maxHeight", clientHeight - 55 + "px");
	}
	function setPosition(){
		$fix.css({
			width: widthMap + "px",
			height: heightMap + "px",
	    	left: -1 * (centerX - widthFrame/2) + "px",
	    	top: mapEl.height < heightFrame ? ((heightFrame - heightMap)/2 + "px") : (-1 * (centerY - heightFrame/2) + "px")
	    });
		jQuery(".cameraOne").each(function(){
			var id = $XD.dataAttr(this, "key");
			jQuery(this).css({
				top: Math.floor(positionHT[id].multipleY * heightMap) + "px",
				left: Math.floor(positionHT[id].multipleX * widthMap) + "px"
			});
		});
	}
	function zoom(status){
		if(!$X("image").src)
			return;
		var w, h;
		if(status === 1){
			w = Math.min(widthMap * 1.2, widthMax);
			h = Math.min(heightMap * 1.2, heightMax);
		}else{
		    w = Math.max(widthMap * 0.8, widthFrame);
		    h = heightMap * 0.8;
		    if(w == widthFrame)
		        h = heightMax * w / widthMax; // 保证缩放比例
		}
		if(h < heightFrame)
			isSmall = true;
		else
			isSmall = false;
	    centerX = Math.min(Math.max(centerX * w / widthMap, widthFrame/2), widthMap - widthFrame/2);
	    centerY = Math.min(Math.max(centerY * h / heightMap, heightFrame/2), heightMap - heightFrame/2);
	    widthMap = mapEl.width = w;
	    heightMap = mapEl.height = h;
	    setPosition();
	}
	function scrollIt(event){
	    if(scrolling)
	        return true;
	    scrolling = true;
	    if(event.wheelDelta > 0 || event.detail < 0)
	        zoom(1);
	    else
	        zoom(0);  
	    scrolling = false;
	    event.returnValue = false;
	}
	function _initData(){
		var _data = mapData.getData();
		widthMax = _data.width;
		heightMax = _data.height;
		widthMap = widthMax;
		heightMap = heightMax;
		widthFrame = $imgFrame.width();
		heightFrame = $imgFrame.height();
		centerX = widthFrame/2;
		centerY = heightFrame/2;
		IX.iterate(_data.cameras, function(camera, idx){
			var minWidth = Math.min(_data.width - 40, camera.x);
			var minHeight = Math.min(_data.height - 40, camera.y);
			positionHT[camera.id] = {top: minHeight, left: minWidth, multipleX: minWidth / widthMax, multipleY: minHeight / heightMax};
		});
		setPosition();
	}
	function resetCamera(camera, name){
		positionHT[camera.id] = {top: camera.y, left: camera.x, multipleX: camera.x / widthMax, multipleY: camera.y / heightMax};
		mapData[name](camera);
	}
	_initData();
	return {
		resetCamera: function(camera, name){ resetCamera(camera, name);},
		deleteCamera: function(id){
			positionHT[id] = "";
			mapData.deleteCamera(id);
		},
		refresh: function(newData){
			mapData.resetData(newData);
			_initData();
			setPosition();
		},
		scrollIt: scrollIt,
		zoom: zoom,
		resize: resize,
		resetCenter: function(x, y){
			centerX = x;
			centerY = y;
		},
		ratioX: function(){return widthMax/widthMap;},
		ratioY: function(){return heightMax/heightMap;},
		isSmall: function(){return isSmall;},
		widthFrame: function(){return widthFrame;},
		heightFrame: function(){return heightFrame;}
	};
}

function sendData(event, ui, self, caller){
	var $this = jQuery(self);
	var params = {
		id: $this.attr("data-key"),
		x: Math.floor(parseInt($this.css("left")) * view.ratioX()),
		y: Math.floor(parseInt($this.css("top")) * view.ratioY())
	};
	deviceCaller(caller, params, function(data){
		if(caller == "addDeviceOfMap"){
			view.resetCamera(params, "addCamera");
			jQuery(".suspend").css({visibility:"visible"});
			return;
		}
		view.resetCamera(params, "editCamera");
		dragToggle();
	});
}
function dragToggle(){
	jQuery(".suspend").fadeToggle(200);
}
function bindDrag(isOCC){
	if(!isOCC)
		jQuery(".cameraOne").draggable(baseDrag);

	jQuery(".fix").droppable().draggable({
		stop: function(event, ui){
			var $this = jQuery(this);
			var thisWidth = Math.floor($this.width()) - view.widthFrame();
			var thisHeight = Math.floor($this.height()) - view.heightFrame();
			if(view.isSmall())
				$this.css({top: Math.min(Math.max(0, ui.position.top), -1 * (thisHeight - 1)) + "px"});
			else
				$this.css({top: Math.min(Math.max(-1 * (thisHeight - 1), ui.position.top), 0) + "px"});
			$this.css({left: Math.min(Math.max(-1 * (thisWidth - 1), ui.position.left), 0) + "px"});
			view.resetCenter(-1 * parseInt($this.css("left")) + view.widthFrame()/2, -1 * parseInt($this.css("top")) + view.heightFrame()/2);
		}
	});
	jQuery(".suspend").draggable({
		containment: "parent"
	});
}

function bindCamera4Drag(){
	var offsetX, offsetY;
	jQuery(".lost").draggable({
		helper: "clone",
		start: function(event, ui){
			offsetX = event.offsetX;
			offsetY = event.offsetY;
			jQuery(".suspend").css({visibility: "hidden"});
			ui.helper.css("visibility", "visible");
		},
		stop: function(event, ui){
			var $this = jQuery(this);
			var $parent = jQuery(this.parentNode);
			var el = jQuery(".fix").get(0).getBoundingClientRect();
			$this.removeClass('lost')
				.addClass('cameraOne')
				.appendTo(".fix")
				.attr({"style": 
					"top:"+Math.min(Math.max(0, event.pageY - el.top - offsetY), el.height-34)+"px; left:"+Math.min(Math.max(0, event.pageX - el.left - offsetX), el.width-34)+"px;"
				});
			$this.draggable("destroy");
			if($parent.find(".lost").length === 1){
				if($parent.parent().find(".lost").length === 1)
					$parent.parent().get(0).innerHTML = '<span class="hint">没有未指定坐标的摄像机！</span>';
				$parent.prev().remove();
				$parent.remove();
			}
			sendData(event, ui, this, "addDeviceOfMap");
			setTimeout(function(){
				jQuery(".fix>:last").draggable(baseDrag);
			}, 0);
			setCount(-1);
		}
	});
}

function showTigger(params){
	deviceCaller("getCamerasNotInMap", params, function(data){
		initCameraCount(data.length || 0);
		var cameraRefreshHTML = getCamera4Map(data, [20,21,22,31,32,33]);
		if(!cameraRefreshHTML)
			cameraRefreshHTML = '<span class="hint">没有未指定坐标的摄像机！</span>';
		var bodyEl = $X("content");
		bodyEl.innerHTML = "<div>"+cameraRefreshHTML+"</div>";
		IX.bind($XD.first(bodyEl, "div"), {
			click : function(e){
				if ($XD.ancestor(e.target, "a")) return;
				var el = $XH.ancestor(e.target, "type");
				jQuery(el).siblings(".type").removeClass("expanded");
				$XH.toggleClass(el, "expanded");
			}
		});
		bindCamera4Drag();
	});
}

function initMap(initData, mapEl){
	mapEl.width = initData.width;
	mapEl.height = initData.height;
	if(!view)
		view = new viewData4Show(initData, mapEl);
	else
		view.refresh(initData);
}

function bindFn(params, mapEl, isOCC){
	if (IX.isFirefox)
		mapEl.addEventListener("DOMMouseScroll", view.scrollIt, false);
	else
		mapEl.onmousewheel = view.scrollIt;
	var $notCameras = jQuery(".notCameras");
	var $suspend = jQuery(".suspend");
	var $content = jQuery("#content");
	$suspend.hover(function(e){
		if(!$XH.hasClass($notCameras.get(0), "showContent")){
			showTigger(params);
			$suspend.animate({opacity: 0.01}, 200, function() {
				$notCameras.addClass("showContent");
				$content.css({display: "block"});
				jQuery(this).animate({opacity: 1}, 200);
			});
		}
	});
	IX.bind(jQuery(".nvgrid-body").get(0), {
		click: function(e){
			if($XH.ancestor(e.target, "suspend")) return;
			if($XH.hasClass($notCameras.get(0), "showContent")){
				$suspend.animate({opacity: 0.01}, 200, function() {
					$notCameras.removeClass("showContent");
					$content.css({display: "none"});
					jQuery(this).animate({opacity: 1}, 200);
				});
			}
		}
	});
	bindDrag(isOCC);
	$Xw.bind({"resize": function(){
		view.resize(isOCC);
	}});
}

function initCameraCount(count){
	jQuery(".notCameras .count").html("("+count+")");
}

function setCount(num){
	var $count = jQuery(".notCameras .count");
	var str = $count .html();
	$count.html("("+(Number(str.slice(1, str.length-1)) + num)+")");
}

function Map(container, params, isOCC){
	function _show(data, clientHeight){
		$X(container).innerHTML = t_mapPage.renderData("", {
			imgURL: "",
			cameras: data.cameras || []
		});
		deviceCaller("getCamerasNotInMap", params, function(result){
			initCameraCount(result.length || 0);
		});
		$X('imgFrame').style.height = clientHeight - 110 + "px";
		var mapEl = $X("image");
		var initData = data;
		var isBind = false;
		mapEl.onload = function(){
			initMap(initData, mapEl);
			jQuery("#mask").remove();
			if(isBind) return;
			bindFn(params, mapEl, isOCC);
			isBind = true;
		};
		mapEl.src = data.url ? TCM.Global.getMapUrl(data.url) : "";
		if(isOCC){
			jQuery(".suspend").css("display", "none");
			jQuery("#updateFile").css("visibility", "hidden");
			jQuery(".showMap").addClass("occ");
			return;
		}
		FileUploadBtn('updateFile', function(result){
			initData = result;
			mapEl.src = TCM.Global.getMapUrl(result.url);
			IXW.Lib.info("地图上传成功！");
		}, TCM.Global.filUploadUrl);
	}
	return {
		show: function(){
			var clientHeight = $X('Grid').clientHeight;
			$X('Tree').style.height = clientHeight + "px";
			deviceCaller("getMap", params, function(data){
				if(!data.url){
					if(isOCC){
						jQuery(".nvgrid-body").html("");
						return nvAlert("该分区暂未上传地图！");
					}else
						nvAlert("地图不存在，请上传地图！");
				}
				_show(data, clientHeight);
			});
		}
	};
}


IX.ns("TCM.Lib");
TCM.Lib.Map = function(container, params, isOCC){
	view = null;
	return new Map(container, params, isOCC);
};
})();
(function () {var t_login = new IX.ITemplate({tpl: [
	'<div class="bg"><img src="{background}"></div>',
	'<div class="container">',
		'<div class="pic_top">',
			'<div class="pic_char"></div>',
		'</div>',
		'<ul>',
			'<li><span class="pic-user"></span><span class="verLine"></span><input type="text" id="account" tabindex="1" placeholder="账号"></li>',
			'<li><span class="pic-pwd"></span><span class="verLine"></span><input type="password" id="password" tabindex="2" placeholder="密码"></li>',
		'</ul>',
		'<a id="submit" tabindex="3" class="btn longbtn" data-href="$login"><span>立即登录</span></a>',
	'</div>',
	'<div class="footer" id="footer"><span class="footer-bar"></span></div>',
'']});

var ixwPages = IXW.Pages;
IXW.Actions.configActions([["login", function(){
	TCM.Global.entryCaller("login", {
		username : $X('account').value,
		password : $X('password').value
	}, function(data){
		TCM.Env.resetSession(data);
		ixwPages.load("");
	});
}]]);

var ImgWidth = 1939, ImgHeight = 1175, ContainerHeight = 300;
function onresize(){
	if (ixwPages.getCurrentName() != "entry")
		return;
	var winWidth = window.innerWidth;
	var winHeight = window.innerHeight;
	var w = document.body.clientWidth;
	var r = Math.max(winWidth/ImgWidth, winHeight/ImgHeight);
	var imgEl = jQuery(".bg img");
	imgEl.css({
		"width" : Math.round(ImgWidth * r) + "px",
		"height" : Math.round(ImgHeight * r) + "px"
	});
	jQuery(".container").css("bottom", Math.max(0, Math.round((winHeight-ContainerHeight)/2))+"px");
	//jQuery("#footer").css("background-position-x",Math.round((w-1940)/2)+"px");
}
$Xw.bind({"resize" :onresize});

IX.ns("TCM.Entry");
TCM.Entry.init = function(pageCfg, pageParams, cbFn){
	if (TCM.Env.hasSession())
		return ixwPages.load("");
	document.body.innerHTML = t_login.renderData("",{
		background:TCM.Global.backgroundUrl
	});
	onresize();
	jQuery("input").bind({
		"focus": function(e){
			$XH.addClass($XD.ancestor(this, "li"), "focus");
		},
		"blur": function(e){
			$XH.removeClass($XD.ancestor(this, "li"), "focus");
		}
	});
	var aEl = $X("submit");
	jQuery('#account').bind("keydown", function(e){
		if ( e.which == 13)
			$X('password').focus();
	});	
	jQuery(".container").keydown(function(event){
		if(event.keyCode == 13){
			aEl.click();
		}
	});

};
})();
(function () {
IX.ns("TCM.ErrPage");
TCM.ErrPage.init = function(pageCfg, pageParams, cbFn){
	document.body.innerHTML = "ERROR";

};
})();
(function () {
var sysCaller = TCM.Global.sysCaller;
var globalActionConfig = IXW.Actions.configActions;

var showDialog = NV.Dialog.show;
var hideDialog = NV.Dialog.hide;
var confirmDialog = NV.Dialog.confirm;
var nvAlert = NV.Dialog.alert;
var ixwInfo = IXW.Lib.info;
var ixwPages = IXW.Pages;

var getCheckboxHTML = NV.Lib.getCheckboxHTML;
var getComboHTML = NV.Lib.getComboHTML;
var getSiteTypeComboHTML = TCM.Lib.getSiteTypeComboHTML;
var getRoleComboHTML = TCM.Lib.getRoleComboHTML;
var cameraTree = TCM.Lib.CameraTree;


var t_deleteMsg = new IX.ITemplate({tpl: [
	'确认要删除这{count}吗？<br>',
'']});

function _deleteUnits(rowModels, cfg, okFn){
	var n =  rowModels.length, names = [];
	var ids = IX.map(rowModels, function(r){
		names.push(r.get("name"));
		return r.getId();
	});
	confirmDialog(cfg.title, t_deleteMsg.renderData("",{
		count : n + cfg.unitName
	}),  function(cbFn){
		sysCaller(cfg.callerName, {ids : ids}, function(){
			cbFn();
			okFn();
		});
	});
}
function checkChinese(s){
	var re = /[^\u4E00-\u9FA5]+/g; 
	return re.test(s);
}
function verifyForm(value, msg, name){
	if(name == "no"){
		var _value = checkIfInt(value);
		if (!_value){
			nvAlert("请输入有效的数字编号！");
			return false;
		}
	}
	if(name == "password" && value !== ""){
		var value1 = checkChinese(value);
		if (!value1){
			nvAlert("密码不允许出现汉字！");
			return false;
		}
	}
	return true;
}
function checkIfInt(s){
	var re = /^\d+$/;
	return re.test(s);
}
function checkSiteName(siteName){
	var reg = /^([A-Z]|[0-9]|[\u4E00-\u9FA5])*$/;
	var flag = reg.test(siteName);
	if(flag){
		return true;
	}else{
		nvAlert("站点名只允许为大写英文，数字和汉字的混合!");
		return false;
	}
}
function gatherInfo(rowModel, checkers){
	var data = {}, ifChanged = false,typeChange = false;
	for (var i=0; i<checkers.length; i++){
		var checker = checkers[i];
		var val = $X(checker.key).value;
		if(val == "null"){
			nvAlert(checker.empty);
			return false;
		}
		if (checker.type  == "bool")
			val = val == "true";
		if (IX.isEmpty(val) && !IX.isEmpty(checker.empty)) {
			nvAlert(checker.empty);
			return false;
		}
		if (!verifyForm(val, checker.empty,checker.name))
			return false;
		ifChanged = ifChanged || !(rowModel && rowModel.get(checker.name) == val);
		if(rowModel && rowModel.get(checker.name) != val && checker.key=="site_type" && jQuery(".sys-editSite").length > 0){
			typeChange=true;
		}
		IX.setProperty(data, checker.name, val);
	}
	if (!ifChanged){
		ixwInfo("您未作任何修改，请点击取消关闭编辑窗口！");
		return false;
	}
	if (rowModel) 
		data.id = rowModel.getId();
	data.typeChange=typeChange;
	return data ;
}
function _editUnit(rowModel, cfg, okFn){
	var checkers = cfg.checkers;
	function _okFn(){
		var info = gatherInfo(rowModel, checkers);
		if(cfg.clz == "sys-editSite" && info.name){
			var result = checkSiteName(info.name);
			if(!result)
				{return false;}
		}
		var checkFn = $XP(cfg, "checkInfo");
		if (!info || (IX.isFn(checkFn) && !checkFn(info))) return;
		sysCaller(cfg.callerName, info, function(data){
			if(rowModel && rowModel.getId() == TCM.Env.getSession().getCurrentSiteId() && jQuery(".sys-editSite").length > 0){
				jQuery(".nowSite").children(".name").html(info.name);
			}
			hideDialog();
			var id = "id" in info ? info.id : data.id;
			okFn({ids : [id]});
			if(info.typeChange){
				TCM.Env.reloadSession();
			}
		});
	}
	var data = {};
	for (var i=0; i<checkers.length; i++){
		var checker = checkers[i];
		var type=checker.type;
		var value =  rowModel ? (rowModel.get(checker.name) || rowModel.get(checker.name)===0 ? rowModel.get(checker.name) : "") : "";
		data[checker.key] = type=="bool"? value : (value+"").dehtml();
	}
	showDialog({
		clz : cfg.clz,
		title : cfg.title,
		content : cfg.tpl.renderData("", cfg.tpldataFn(rowModel, data)),
		listen : {ok : _okFn}
	});
}

IX.ns("TCM.SysDialog");

var t_editSite = new IX.ITemplate({tpl: [
'<ul>',
	'<li><span class="label">编号</span>',
		'<span><input id="site_no" maxlength="8" value="{site_no}"></span></li>',
	'<li><span class="label">名称</span>',
		'<span><input id="site_name" maxlength="32" value="{site_name}"></span></li>',
	'<li><span class="label">类型</span>{siteId}{siteTypeCombo}</li>',
	'<li><span class="label">说明</span>',
		'<span><input id="site_desc" maxlength="150" value="{site_desc}"></span></li>',
'</ul>',
'']});
var t_setSite = new IX.ITemplate({tpl: [
	'<ul>',
		'<li><span class="warn">只能修改一次，请慎重！(修改后需重新登录)</span></li>',
		'<li id="site-set"><span>当前单位</span>{siteCombo}</li>',
	'</ul>',
'']});

var SiteDialogCfg = {
	clz : "sys-editSite",
	tpl : t_editSite,
	tpldataFn : function(rowModel, data){
		data.siteTypeCombo = getSiteTypeComboHTML("site_type", data.site_type);
		data.siteId = '<input id="site_id" type="hidden" value="' + data.site_id + '">';
		return data;
	},
	checkers : [
		{name : "no", key : "site_no", empty: "请输入单位编号！"}, 
		{name : "name", key: "site_name", empty : "请输入单位名称！"},
		{name : "desc", key: "site_desc", empty : ""},
		{name : "type", key: "site_type", empty : ""},
		{name : "id", key: "site_id", empty : ""}
	]
};
TCM.SysDialog.editSite = function(rowModel, okFn){
	_editUnit(rowModel, IX.inherit(SiteDialogCfg, {
		title : "编辑单位",
		callerName : "editSite"
	}), okFn);
};
TCM.SysDialog.createSite = function(okFn){
	_editUnit(null, IX.inherit(SiteDialogCfg, {
		title : "新建单位",
		callerName : "createSite"
	}), okFn);
};
TCM.SysDialog.deleteSites = function(rowModels, okFn){
	_deleteUnits(rowModels, {
		title : "删除单位", 
		unitName : "个单位",
		callerName : "deleteSites"
	}, okFn);
};
TCM.SysDialog.setCurrentSite = function(params,el,data){
	function _okFn(){
		var curSiteId = $X('setSite').value - 0;
		if(curSiteId){
			sysCaller("setCurrentSite", {id : curSiteId}, function(){
				hideDialog();
				TCM.Global.entryCaller("logout", {}, function(){	
					TCM.Env.clearSession();
				});	
			});
		}else{
			nvAlert("设置当前站点失败，不能为空！");
		}
	}
	showDialog({
		clz : "",
		title : "设置",
		content :t_setSite.renderData("",{
			siteCombo: getComboHTML("setSite", {
				value : "",
				valueText : "",
				items : IX.map(data, function(site){
					return {
						id: site.id, 
						name: site.name
					};
				})
			})
		}),
		listen : {ok : _okFn}
	});
};

var t_editRole = new IX.ITemplate({tpl: [
'<ul>',
	'<li><span class="label">角色名称</span>',
		'<span><input id="role_name" maxlength="32" value="{role_name}"></span></li>',
	'<li><span class="label">所属单位类型</span>{siteTypeCombo}</li>',
	'<li>{rolePromptableCheckBox}</li>',
'</ul>',
'']});

var RoleDialogCfg = {
	clz : "sys-editRole",
	tpl : t_editRole,
	tpldataFn : function(rowModel, data){
		data.siteTypeCombo = getSiteTypeComboHTML("site_type", data.site_type);
		data.rolePromptableCheckBox = getCheckboxHTML(
			"role_promptable", 
			!!data.role_promptable,
			"特殊情况下允许启动临时授权"
		);
		return data;
	},
	checkers : [
		{name : "name", key: "role_name", empty : "请输入角色名称！"},
		{name : "siteType", key: "site_type", empty : "请确定角色适用的人员所在单位！"},
		{name : "promptable", key: "role_promptable", type : "bool", empty : ""}
	]
};
TCM.SysDialog.editRole = function(rowModel, okFn){
	_editUnit(rowModel, IX.inherit(RoleDialogCfg, {
		title : "编辑用户角色",
		callerName : "editRole"
	}), okFn);
};
TCM.SysDialog.createRole = function(okFn){
	_editUnit(null, IX.inherit(RoleDialogCfg, {
		title : "新建用户角色",
		callerName : "createRole"
	}), okFn);
};
TCM.SysDialog.deleteRoles = function(rowModels, okFn){
	_deleteUnits(rowModels, {
		title : "删除角色", 
		unitName : "个角色",
		callerName : "deleteRoles"
	}, okFn);
};

var t_editLevel = new IX.ITemplate({tpl: [
'<ul>',
	'<li><span class="label">类别</span><span class="level">{level}</span></li>',
	'<li><span class="label">对应角色（车站)</span>{stationRoleCombo}</li>',
	'<li>{stationPromptedCheckbox}</li>',
	'<li><span class="label">对应角色（车辆段）</span>{depotRoleCombo}</li>',
	'<li>{depotPromptedCheckbox}</li>',
'</ul>',
'']});

var LevelDialogCfg = {
	clz : "sys-editLevel",
	tpl : t_editLevel,
	tpldataFn : function(rowModel, data){
		data.level = rowModel.get("name");
		data.stationRoleCombo = getRoleComboHTML("station_role", data.station_role, true);
		data.stationPromptedCheckbox = getCheckboxHTML(
			"station_prompted", 
			!!data.station_prompted,
			"需要启动临时授权"
		);
		data.depotRoleCombo = getRoleComboHTML("depot_role", data.depot_role, true);
		data.depotPromptedCheckbox = getCheckboxHTML(
			"depot_prompted", 
			!!data.depot_prompted,
			"需要启动临时授权"
		);
		return data;
	},
	checkers : [
		{name : "station.id", key: "station_role", empty : "请选择车站对应的角色！"},
		{name : "station.prompted", key: "station_prompted", type : "bool", empty : ""},
		{name : "depot.id", key: "depot_role", empty : "请选择车辆段对应的角色！"},
		{name : "depot.prompted", key: "depot_prompted", type : "bool", empty : ""}
	]
};
TCM.SysDialog.editLevel = function(rowModel, okFn){
	_editUnit(rowModel, IX.inherit(LevelDialogCfg, {
		title : "编辑用户优先级",
		callerName : "editUserLevel"
	}), okFn);
};

var t_editUser = new IX.ITemplate({tpl: [
'<ul class="{clz}">',
	'<li><span class="label">所属单位</span>',
		'<input type="hidden" id="user_site" value="{user_site}"><span>{siteName}</span></li>',
	'<li><span class="label">分类</span>{userTypeCombo}</li>',
	'<li><span class="label">用户名</span>',
		'<span><input id="user_name" maxlength="32" value="{user_name}"></span></li>',
	'<li><span class="label">登录账号</span>',
		'<span><input id="user_account" maxlength="32" value="{user_account}"></span></li>',
	'<li class="pwd"><span class="label">登录密码</span>',
		'<span><input maxlength="16" id="user_pwd"></span></li>',
	'<li class="role"><span class="label">用户角色</span>{roleCombo}</li>',
	'<li><span class="label">说明</span>',
		'<span><input id="user_desc" maxlength="150" value="{user_desc}"></span></li>',
'</ul>',
'']});

globalActionConfig([["sys.changeUserType", function(params, el){
	var type = params.key, name = el.innerHTML;
	var dropdownEl = $XH.ancestor(el, "dropdown");
	if (!dropdownEl) return;
	var inputEl = $XD.first(dropdownEl, "input");
	inputEl.value = type;
	var nameEl = $XH.first($XH.first(dropdownEl, "dropdown-toggle"), "name");
	nameEl.innerHTML = name;
	var ulEl = $XD.ancestor(dropdownEl, "ul");
	ulEl.className = type == 1 ? "isAdmin" : "isUser";
}],["sys.changeSiteType", function(params, el){
	var type = params.key, name = el.innerHTML;
	var flag = jQuery(".sys-editSite").length > 0 && jQuery(".head").text()=="编辑单位" && jQuery(".sys-editSite .dropdown").find("input").attr("value") != type;
	if(flag){
		sysCaller("hasData", {
			id : $X("site_id").value,
			toType : type
		}, function(data){
			if (data.msg)
				return nvAlert(data.msg);
			baseChageCombo(type, name, el);
		});
	}else{
		baseChageCombo(type, name, el);
	}
}]]);
function baseChageCombo(type, name, el){
	var dropdownEl = $XH.ancestor(el, "dropdown");
	if (!dropdownEl) return;
	var inputEl = $XD.first(dropdownEl, "input");
	inputEl.value = type;
	var nameEl = $XH.first($XH.first(dropdownEl, "dropdown-toggle"), "name");
	nameEl.innerHTML = name;
}
var UserTypeNames = TCM.Const.UserTypeNames;
var userTypeComboTpldata = IX.map(UserTypeNames, function(name, idx){
	return {id : idx, name : name, action : "sys.changeUserType"};
});
userTypeComboTpldata.shift();
function getUserTypeComboHTML(id, userType){
	var _type = IX.isEmpty(userType)? 2 : userType;
	return getComboHTML(id, {
		value : _type, 
		valueText : UserTypeNames[_type],
		items : userTypeComboTpldata
	});
}

function getRootUserComboHTML(id, userType){
	var _type = IX.isEmpty(userType)? 1 : userType;
	var arr = [];
	arr.push(userTypeComboTpldata[0]);
	return getComboHTML(id, {
		value : _type, 
		valueText : UserTypeNames[_type],
		items : arr
	});
}

var UserDialogCfg = {
	clz : "sys-editUser",
	tpl : t_editUser,
	tpldataFn : function(rowModel, data){
		var isSuper = TCM.Env.getSession().isSuper();
		data.user_desc = data.user_desc || "";
		data.user_site = data.user_site || TCM.Env.getSession().getCurrentSiteId();
		data.siteName = TCM.LineInfo.getSiteName(data.user_site);
		data.userTypeCombo = isSuper ? getRootUserComboHTML("user_type", data.user_type) : getUserTypeComboHTML("user_type", data.user_type);
		data.clz = isSuper?"isAdmin":(data.user_type == 1 ? "isAdmin" : "isUser");
		data.roleCombo = getRoleComboHTML("user_role",  data.user_role, false);
		return data;
	},
	checkers : [
		{name : "siteId", key : "user_site", empty : ""},
		{name : "type", key: "user_type", empty : ""},
		{name : "name", key: "user_name", empty : "请输入用户名称！"},
		{name : "account", key: "user_account", empty : "请确定用户登录账号！"},
		{name : "role", key: "user_role", empty : ""},
		{name : "password", key: "user_pwd", empty : ""},
		{name : "desc", key: "user_desc", empty : ""}
	]
};
TCM.SysDialog.editUser = function(rowModel, okFn){
	_editUnit(rowModel, IX.inherit(UserDialogCfg, {
		checkInfo : function(info){
			if (info.type==2 && info.role===""){
				nvAlert("普通用户必须赋予角色以便确定操作权限！");
				return false;
			}
			if(info.account==TCM.Env.getSession().getAccount()){
				TCM.Env.getSession().setUserName(info.name);
			}
			return true;
		},
		title : "编辑用户",
		callerName : "editUser"
	}), okFn);
};
TCM.SysDialog.createUser= function(okFn){
	_editUnit(null, IX.inherit(UserDialogCfg, {
		checkInfo : function(info){
			if (info.type==2 && info.role===""){
				nvAlert("普通用户必须赋予角色以便确定操作权限！");
				return false;
			}
			if (IX.isEmpty(info.password)){
				nvAlert("请输入用户的初始密码！");
				return false;
			}
			return true;
		},
		clz : "sys-editUser sys-createUser",
		title : "新建用户",
		callerName : "addUser"
	}), okFn);
};
TCM.SysDialog.deleteUsers = function(rowModels, okFn){
	_deleteUnits(rowModels, {
		title : "删除用户", 
		unitName : "个用户",
		callerName : "deleteUsers"
	}, okFn);
};

var t_chgpwd = new IX.ITemplate({tpl: [
'<ul>',
	'<li><span class="label">新密码</span><span><input id="user_pwd" value=""></span></li>',
'</ul>',
'']});

var t_chgpriv = new IX.ITemplate({tpl: [
	'<div class="cameras">',
		'<h6>允许查看实时视频</h6>',
		'<div id="vsvTree" class="camera-tree vsv">{cameraTree4VSV}</div>',
		'<h6>允许云台控制</h6>',
		'<div id="ptzcTree" class="camera-tree ptzc">{cameraTree4PTZC}</div>',
	'</div>',
	'<div class="vra">{vraCheckbox}</div>',
'']});

TCM.SysDialog.chgpwd = function(rowModel){
	var userName = rowModel.get("name");
	var userType = rowModel.get("type");

	function _okFn(){
		var newPwd = jQuery.trim($X('user_pwd').value);
		if (IX.isEmpty(newPwd)) 
			return nvAlert("用户密码不能设置为空！");
		if(!verifyForm(newPwd,"","password"))
			return;
		sysCaller("resetPwd", {id : rowModel.getId(), password: newPwd}, function(){
			ixwInfo("密码修改成功！");
			hideDialog();
		});
	}
	showDialog({
		clz : "sys-chgpwd",
		title : "修改" + TCM.Const.UserTypeNames[userType] + '"' + userName + '"的登录密码',
		content :t_chgpwd.renderData(""),
		listen : {ok : _okFn}
	});
};
TCM.SysDialog.chgpriv = function(rowModel){
	var siteHT = TCM.LineInfo.getSites();
	var id = rowModel.getId();
	var userName = rowModel.get("name");
	var access = rowModel.get("access");
	var hasAcc=true;
	function _okFn(){
		sysCaller("resetPriv", {
			id : id, 
			access : JSON.stringify({
				vsv : cameraTree.getCameraAccess($X("vsvTree")),
				ptzc : cameraTree.getCameraAccess($X("ptzcTree")),
				vra : $X("priv_vra").value == "true"
			})
		}, function(){
			ixwInfo("修改权限成功！");
			hideDialog();
		});
	}
	function toggleFn(e){
		if ($XD.ancestor(e.target, "a")) return;
		var el = $XH.ancestor(e.target, "leaf");
		if (el) {
			if($XH.hasClass(el, "site") && !el.nextSibling)
				return NV.Dialog.alert("该站点下无分区或分区下无相应摄像机，不能展开！");
			$XH.toggleClass(el, "expanded");
			$XH.toggleClass($XH.first(el, "nv-collapse"), "expanded");
		}
	}
	sysCaller("getAllCameras", {}, function(cameras){
		sysCaller("getUserPriv", {id:id}, function(access){
			showDialog({
				clz : "sys-chgpriv",
				title : '用户管理/权限配置',
				content :t_chgpriv.renderData("", {
					cameraTree4VSV : cameraTree.getCameraTreeHTML(cameras, $XP(access, "vsv", []), siteHT, false),
					cameraTree4PTZC : cameraTree.getCameraTreeHTML(cameras, $XP(access, "ptzc",  []), siteHT, true),
					vraCheckbox :getCheckboxHTML( "priv_vra", $XP(access, "vra"), "允许录像文件检索与回放")
				}),
				listen : {ok : _okFn}
			});
			IX.bind(jQuery(".cameras").get(0), {
				click : toggleFn
			});
			if(access && access.vsv == "all"){
				jQuery("#vsvTree").find(".nv-checkbox").each(function(){
					jQuery(this).addClass('selected');
				});
			}
			if(access && access.ptzc == "all"){
				jQuery("#ptzcTree").find(".nv-checkbox").each(function(){
					jQuery(this).addClass('selected');
				});
			}
		});
	});
};
})();
(function () {
var sysCaller = TCM.Global.sysCaller;
var globalActionConfig = IXW.Actions.configActions;
var lineInfo = TCM.LineInfo;
var TCMGrid =  TCM.Lib.Grid;
var sysDialog = TCM.SysDialog;
var nvAlert = NV.Dialog.alert;
var ixwInfo = IXW.Lib.info;
var session = null;
var siteType = null;
var isOCC = null;
/** cfg :{
	container : "body"
	title : 
	clz :
	hasCheckbox: need "_checkbox"	
	usePagination : false,
	columns: []
	actions :[]
	buttons : []
	listeners : {}
	dataLoader : function(params,_cbFn)
}
*/
function createSysGrid(cfg, checkEditable){
	var editable = !checkEditable || TCM.Env.canUpdateLineInfo();
	var columns = (editable && cfg.hasCheckbox ?["_checkbox"]:[]).concat(cfg.columns.split(","));
	var buttons = editable ? ["refresh"].concat($XP(cfg,"buttons", [])):["refresh"];
	return new TCMGrid($XP(cfg, "container", 'body'), {
		title : $XP(cfg, "title", ""),
		rowModel : $XP(cfg, "rowModel"),
		grid : {
			clz : $XP(cfg, "clz", ""),
			columns : columns,
			actions : editable ? $XP(cfg, "actions", []) :[],
			usePagination : cfg.usePagination || false,
			dataLoader : $XF(cfg, "dataLoader")
		},
		tools : {buttons : buttons},
		listen : cfg.listeners || {}
	});
}

function afterLoadLineInfo(data){
	lineInfo.setName(data.name);
	var sitesHT = lineInfo.getSites();
	var sites = data.sites;
	sitesHT.refresh(sites);

	refreshSysLineInfo(sites);
	return sites;
}

var GridCfgs = {
	line : {
		container : "sysline-grid", 
		title : "线路和车站管理",
		clz : "sys-line",
		hasCheckbox: true,
		columns: "siteNo,name,siteType,desc",
		buttons : ["create","delete"],
		dataLoader : function(params, _cbFn){
			sysCaller("getLineInfo", {}, function(data){
				var sites = afterLoadLineInfo(data);
				_cbFn({total: sites.length, items: sites});
			});
		}
	},
	role : {
		title : "角色管理",
		clz : "sys-role",
		hasCheckbox: true,
		columns: "roleName,roleType,rolePromptable",
		buttons : ["create","delete"],
		dataLoader : 	function(params, _cbFn){
			sysCaller("getUserRole", {}, function(data){
				var roleHT = lineInfo.getRoles();
				roleHT.refresh(data.items);
				_cbFn(data);
			});
		}
	},
	level : {
		title : "用户优先级定义",
		clz : "sys-level",
		columns: "levelName,station,depot",
		buttons : [],
		dataLoader : function(params, _cbFn){
			sysCaller("getUserLevel", {}, function(data){
				var levelHT = lineInfo.getLevels();
				levelHT.refresh(data.items);
				_cbFn(data);
			});
		}
	},
	user : {
		title : "用户管理",
		clz : "sys-user",
		hasCheckbox: true,
		usePagination : true,
		columns: "userName,account,utype,userSite,userRole,desc",
		buttons : ["create", "delete"],
		dataLoader : function(params, _cbFn){
			sysCaller("getUsers", params, function(data){
				_cbFn(data);
				jQuery("ul[data-id="+TCM.Env.getSession().getUserId()+"]").find("a.act-delete").hide();
			});
		}
	}
};

var t_syslineInfo = new IX.ITemplate({tpl: [
	'<div class="l icon">',
		'<div class="pic-"></div><div>线路信息</div>',
	'</div>',
	'<div class="l text">',
		'<div>',
			'<span class="label">线路名称：</span>',
			'<input id="lineName" disabled="true" value="{value}">',
		'</div>',
		'<div>',
			'<span class="label">当前单位：</span>',
			'<input class="siteName" disabled="true" value="{currentSiteName}">',
			'<a class="setSite" data-href="$sys.setCurrentSite"></a>',
		'</div>	',
	'</div>',
'']});
var t_sysline = new IX.ITemplate({tpl: [
	'<div class="sys-info"></div>',
	'<div id="sysline-grid"></div>',
'']});

var curLineName = null;
var curSiteId = null;
function getCurrentSiteName(){
	return IX.encodeTXT(lineInfo.getSiteName(curSiteId));
}
function refreshSysLineInfo(sites){
	var infoEl = $XH.first($X('body'), 'sys-info');
	if (!infoEl)
		return;
	infoEl.innerHTML = t_syslineInfo.renderData("", {
		value : IX.encodeTXT(curLineName),
		currentSiteName : getCurrentSiteName()
	});
	if(getCurrentSiteName()){
		jQuery(".setSite").css("display","none");
	}
}

globalActionConfig([["sys.setCurrentSite", function(params, el){
	var data=TCM.LineInfo.getSites().getAll();
	TCM.SysDialog.setCurrentSite(params,el,data);
}]]);
function showSysLine(cbFn){
	var grid = null;
	curLineName = lineInfo.getName();
	curSiteId = session.getCurrentSiteId();
	$X('body').innerHTML = t_sysline.renderData("");
	grid = createSysGrid(IX.inherit(GridCfgs.line, {
		actions : [ "delete",["edit", "编辑", function(rowModel, rowEl){
			sysDialog.editSite(rowModel, function(){
				grid.refresh();
			});
		}]],
		listeners : {
			createItem : sysDialog.createSite,
			deleteItems : sysDialog.deleteSites
		}
	}), true);
	cbFn();
}

function showSysRole(cbFn){
	var grid = null;
	grid = createSysGrid(IX.inherit(GridCfgs.role, {
		actions : ["delete", ["edit", "编辑", function(rowModel, rowEl){
			sysDialog.editRole(rowModel, function(){
				grid.refresh();
			});
		}]],
		listeners : {
			createItem : sysDialog.createRole,
			deleteItems : sysDialog.deleteRoles
		}
	}), true);
	cbFn();
}

function showSysLevel(cbFn){
	var grid = null; 
	grid = createSysGrid(IX.inherit(GridCfgs.level, {
		actions : [["edit", "编辑", function(rowModel, rowEl){
			sysDialog.editLevel(rowModel, function(){
				grid.refresh();
			});
		}]]
	}), true);
	cbFn();
}

function UserRowModel(rowData, colModels, actions, moreActions){
	var row = new IXW.Lib.GridModel.RowModelBase(rowData, colModels, actions, moreActions);
	return IX.inherit(row, {
		getTpldata : function(){
			var tpldata = row.getTpldata();
			tpldata.clz = row.get("type") == 2 ? "isUser" : "";
			return tpldata;
		}
	});
}
function showUsers(cbFn){
	var grid = null;
    var SiteId = session.getCurrentSiteId();
        if(SiteId === -1){
        	nvAlert("未设置当前站点，不能添加用户！");
        	return ;
        }
	function editFn(rowModel, rowEl){
		sysDialog.editUser(rowModel, function(){
			grid.refresh();
		});
	}
	grid = createSysGrid(IX.inherit(GridCfgs.user, {
		rowModel :  UserRowModel,
		actions : ["delete", ["edit", "编辑", editFn],
			["chgpriv", "修改权限", sysDialog.chgpriv],
			["chgpwd", "修改密码", sysDialog.chgpwd]
		],
		listeners : {
			createItem : sysDialog.createUser,
			deleteItems : sysDialog.deleteUsers
		}
	}), false);
	cbFn();
}


var t_config = new IX.ITemplate({tpl: [
'<div class="nv-box sys-config">',
	'<div class="nv-title">系统配置</div>',
	'<div class="nv-body">',
		'<div class="area">',
			'<h3>数据配置同步设置</h3>',
			'<div class="item"> ',
				'<a data-href="$sys.syncData" class="btn-syncData"></a>',
			'</div>',
			'<div class="item"> ',
				'<a data-href="$sys.check" data-key="Sync" class="nv-checkbox {syncClz}">',
					'<span class="ixpic-"></span><span>{syncTxt}</span>',
				'</a>',
			'</div>',
		'</div>',
		'<div class="{cursor}">',
			'<div class="area">',
				'<h3>控制释放延时设置</h3>',
				'<div class="item"> ',
					'<span>控制释放延时：</span>',
					'<span><input maxlength="6" id="control-time" value="{controlTime}" {controlTimeAttr}/></span>',
					'<span>毫秒</span>',
				'</div> ',
			'</div>',
			'<div class="area">',
				'<h3>系统校时设置</h3>',
				'<div class="item sum">',
					'<h6>校时方式选择</h6>',
					'<div>',
						'<a data-href="$sys.checkRS422" class="nv-radio rs422 {rs422Clz}">',
							'<span class="ixpic- {radioSite}"></span><span>启用RS－422方式</span>',
						'</a>',
					'</div>',
					'<div>',
						'<a data-href="$sys.checkNTP" class="nv-radio ntp {ntpClz}">',
							'<span class="ixpic- {radioSite}"></span><span>启用NTP服务器</span>',
						'</a>',
						'<span><input id="ntp-ip" value="{ntpIP}" {hostAttr}/></span>',
						'<span>端口</span>',
						'<span><input id="ntp-port" value="{ntpPort}" {portAttr}/></span>',
					'</div>',
				'</div>',
				'<div class="line"></div>',
				'<div class="item {dispayView}"> ',
					'<a data-href="$sys.syncTiming" class="btn-syncTiming"></a>',
					'<span class="syncTiming-mask hide"></span>',
				'</div>',
				'<div class="item">',
					'<a data-href="$sys.checkTiming" class="nv-checkbox {timingClz}">',
						'<span class="checkTime ixpic- {checkSite}"></span><span>启用自动校时</span>',
					'</a>',
					'<span class="schedule-time"><b>每天</b>',
					'<input id="schedule-time" value="{scheduleTime}" {scheduleAttr}/></span>',
					'<span>时进行同步</span>',
				'</div>',
			'</div>',
			'<div class="area">',
				'<h3>服务器备份设置</h3>',
				'<div class="item"> ',
					'<a class="nv-checkbox {tvsClz}">',
						'<span class="ixpic- {dispayInView}"></span><span>启用视频服务器异地备份功能</span>',
					'</a>',
					'<a data-href="$sys.check" data-key="ServerBackupSetting.backupTVS" class="button {dispayView} {tvsClz}"></a>',
				'</div>',
				'<div class="item">',
					'<a class="nv-checkbox {ssClz}">',
						'<span class="ixpic- {dispayInView}"></span><span>启用存储服务器异地备份功能</span>',
					'</a>',
					'<a data-href="$sys.check" data-key="ServerBackupSetting.backupSS" class="button {dispayView} {ssClz}"></a>',
				'</div>',
			'</div>',
			'<div class="area">',
				'<h3>存储备份设置</h3>',
				'<div class="item"> ',
					'<a class="nv-checkbox {storageClz}">',
						'<span class="ixpic- {dispayInView}"></span><span>启用存储异地备份功能</span>',
					'</a>',
					'<a data-href="$sys.check" data-key="StorageBackupSetting" class="button storage {dispayView} {storageClz}"></a>',
				'</div>	',
			'</div>',
		'</div>	',
	'</div>',
'</div>		',
'']});

var sysConfigData = {};

function uploadConfigData(){
	sysCaller("setConfig", sysConfigData, function(){
		ixwInfo("配置修改已生效！");
	});
}
function uploadTimingSettingData(){
	sysCaller("timingSetting", sysConfigData, function(){
		ixwInfo("配置修改已生效！");
	});
}
var SyncDataText = {
	1 : "修改控制中心配置数据时，立即向控制中心TVS和下属各车站／车辆段发送配置数据",
	2 : "修改本车辆段配置数据时，立即向控制中心和本车辆段TVS发送配置数据",
	3 : "修改本车站配置数据时，立即向控制中心和本车站TVS发送配置数据"
};
function getCheckedClz(name,part){
	//return $XP(sysConfigData, name, false)? "selected" : "";
	var aaa=JSON.parse($XP(sysConfigData, name));
	return $XP(aaa, part, false)? "selected" : "";
}
function getState(name){
	var flag=$XP(sysConfigData, name);
	if (flag === "true" || flag === true)
		return "selected";
	return "";
}
function getCheckedCl(name){
	return ("false"!=$XP(sysConfigData, name))?"selected" : "";
}
function getTpldata4Config(){
	siteType = TCM.Env.getSession().getCurrentSiteType();
	isOCC = (siteType == 1 || siteType == 4) ? true : false;
	var enableTiming = getCheckedClz("TimingSetting","autoTiming");
	var enableNTP = getCheckedClz("TimingSetting","useNTP");
	return {
		syncClz : getCheckedCl("Sync"),
		syncTxt : SyncDataText[session.getCurrentSiteType()],
		controlTime : $XP(sysConfigData, "ControlReleaseTime", 3000),
		timingClz : enableTiming,
		scheduleAttr : enableTiming? "": "disabled",
		scheduleTime : JSON.parse($XP(sysConfigData,"TimingSetting")).schedule||"01:00:00",
		rs422Clz : getCheckedClz("TimingSetting","useRS422"),
		ntpClz : getCheckedClz("TimingSetting","useNTP"),
		ntpIP :  JSON.parse($XP(sysConfigData, "TimingSetting")).ntpIP,
		hostAttr : enableNTP? "": "disabled",
		ntpPort :  JSON.parse($XP(sysConfigData,"TimingSetting")).ntpPort,
		portAttr : enableNTP? "": "disabled",
		tvsClz : getCheckedClz("ServerBackupSetting","backupTVS"),
		ssClz : getCheckedClz("ServerBackupSetting","backupSS"),
		storageClz : getCheckedCl("StorageBackupSetting"),
		dispayInView : isOCC ? "displayNone" : "displayBlock",
		dispayView : isOCC ? "" : "displayNone",
		radioSite : isOCC ? "" : "radioSite",
		controlTimeAttr : isOCC ? "" : "disabled",
		cursor : isOCC ? "" : "cursor",
		checkSite : isOCC ? "" : "checkSite"
	};
}

globalActionConfig([["sys.check", function(params, el){
	if(!isOCC && params.key != "Sync") return;
	var ifSelected = !$XH.hasClass(el, "selected");
	function _okFn(){
		if(params.key=="ServerBackupSetting.backupSS"||params.key=="ServerBackupSetting.backupTVS"){
			var bbb=JSON.parse($XP(sysConfigData, "ServerBackupSetting"));
			if(params.key=="ServerBackupSetting.backupSS")
				bbb.backupSS=ifSelected;
			if(params.key=="ServerBackupSetting.backupTVS")
				bbb.backupTVS=ifSelected;
			sysConfigData.ServerBackupSetting=JSON.stringify(bbb);

		}else{
			IX.setProperty(sysConfigData, params.key, ifSelected);
		}
		$XH[ifSelected ? "addClass": "removeClass"](el, "selected");
		uploadConfigData();
		NV.Dialog.hide();
	}
	if(!ifSelected && params.key != "Sync")
		return NV.Dialog.confirm("备份设置", "停止异地备份功能可能导致紧急情况下备份数据丢失，请慎重！", _okFn);
	_okFn();
}], ["sys.syncData", function(params, el){
	sysCaller("syncData", {}, function(){
		ixwInfo("服务器已向TVS以及其它服务器发送相关配置数据！");
	});
}], ["sys.syncTiming", function(params, el){
	if(!isOCC) return;
	sysCaller("syncTiming", {}, function(){
		ixwInfo("服务器已向TVS发出立即同步时钟命令！");
	});
}], ["sys.checkTiming", function(params, el){
	if(!isOCC) return;
	var ifSelected = !$XH.hasClass(el, "selected");
	var useRS422 = $XH.hasClass(jQuery(".rs422").get(0), "selected");
	var useNTP = $XH.hasClass(jQuery(".ntp").get(0), "selected");
	var schedule = jQuery("#schedule-time").attr("value");
	var ntpIP = jQuery("#ntp-ip").attr("value");
	var ntpPort = jQuery("#ntp-port").attr("value");
	$XH[ifSelected ? "addClass": "removeClass"](el, "selected");
	sysConfigData.TimingSetting =JSON.stringify({
		"schedule" : "01:00:00",
		"useRS422" : useRS422,
		"useNTP" : useNTP,
		"ntpIP" : ntpIP,
		"ntpPort" : ntpPort,
		"autoTiming" : ifSelected ? true : false
	});
	if (ifSelected)
		jQuery("#schedule-time").attr("disabled",false);
	else
		jQuery("#schedule-time").attr("disabled",true);
	uploadTimingSettingData();
}], ["sys.checkRS422", function(params, el){
	var ccc=JSON.parse($XP(sysConfigData, "TimingSetting"));
	if(!isOCC) return;
	var areaEl = $XH.ancestor(el, "area");
	if ($XH.hasClass(el, "selected"))
		return;
	jQuery(areaEl).find(".rs422").addClass("selected");
	jQuery(areaEl).find(".ntp").removeClass("selected");
	jQuery(".sum").find("input").attr("disabled", true);
	ccc.useRS422 = true;
	ccc.useNTP = false;
	sysConfigData.TimingSetting=JSON.stringify(ccc);
	uploadTimingSettingData();
}], ["sys.checkNTP", function(params, el){
	var ddd=JSON.parse($XP(sysConfigData, "TimingSetting"));
	if(!isOCC) return;
	var areaEl = $XH.ancestor(el, "area");
	if ($XH.hasClass(el, "selected"))
		return;
	jQuery(areaEl).find(".rs422").removeClass("selected");
	jQuery(areaEl).find(".ntp").addClass("selected");
	jQuery(".sum").find("input").removeAttr("disabled");
	ddd.useRS422 = false;
	ddd.useNTP = true;
	sysConfigData.TimingSetting=JSON.stringify(ddd);
	uploadTimingSettingData();
}]]);

function checkIfRange(s, min, max, ifFormat){
	if (isNaN(s)) return false;
	var k = s - 0;
	if (k<min || k>max) return false;
	if (ifFormat) {
		k = "0" + k;
		return (k.length-2>0) ? k.substring(k.length-2,k.length):k;
	}
	return true;
}
function checkIfTime(s){
	var arr = s.split(":");
	if (IX.isEmpty(arr[0]) || isNaN(arr[0]))
		return false;
	arr[0] = checkIfRange(arr[0],0, 23, true);
	if (!arr[0]) return false;
	if (arr.length==1 || IX.isEmpty(arr[1]))
		arr[1] = "00";
	else {
		arr[1] = checkIfRange(arr[1],0, 59, true);
		if (!arr[1]) return false;
	}
	if (arr.length==2 || IX.isEmpty(arr[2]))
		arr[2] = "00";
	else {
		arr[2] = checkIfRange(arr[2],0, 59, true);
		if (!arr[2]) return false;
	}
	return arr.join(":");
}
function checkIfIP(s){
	var arr = s.split(".");
	if (arr.length != 4)
		return false;
	for (var i = 0; i < 4; i++){
		if (!checkIfRange(arr[i], 0, 255))
			return false;
		arr[i] = arr[i]-0;
	}
	return arr.join(".");
}
function checkIfPort(s){
	if (!checkIfRange(s, 0, 65535, false)) return false;
	return s;
}
function checkIfNum(s){
	if (!checkIfRange(s, 0, 999999, false)) return false;
	return s;
}
var BlurFns = {
	"control-time" : function(inputEl){
		var val = inputEl.value;
		if (val == sysConfigData.ControlReleaseTime)
			return;
		var _value = checkIfNum(val);
		if (!_value)
			return nvAlert("请输入有效的控制释放延时时间！");
		sysConfigData.ControlReleaseTime = val-0;
		inputEl.value = _value;
		uploadConfigData();
	},
	"schedule-time" : function(inputEl){
		var val = inputEl.value;
		var eee=JSON.parse($XP(sysConfigData, "TimingSetting"));
		if (val == eee.schedule)
			return;
		var _value = checkIfTime(val);
		if (!_value)
			return nvAlert("请输入正确的时间格式，例如：01:00:00");
		eee.schedule = _value;
		sysConfigData.TimingSetting=JSON.stringify(eee);
		inputEl.value = _value;
		uploadTimingSettingData();
	},
	"ntp-ip": function(inputEl){
		var val = inputEl.value;
		var fff=JSON.parse($XP(sysConfigData, "TimingSetting"));
		if (val == fff.ntpIP)
			return;
		var _value = checkIfIP(val);
		if (!_value)
			return nvAlert("请输入正确的NTP地址，例如：192.168.0.1");
		fff.ntpIP = _value;
		sysConfigData.TimingSetting=JSON.stringify(fff);
		inputEl.value = _value;
		if (!fff.ntpPort)
			jQuery('#ntp-port').focus();
		else
			uploadTimingSettingData();
	},
	"ntp-port" : function(inputEl){
		var val = inputEl.value;
		var ggg=JSON.parse($XP(sysConfigData, "TimingSetting"));
		if (val == ggg.ntpPort)
			return;
		var _value = checkIfPort(val);
		if (!_value)
			return nvAlert("请输入正确的NTP端口，端口号范围：0~65535");
		ggg.ntpPort = _value;
		sysConfigData.TimingSetting=JSON.stringify(ggg);
		inputEl.value = _value;
		if (!ggg.ntpIP)
			jQuery('#ntp-ip').focus();
		else
			uploadTimingSettingData();
	}
};

function listenOnInput(){
	IX.iterate(["control-time","schedule-time","ntp-ip","ntp-port"], function(id){
		var inputEl = $X(id);
		IX.bind(inputEl, {
			keydown : function(e){
				if (e.which != 13) return;
				e.preventDefault();
				inputEl.blur();
			},
			blur :function(){
				BlurFns[id](inputEl);
			}
		});
	});
}
function sysConfig(cbFn){
	sysCaller("getConfig", {}, function(data){
		sysConfigData = data;
		$X('body').innerHTML = t_config.renderData("", getTpldata4Config());
		listenOnInput();
		jQuery(".cursor").find("input").attr("disabled",true);
		// jQuery('#body input').bind({
		// 	onkeydown : function(e){
		// 		if (e.which != 13) return;
		// 		e.preventDefault();
		// 		inputEl.blur();
		// 	},
		// 	onblur : function(e){inputValueChanged(this);}
		// });
		cbFn();
	});
}

IX.ns("TCM.Sys");
TCM.Sys.init = function(pageCfg, pageParams, cbFn){
	session = TCM.Env.getSession();
	switch(pageCfg.name){
	case "sys-line":
		showSysLine(cbFn);
		break;
	case "sys-role":
		showSysRole(cbFn);
		break;		
	case "sys-level":
		showSysLevel(cbFn);
		break;
	case "sys-user":
		showUsers(cbFn);
		break;
	case "sys-config":
		sysConfig(cbFn);
		break;	
	}
};
})();
(function () {
var deviceCaller = TCM.Global.deviceAndZoneCaller;
var globalActionConfig = IXW.Actions.configActions;

var showDialog = NV.Dialog.show;
var hideDialog = NV.Dialog.hide;
var confirmDialog = NV.Dialog.confirm;
var nvAlert = NV.Dialog.alert;
var ixwInfo = IXW.Lib.info;
var deviceType = TCM.Const.DeviceTypes;
var deviceTypeNames = TCM.Const.DeviceTypeNames;
var getComboHTML = NV.Lib.getComboHTML;
var cameraTree = TCM.Lib.CameraTree;
var getCheckboxHTML = NV.Lib.getCheckboxHTML;
var getNodeName = TCM.DeviceType.getNodeName;
var driverId = TCM.Const.DriverId;


var t_deleteMsg = new IX.ITemplate({tpl: [
	'<div class="hint">确认要删除这{count}吗？</div>',
'']});

var t_editServer = new IX.ITemplate({tpl: [
'<ul class="{clz}">',
	'<li><span class="label">设备名称</span>',
		'<span><input maxlength="64" id="device_name" value="{device_name}" tabindex="1"></span></li>',
	'<li><span class="label">设备类型</span>{deviceTypeCombo}</li>',
	'<li><span class="label">IP地址</span>',
		'<span><input maxlength="15" id="device_ip" value="{device_ip}" tabindex="2"></span></li>',
	'<li style="display:none;"><span class="label">端口号</span>',
		'<span><input maxlength="5" id="device_port" value="1"></span></li>',
	'<li><span class="label">软件版本号</span>',
		'<span><input maxlength="64" id="device_version" value="{device_version}" tabindex="3"></span></li>',
	'<li><span class="label">备注</span>',
		'<span><input maxlength="150" id="device_desc" value="{device_desc}" tabindex="4"></span></li>',
'</ul>',
'']});

var t_editStorage = new IX.ITemplate({tpl: [
'<ul class="{clz}">',
	'<li><span class="label">设备名称</span>',
		'<span><input maxlength="64" id="device_name" value="{device_name}" tabindex="1"></span>',
		'<span class="label labelTwo">用户名</span>',
		'<span><input maxlength="15" id="device_username" value="{device_username}" tabindex="5"></span></li>',
	'<li><span class="label">数据口IP</span>',
		'<span><input maxlength="15" id="device_dataIp" value="{device_dataIp}" tabindex="2"></span>',
		'<span class="label labelTwo">密码</span>',
		'<span><input maxlength="15" id="device_password" value="{device_password}" tabindex="6"></span></li>',
	'<li><span class="label">管理口IP</span>',
		'<span><input maxlength="15" id="device_manageIp" value="{device_manageIp}" tabindex="3"></span>',
		'<span class="label labelTwo">硬盘数量</span>',
		'<span><input maxlength="8" id="device_diskNum" value="{device_diskNum}" tabindex="7"><span class="unit-diskNum"></span></li>',
	'<li><span class="label">端口号</span>',
		'<span><input maxlength="5" id="device_port" value="{device_port}" tabindex="3"></span>',
		'<span class="label labelTwo">总容量</span>',
		'<span><input maxlength="8" id="device_capacity" value="{device_capacity}" tabindex="8"><span class="unit-capacity"></span></span></li>',
	'<li><span class="label">厂家及型号</span>{driverCombo}',
		'<span class="label labelTwo">备注</span>',
		'<span><input maxlength="150" id="device_desc" value="{device_desc}" tabindex="9"></span>',
		'<input id="device_type" value="{device_type}" style="display: none;"></li>',
'</ul>',
'']});

var t_editPickup = new IX.ITemplate({tpl: [
'<ul class="{clz}">',
	'<li><span class="label">设备名称</span>',
		'<span><input maxlength="64" id="device_name" value="{device_name}" tabindex="1"></span></li>',
	'<li><span class="label">设备类型</span>{deviceTypeCombo}</li>',
	'<li><span class="label">厂家</span>',
		'<span><input maxlength="30" id="device_provider" value="{device_provider}" tabindex="2"></span></li>',
	'<li><span class="label">型号</span>',
		'<span><input maxlength="30" id="device_style" value="{device_style}" tabindex="3"></span></li>',
	'<li class="related-camera"><span class="label">关联的摄像机</span>{deviceRelated}</li>',
	'<li><span class="label">备注</span>',
		'<span><input maxlength="150" id="device_desc" value="{device_desc}" tabindex="4"></span></li>',
'</ul>',
'']});

var t_editSpliter = new IX.ITemplate({tpl: [
'<ul class="{clz}">',
	'<li class="spliters"><span class="labelOne">设备名称</span>',
		'<span><input maxlength="64" id="device_name" value="{device_name}" tabindex="1"></span></li>',
	'<li class="spliters"><span class="labelOne">停止位</span>{stopBitCombo}</li>',
	'<li class="spliters"><span class="labelOne">厂家及型号</span>{driverCombo}</li>',
	'<li class="spliters"><span class="labelOne">校验位</span>{parityCombo}</li>',
	'<li class="spliters"><span class="labelOne">串口号</span>{commPortCombo}</li>',
	'<li class="spliters"><span class="labelOne">最大画面数</span>{maxWindowCombo}</li>',
	'<li class="spliters"><span class="labelOne">波特率</span>{baudRateCombo}</li>',
	'<li class="spliters"><span class="labelOne">备注</span>',
		'<span><input maxlength="150" id="device_desc" value="{device_desc}" tabindex="2"></span></li>',
	'<li class="spliters"><span class="labelOne">数据位</span>{dataBitCombo}</li>','<tpl id="relatedDecoders">',
		'<li class="spliters loopDecoder"><span class="labelOne">通道{i}关联解码器</span>{relatedDecoders}</li>',
	'</tpl>',
	'<input id="device_type" value="{device_type}" style="display: none;">',
'</ul>',
'']});

var t_editVdm = new IX.ITemplate({tpl: [
'<ul class="{clz}">',
	'<li><span class="label">设备名称</span>',
		'<span><input maxlength="64" id="device_name" value="{device_name}" tabindex="1"></span>',
		'<span class="label labelTwo">停止位</span>{stopBitCombo}</li>',
	'<li><span class="label">厂家及型号</span>{driverCombo}',
		'<span class="label labelTwo">校验位</span>{parityCombo}</li>',
	'<li><span class="label">串口号</span>{commPortCombo}',
		'<span class="label labelTwo">关联的摄像机</span>{deviceRelated}</li>',
	'<li><span class="label">波特率</span>{baudRateCombo}',
		'<span class="label labelTwo">备注</span>',
		'<span><input maxlength="150" id="device_desc" value="{device_desc}" tabindex="2"></span></li>',
	'<li><span class="label">数据位</span>{dataBitCombo}</li>',
	'<input id="device_type" value="{device_type}" style="display: none;">',
'</ul>',
'']});

var t_editTerminal = new IX.ITemplate({tpl: [
'<ul class="{clz}">',
	'<li><span class="label">设备名称</span>',
		'<span><input maxlength="64" id="device_name" value="{device_name}"></span></li>',
	'<li><span class="label">IP地址</span>',
		'<span><input maxlength="15" id="device_ip" value="{device_ip}"></span></li>',
	'<li><span class="label">备注</span>',
		'<span><input maxlength="150" id="device_desc" value="{device_desc}"></span></li>',
		'<input id="device_type" value="{device_type}" style="display: none;">',
'</ul>',
'']});

var t_editOther = new IX.ITemplate({tpl: [
'<ul class="{clz}">',
	'<li><span class="label">设备名称</span>',
		'<span><input maxlength="64" id="device_name" value="{device_name}" tabindex="1"></span></li>',
	'<li><span class="label">设备类型</span>{deviceTypeCombo}</li>',
	'<li><span class="label">厂家</span>',
		'<span><input maxlength="30" id="device_provider" value="{device_provider}" tabindex="2"></span></li>',
	'<li><span class="label">型号</span>',
		'<span><input maxlength="30" id="device_style" value="{device_style}" tabindex="3"></span></li>',
	'<li><span class="label">软件名称或网页地址</span>',
		'<span><input maxlength="64" id="device_path" value="{device_path}" tabindex="4"></span></li>',
	'<li class="pdu"><span class="label">用户名</span>',
		'<span><input maxlength="15" id="device_username" value="{device_username}" tabindex="5"></span></li>',
	'<li class="pdu"><span class="label">密码</span>',
		'<span><input maxlength="15" id="device_password" value="{device_password}" tabindex="6"></span></li>',
	'<li><span class="label">备注</span>',
		'<span><input maxlength="150" id="device_desc" value="{device_desc}" tabindex="7"></span></li>',
'</ul>',
'']});

var t_editDecoder = new IX.ITemplate({tpl: [
'<ul class="{clz}">',
	'<li><span class="label">设备名称</span>',
		'<span><input maxlength="64" id="device_name" value="{device_name}" tabindex="1"></span>',
		'<span class="label labelTwo">用户名</span>',
		'<span><input maxlength="15" id="device_username" value="{device_username}" tabindex="4"></span></li>',
	'<li><span class="label">IP地址</span>',
		'<span><input maxlength="15" id="device_ip" value="{device_ip}" tabindex="2"></span>',
		'<span class="label labelTwo">密码</span>',
		'<span><input maxlength="15" id="device_password" value="{device_password}" tabindex="5"></span></li>',
	'<li><span class="label">端口号</span>',
		'<span><input maxlength="5" id="device_port" value="{device_port}" tabindex="3"></span>',
		'<span class="label labelTwo">通道数</span>',
		'<span><input maxlength="4" id="device_channelNum" value="{device_channelNum}" tabindex="6"></span></li>',
	'<li><span class="label">厂家及型号</span>{driverCombo}',
		'<span class="label labelTwo">备注</span>',
		'<span><input maxlength="150" id="device_desc" value="{device_desc}" tabindex="7"></span></li>',
		'<input id="device_type" value="{device_type}" style="display: none;">',
'</ul>',
'']});

var t_editMonitor = new IX.ITemplate({tpl: [
'<ul class="{clz}">',
	'<li><span class="label">设备名称</span>',
		'<span><input maxlength="64" id="device_name" value="{device_name}"></span></li>',
	'<li><span class="label">厂家</span>',
		'<span><input maxlength="30" id="device_provider" value="{device_provider}"></span></li>',
	'<li><span class="label">型号</span>',
		'<span><input maxlength="30" id="device_style" value="{device_style}"></span></li>',
	'<li><span class="label">备注</span>',
		'<span><input maxlength="150" id="device_desc" value="{device_desc}"></span></li>',
		'<input id="device_type" value="{device_type}" style="display: none;">',
'</ul>',
'']});

var t_editCoder = new IX.ITemplate({tpl: [
'<ul class="{clz} main">',
	'<li><span class="label">设备名称</span>',
		'<span><input maxlength="64" id="device_name" value="{device_name}" tabindex="1"></span>',
		'<span class="label labelTwo">用户名</span>',
		'<span><input maxlength="15" id="device_username" value="{device_username}" tabindex="4"></span></li>',
	'<li><span class="label">IP地址</span>',
		'<span><input maxlength="15" id="device_ip" value="{device_ip}" tabindex="2"></span>',
		'<span class="label labelTwo">密码</span>',
		'<span><input maxlength="15" id="device_password" value="{device_password}" tabindex="5"></span></li>',
	'<li><span class="label">端口号</span>',
		'<span><input maxlength="5" id="device_port" value="{device_port}" tabindex="3"></span>',
		'<span class="label labelTwo">厂家及型号</span>{driverCombo}</li>',
	'<li><span class="label">通道数</span>{channelNums}',
		'<span class="label labelTwo">备注</span>',
		'<span><input maxlength="150" id="device_desc" value="{device_desc}" tabindex="7"></span></li>',
		'<input id="device_type" value="{device_type}" style="display: none;">',
	'<li class="last"><span class="title">通道设置</span>',
'</ul>',
'<ul id="bcList" class="sub"></li>','<tpl id="channels">','<li><span class="label">通道{channelNo}组播地址</span><span><input maxlength="64" id="device_bcAddr{channelNo}" value="{addr}"></span><span class="label labelTwo">通道{channelNo}组播端口</span><span><input maxlength="64" id="device_bcPort{channelNo}" value="{port}"></span></li>','</tpl>','</ul>',
'']});

var t_editIPC = new IX.ITemplate({tpl: [
'<ul class="{clz}">',
	'<li><span class="label">设备名称</span>',
		'<span><input maxlength="64" id="device_name" value="{device_name}" tabindex="1"></span>',
		'<span class="label labelTwo">用户名</span>',
		'<span><input maxlength="15" id="device_username" value="{device_username}" tabindex="6"></span></li>',
	'<li><span class="label">IP地址</span>',
		'<span><input maxlength="15" id="device_ip" value="{device_ip}" tabindex="2"></span>',
		'<span class="label labelTwo">密码</span>',
		'<span><input maxlength="15" id="device_password" value="{device_password}" tabindex="7"></span></li>',
	'<li><span class="label">端口号</span>',
		'<span><input maxlength="5" id="device_port" value="{device_port}" tabindex="3"></span>',
		'<span class="label labelTwo">摄像机类型</span>{camerasTypeCombo}</li>',
	'<li class="camera-style"><span class="label">组播流地址</span>',
		'<span><input maxlength="15" id="device_bcAddr" value="{device_bcAddr}" tabindex="4"></span>',
		'<span class="label labelTwo">厂家及型号</span>{driverCombo}</li>',
	'<li><span class="label">组播流端口</span>',
		'<span><input maxlength="5" id="device_bcPort" value="{device_bcPort}" tabindex="5"></span>',
		'<span class="label labelTwo">所属分区</span>{zoneIdCombo}</li>',
	'<li><span class="label">通道数</span>{channelNum}',
		'<span class="label labelTwo">备注</span>',
		'<span><input maxlength="150" id="device_desc" value="{device_desc}" tabindex="9">{cameraId}</span></li>',
'</ul>',
'']});

var t_editCamera = new IX.ITemplate({tpl: [
'<ul class="{clz}">',
	'<li><span class="label">设备名称</span>',
		'<span><input maxlength="64" id="device_name" value="{device_name}"></span>',
		'<span class="label labelTwo">设备类型</span>{camerasTypeCombo}</li>',
	'<li><span class="label">关联编码器</span>{coderCombo}',
		'<span class="label labelTwo">所属分区</span>{zoneIdCombo}</li>',
	'<li class="related-channelNo"><span class="label">关联编码器的通道号</span>{channelNoCombo}</li>',
	'<li class="desc"><span class="label labelTwo">备注</span>',
		'<span><input maxlength="150" id="device_desc" value="{device_desc}"></span></li>',
	'<li class="type33"><span>球机设置</span></li>',
	'<li class="type33">',
		'<ul class="sub"><li><span class="label">云台波特率</span>{bitsets}',
		'<span class="label labelTwo">拨码地址</span>',
		'<span><input maxlength="64" id="device_controlParams" value="{device_controlParams}"></span></li>',
		'<li class="control-protocol"><span class="label">控制协议</span>{driverCombo}</li></ul>',
	'</li>',
'</ul>',
'']});

var t_decoderItems = new IX.ITemplate({tpl: [
	'<li><a data-href="${action}" data-key="{id}">{name}</a></li>','']});


var IPCTypes = [deviceType.IPCFixed, deviceType.IPCSemiSphere, deviceType.IPCSphere];
var CameraTypes = [deviceType.CameraFixed, deviceType.CameraSemiSphere, deviceType.CameraSphere];
var OtherTypes = [deviceType.HUB, deviceType.PDH, deviceType.FiberConvertor, deviceType.KVM, deviceType.PDU, deviceType.Other];
//不能更改设备类型的html
function getTransHTML(name, type){
	return '<span><input disabled class="'+ name +'" value="'+ deviceTypeNames[type] +'"><input type="hidden" id="'+ name +'" value="'+ type +'"></span>';
}
function checkIfPort(s){
	var re =  /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
	return re.test(s);
}
function checkIfNum(s){
	var re = /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;
	return re.test(s);
}
function checkIfInt(s){
	var re = /^[1-9]\d*$/;
	return re.test(s);
}
function checkIfBc(s){	
	var re = /^(2(2[4-9]|3[0-9]))\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;
	return re.test(s);
}
function checkIfIP(s){
	return s.isIP();
}
function checkName(s){
	var re = RegExp(/[\/]+/); 
	return !re.test(s);
}
var DataAreaCheckers = {
	"name" : {fn: checkName, text: "设备名称中不允许出现特殊字符/"},
	"ip" : {fn: checkIfIP, text: "请输入正确的IP地址，例如：192.168.0.1"},
	"dataIp" : {fn: checkIfIP, text: "请输入正确的IP地址，例如：192.168.0.1"},
	"manageIp" : {fn: checkIfIP, text: "请输入正确的IP地址，例如：192.168.0.1"},
	"bcAddr" : {fn: checkIfBc, text: "请输入正确的组播流地址，范围：224.0.0.0~239.255.255.255"},
	"bcPort" : {fn: checkIfPort, text: "请输入正确的组播流端口，端口号范围：0~65535"},
	"channelNum" : {fn: checkIfInt, text: "通道数须为大于0的整数！"},
	"capacity" : {fn: checkIfNum, text: "总容量须为大于0的数字！"},
	"diskNum" : {fn: checkIfInt, text: "磁盘数量须为大于0的整数！"},
	"port" : {fn: checkIfPort, text: "请输入正确的端口号，端口号范围：0~65535"}
};
function verifyValue(name, value){
	var checker = DataAreaCheckers[name];
	if (checker && !checker.fn(value)) {
		nvAlert(checker.text);
		return false;
	}
	return true;
}
//验证表单是否合适提交
function verifyForm(value, msg, name){
	if(value == "undefined" || value == "null"){
		nvAlert(msg+"为字符非法,请重新输入！");
		return false;
	}
	if (!value.toString().trim() && !IX.isEmpty(msg)) {
		nvAlert(msg+"不能为空!");
		return false;
	}
	return verifyValue(name, value);
}
//增删改之后刷新节点
function refreshTreeNode(node, num, siteId, zoneId){
	var baseSelector = '.tree-node[data-siteid="'+siteId+'"]';
	var nodeSelector = zoneId ? (baseSelector+'[data-zoneid="'+zoneId+'"]') : baseSelector;
	jQuery(nodeSelector).each(function(){
		var arr = jQuery(this).attr("data-key").split(",");
		if (IX.Array.isFound(node, arr)) {
			var $countNode = jQuery(this).children("span").find(".count");
			var countItem = $countNode.html();
			countItem = countItem.substring(1, countItem.length-1) -0 + num;
			$countNode.html("("+ countItem +")");
		}
	});
}
//增删改之后刷新tree
function refreshTree(types, num, siteId, zoneId){
	if(Array.isArray(types)){
		IX.iterate(types, function(type){
			refreshTreeNode(type, num, siteId, zoneId);
		});
	}else{
		refreshTreeNode(types, num, siteId, zoneId);
	}
}
//删除表格项及提示
function _deleteUnits(rowModels, cfg, okFn, siteId, zoneId){
	var n =  rowModels.length, types = [];
	var ids = IX.map(rowModels, function(r){
		types.push(r.get("type"));
		return r.getId();
	});
	function deleteConfirm(params, arr, zoneId){
		confirmDialog(cfg.title, t_deleteMsg.renderData("",{
			count : n + cfg.unitName
		}),  function(cbFn){
			deviceCaller(cfg.callerName, params, function(data){
				cbFn();
				okFn();
				refreshTree(arr, -1, siteId, zoneId);
			});
		});
	}
	if (zoneId)
		deleteConfirm({id: zoneId, cameras : ids}, types, zoneId);
	else
		deleteConfirm({ids : ids}, types);
}
//单独收集组播数据
function gatherBc(channelNum){
	var arr = [];
	for (var k = 0; k < channelNum; k++) {
		var addr = $X("device_bcAddr"+(k+1)).value;
		var port = $X("device_bcPort"+(k+1)).value;
		if (!addr.isIP()) {
			nvAlert("通道"+(k+1)+"的IP格式错误！");
			return false;
		}
		if (!checkIfPort(port)) {
			nvAlert("通道"+(k+1)+"的端口号错误！");
			return false;
		}
		arr.push({
			addr: addr,
			channelNo: k+1,
			port: port-0
		});
	}
	return arr;
}
//获取提交数据
function gatherInfo(rowModel, checkers, types){
	var data = {}, ifChanged = false;
	for (var i = 0; i < checkers.length; i++){
		var checker = checkers[i];
		var val = null;
		if(checker.key == "device_relatedDecoders"){
			if (IX.Array.isFound(null, relatedDecoders)) 
				return nvAlert("关联解码器不能为空！");
			val = IX.map(relatedDecoders, function(decoder){ return decoder.id;});
		} else if (checker.key == "device_bc")
			continue; 
		else if(IX.Array.isFound(data.type, [31, 32]) && checker.key == "device_driverId")
			continue;
		else
			val = $X(checker.key).value;
		if (!verifyForm(val, checker.empty, checker.name)) return false;
		ifChanged = ifChanged || !(rowModel && rowModel.get(checker.name) == val);
		IX.setProperty(data, checker.name, val);
	}
	if (data.type == deviceType.Coder) {
		data.channelNum = data.channelNum - 0;
		var bc = gatherBc(data.channelNum);
		ifChanged = JSON.stringify(bc) !== JSON.stringify(rowModel.get("bc"));
		if (!bc) return;
		data.bc = JSON.stringify(bc);
	}
	if (!ifChanged) {
		ixwInfo("您未作任何修改，请点击取消关闭编辑窗口！");
		return false;
	}
	if (rowModel)
		data.id = rowModel.getId();
	else 
		delete data.id;
	return data;
}
//表格的增改操作，dialog的显示。
function _editUnit(rowModel, cfg, okFn, types, siteId){
	var checkers = cfg.checkers;
	function _okFn(){
		var info = gatherInfo(rowModel, checkers, types);
		if (!info) return;
		if(types[0] === deviceType.RedirectPickup && types[1] === deviceType.OmnidirectPickup && !info.relatedCamera)
			return nvAlert("拾音器关联的摄像机不能为空！");
		deviceCaller(cfg.callerName, info, function(data){
			hideDialog();
			okFn({ids : [info.id === 0 ? info.id : (info.id || data.id)]});
			if (!rowModel) return refreshTree(info.type, 1, siteId);
			if(IX.Array.isFound(types[0], IPCTypes.concat(CameraTypes)) && types[0] != info.type){
				refreshTree(types[0], -1, siteId);
				refreshTree(info.type, 1, siteId);
			}
		});
	}
	if(IX.Array.isFound(deviceType.PDU, types) && types.length < 7){
		checkers = checkers.concat([
			{name : "username", key : "device_username", empty : ""},
			{name : "password", key : "device_password", empty : ""}
		]);
	}
	var data = {};
	for (var i=0; i<checkers.length; i++){
		var checker = checkers[i];
		var value = null;
		if (rowModel)
			value = rowModel.get(checker.name);
		data[checker.key] = (value || value === 0) ? value.toString().dehtml(): "";
		if(checker.key == "device_relatedDecoders")
			data[checker.key] = value || [];
		if(checker.key == "device_bc")
			data[checker.key] = value || "";
	}
	if(!rowModel){
		if(!data.device_username)
			data.device_username = "admin";
		if(!data.device_password)
			data.device_password = "admin";
		if(IX.Array.isFound(types[0], IPCTypes.concat(deviceType.Decoder)))
			data.device_channelNum = "1";
		data.device_type = types[0];
	}
	var contentData = cfg.tpldataFn(rowModel, data);
	if (contentData.driverCombo === 0)
		return nvAlert("该设备类型未定义驱动,无法执行相关操作！");
	if (!contentData && IX.Array.isFound(types[0], CameraTypes))
		return nvAlert("请添加编码器后，再添加模拟摄像机！");
	showDialog({
		clz : cfg.clz,
		title : cfg.title,
		content : cfg.tpl.renderData("", contentData),
		listen : {ok : _okFn}
	});

}
/*
	此处至582行，是用于得到dialog中的显示项HTML函数
 */
function getDevicesTypeComboHTML(id, type, Types, action){
	var isPUB = IX.Array.isFound(type, OtherTypes);
	return getComboHTML(id, {
		value : type,
		valueText : deviceTypeNames[type],
		items : IX.map(Types, function(_type){
			return IX.inherit({
				id: _type,
				name: deviceTypeNames[_type]
			}, isPUB ? {action: "PUB.changeType"} : {});
		})
	}, action);
}

function getNotRelated4DecoderComboHTML(id, relatedId, relatedName, result){
	return getComboHTML(id, {
		value: relatedId,
		valueText: relatedName,
		items: result
	});
}

function getCoderComboHTML(id, coderId, result){
	var name = null;
	IX.iterate(result, function(coder, idx){
		if (coder.id == coderId)
			name = coder.name;
		coder.action = "pick.coder";
	});
	return getComboHTML(id, {
		value: coderId,
		valueText: name,
		items: result
	});
}
function getChannelNo(channels){
	return IX.map(channels, function(channel, idx){
		return {
			id: channel.channelNo,
			name: channel.channelNo,
			clz: channel.used? "coder-disabled" : "coder-usable",
			action: "pick.channelNo"
		};
	});
}

function getDataDecoders(notRelatedDecoders){
	return IX.map(notRelatedDecoders, function(decoder, idx){
		decoder.action = "decoder.pick";
		return decoder;
	});
}

function getChangeComboHTML(id, num, arr, action){
	return getComboHTML(id,{
		value : num,
		valueText : num,
		items : IX.map(arr, function(Num){
			return {
				id: Num,
				name: Num,
				action: action
			};
		})
	});
}

function getCamerasTypeHTML(id, type, types){
	var isIPC = IX.Array.isFound(type, IPCTypes);
	return getComboHTML(id, {
		value : type,
		valueText : deviceTypeNames[type],
		items : IX.map(types, function(_type){
			return {
				id : _type,
				clz: "",
				name : deviceTypeNames[_type],
				action : isIPC ? "IPC.changeType" : "camera.changeType"
			};
		})
	});
}

function getDriverHTML(id, type, driverId){
	var result = TCM.Device.getDriver4Type(type);
	var provider;
	if(!result)	
		return 0;
	if(driverId)
		provider = TCM.Device.getDriver(driverId).provider+"-"+TCM.Device.getDriver(driverId).style;
	return getComboHTML(id, {
		value: driverId ? driverId : result[0].id,
		valueText: driverId ? provider : result[0].provider,
		items: IX.map(result, function(item, idx){
			return IX.inherit(item, {
				name: item.provider
			});
		})
	});
}

function getZoneComboHTML(id, zoneId, zones){
	var valueText = null;
	for (var i = 0; i < zones.length; i++) {
		if(zones[i].id == zoneId && zones[i].id != "0")
			valueText = zones[i].name;
	}
	return getComboHTML(id,{
		value : zoneId,
		valueText : valueText,
		items : IX.map(zones, function(zone){return {id: zone.id, name: zone.name};})
	});
}
//根据设备的类型，判断某些设备的增改的时候需要请求的数据。
function getAllNotRelated(type, cbFn){
	if (type === deviceType.Spliter) {
		return deviceCaller("getAllNotRelatedDecoders", {type: type}, function(data){
			cbFn(data);
		});
	} else if (IX.Array.isFound(type, [deviceType.RedirectPickup, deviceType.OmnidirectPickup, deviceType.VDM])) {
		return deviceCaller("getAllNotRelatedCameras", {type: type}, function(data){
			cbFn(data);
		});
	} else if (IX.Array.isFound(type, IPCTypes)) {
		return deviceCaller("getAllZones",{},function(data){
			cbFn(data[0].zones);
		});
	} else if (IX.Array.isFound(type, CameraTypes)){
		return deviceCaller("getAllZones", {}, function(data){
			deviceCaller("getAllCoders", {}, function(coders){
				coderHT = {};
				IX.iterate(coders, function(coder, idx){
					coderHT[coder.id] = coder;
				});
				cbFn({
					zones: data[0].zones,
					coders: coders
				});
			});
		});

	}
	cbFn();
}
//下拉框切换时候的默认操作函数
function baseChangeCombo(type, name, el){
	var dropdownEl = $XH.ancestor(el, "dropdown");
	if (!dropdownEl) return;
	var inputEl = $XD.first(dropdownEl, "input");
	inputEl.value = type;
	var nameEl = $XH.first($XH.first(dropdownEl, "dropdown-toggle"), "name");
	nameEl.innerHTML = name;
}
//画面分割器中，更改最大画面数时，对于关联解码器列表的刷新操作
function refreshLoopDecoder(){
	jQuery(".loopDecoder .dropdown-menu").each(function(){
		jQuery(this).html(IX.loop(getDataDecoders(notRelatedDecoders), "", function(acc, data, idx){
			acc += t_decoderItems.renderData("", data);
			return acc;
		}));
	});
}

globalActionConfig([["pick.coder", function(params, el){//模拟摄像机关联编码器选择
	var type = params.key, name = el.innerHTML;
	var oldCoder = $X("coder_id").value;
	var channelNo = $X("channel_no").value;
	if (channelNo && oldCoder) {
		IX.iterate(coderHT[oldCoder].channels, function(channel){
			if (channel.channelNo == channelNo) 
				channel.used = 0;
		});
	}
	baseChangeCombo(type, name, el);
	var newChannelNoHTML = getComboHTML("channel_no", {
		value: "", 
		valueText: "", 
		items: getChannelNo(coderHT[type].channels)
	});
	var $li = jQuery(".related-channelNo");
	$li.children("span:last").remove();
	$li.append(newChannelNoHTML);
}],["pick.channelNo", function(params, el){//模拟摄像机关联编码器的通道号
	if ($XH.hasClass(el.parentNode, "coder-disabled"))
		return;
	var key = params.key, name = el.innerHTML;
	var channelNo = $X("channel_no").value;
	if (channelNo) 
		jQuery(el).parents(".dropdown-menu").find('[data-key="'+channelNo+'"]').parent().removeClass("coder-disabled").addClass("coder-usable");
	jQuery(el).parent().removeClass("coder-usable").addClass("coder-disabled");
	baseChangeCombo(key, name, el);
}],["IPC.changeType", function(params, el){//数字摄像机类型之间的切换对于driver的操作
	var type = params.key, name = el.innerHTML;
	var id = $X("device_id").value;
	if(!id){
		baseChangeCombo(type, name, el);
		return;
	}
	deviceCaller("isRelatePickup", {id: id, type: type}, function(data){
		if(data.msg){
			return NV.Lib.confirm({content: data.msg, okFn: function(){
				baseChangeCombo(type, name, el);
			}});
		}
		baseChangeCombo(type, name, el);
	});
}],["camera.changeType", function(params, el){//模拟摄像机类型之间的切换对于driver的操作
	var type = params.key, name = el.innerHTML;
	var newCombo = getDriverHTML("device_driverId", type);
	if(type == 33 && newCombo === 0)
		return nvAlert("该设备类型未定义驱动,无法执行相关操作！");
	baseChangeCombo(type, name, el);
	var ulEl = $XD.ancestor($XH.ancestor(el, "dropdown"), "ul");
	ulEl.className = type == 33 ? "cameraSphere" : "camera-edit";
	jQuery(".control-protocol").html('<span class="label">控制协议</span>'+newCombo);
}],["device.changeChannel", function(params, el){//编码器通道数变化
	var num = Number(params.key),name = el.innerHTML;
	var oldNum = Number(jQuery("#device_channelNum_combo").children(".name").html());
	baseChangeCombo(num, name, el);
	var liList = jQuery("#bcList").children("li");
	var lastLi = liList.last();
	var HTML = "";
	if(num > oldNum){
		for (var i = 0; i < num-oldNum; i++) {
			HTML += t_editCoder.renderData("channels",{
				channelNo : oldNum+i+1,
				port : "",
				addr : ""
			});
		}
		jQuery(HTML).insertAfter(lastLi);
	}else{
		for (var j = 0; j < oldNum-num; j++) {
			jQuery("#bcList").children("li").last().remove();
		}
	}
}],["device.changeMaxWindow", function(params, el){//画面分割器最大画面数切换
	var num = Number(params.key),name = el.innerHTML;
	var oldNum = jQuery(".loopDecoder").length;
	baseChangeCombo(num, name, el);
	var HTML = "";
	if(num > oldNum){
		for (var i = 0; i < num-oldNum; i++) {
			HTML += t_editSpliter.renderData("relatedDecoders",{
				i: oldNum+i+1,
				relatedDecoders: getNotRelated4DecoderComboHTML(
					"device_relatedDecoders"+(oldNum+i+1),
					"",
					"",
					getDataDecoders(notRelatedDecoders)
				)
			});
			relatedDecoders.push(null);
		}
		jQuery(HTML).insertAfter(jQuery(".spliter-edit").find(".spliters").last());
	}else{
		for (var j = 0; j < oldNum-num; j++) {
			notRelatedDecoders = notRelatedDecoders.concat(relatedDecoders.splice(1, relatedDecoders.length));
			jQuery(".spliter-edit").find(".spliters").last().remove();
		}
		refreshLoopDecoder();
	}
}],["decoder.pick", function(params, el){//画面分割器中关联解码器的切换，对于未关联数据的维护和操作
	var id = params.key, name = el.innerHTML;
	baseChangeCombo(id, name, el);
	var lengthId = jQuery($XH.ancestor(el, "dropdown")).find("input").get(0).id;
	var num = Number(lengthId.slice(22, lengthId.length));
	var index = null;
	IX.iterate(notRelatedDecoders, function(decoder, idx){
		if(decoder.id == id)
			index = idx;
	});
	notRelatedDecoders.splice(index,1);
	if(relatedDecoders[num-1])
		notRelatedDecoders.unshift(relatedDecoders[num-1]);
	relatedDecoders[num-1] = {
		id: id,
		name: name
	};
	refreshLoopDecoder();
}],["relatedCamera.pick", function(params, el){//拾音器关联摄像机
	var id = params.key, name = el.innerHTML;
	var isChange = id != $X("device_type").value;
	baseChangeCombo(id, name, el);
	if(!$X("device_relatedCamera") || !isChange) return;
	deviceCaller("getAllNotRelatedCameras", {type: id}, function(data){
		jQuery(".related-camera").get(0).innerHTML = '<span class="label">关联的摄像机</span>' + 
			getNotRelated4DecoderComboHTML("device_relatedCamera", "", "", data.notRelatedCameras); 
	});
}],["PUB.changeType", function(params, el){//其他设备中设备类型切换数字PUB显示账号密码
	var type = params.key, name = el.innerHTML;
	baseChangeCombo(type, name, el);
	var ulEl = $XD.ancestor($XH.ancestor(el, "dropdown"), "ul");
	ulEl.className = type == 64 ? "PDU-edit" : "edit";
}]]);

var notRelatedDecoders = [];
var relatedDecoders = [];
var coderHT = {};

var MaxWindowNums = [1, 2, 4, 9, 16];

var channelNums = [1, 2, 4, 8, 16, 32];

var bitsets = [4800, 9600, 16000, 19200, 38400, 43000, 56000, 57600, 115200];

var Datasets =[4, 5, 6, 7, 8];

var ParityComboItem = [
	{id : 0, name : "无"},
	{id : 1, name : "奇"},
	{id : 2, name : "偶"},
	{id : 3, name : "标记"},
	{id : 4, name : "空格"}
];

var CommPortComboItem = IX.map("0".multi(8).split(""), function(o, idx){
	return {
		id : idx,
		name : "COM" + (idx + 1)
	};
});

var StopBitComboItem = [
	{id : 0, name : "1"},
	{id : 1, name : "1.5"},
	{id : 2, name : "2"}
];

var ChooseChecker = {
	0 : {name : "ip", key: "device_ip", empty : "设备IP"},
	1 : {name : "port", key: "device_port", empty : ""},
	2 : {name : "provider", key : "device_provider", empty : "设备厂家"},
	3 : {name : "style", key : "device_style", empty : "设备型号"},
	4 : {name : "driverId", key : "device_driverId", empty : "厂家及型号"},
	5 : {name : "username", key : "device_username", empty : ""},
	6 : {name : "password", key : "device_password", empty : ""}
};
//获取每个dialog的显示数据
function getCheckers(arr){
	var	checkersBase = [
		{name : "name", key: "device_name", empty : "设备名称"},
		{name : "type", key: "device_type", empty : ""},
		{name : "desc", key: "device_desc", empty : ""}
	];
	return checkersBase.concat(arr);
}

var DeviceDialogCfg = {
	server: {
		clz : "server-edit",
		tpl : t_editServer,
		checkers : getCheckers([ChooseChecker[0], ChooseChecker[1],
			{name : "version", key: "device_version", empty : ""}
		])
	},
	storage: {
		clz : "storage-edit",
		tpl : t_editStorage,
		checkers : getCheckers([ChooseChecker[1], ChooseChecker[4], ChooseChecker[5], ChooseChecker[6],
			{name : "diskNum", key: "device_diskNum", empty : "硬盘数量"},
			{name : "dataIp", key: "device_dataIp", empty : "数据口IP"},
			{name : "manageIp", key: "device_manageIp", empty : "管理口IP"},
			{name : "capacity", key: "device_capacity", empty : "存储总容量"}
		])
	},
	pickup: {
		clz : "pickup-edit",
		tpl : t_editPickup,
		checkers : getCheckers([ChooseChecker[2], ChooseChecker[3],
			{name : "relatedCamera", key : "device_relatedCamera", empty : ""}
		])
	},
	spliter: {
		clz : "spliter-edit",
		tpl : t_editSpliter,
		checkers : getCheckers([ChooseChecker[4],
			{name : "maxWindow", key : "device_maxWindow", empty : ""},
			{name : "commPort", key : "device_commPort", empty : ""},
			{name : "baudRate", key : "device_baudRate", empty : ""},
			{name : "dataBit", key : "device_dataBit", empty : ""},
			{name : "parityBit", key : "device_parityBit", empty : ""},
			{name : "stopBit", key : "device_stopBit", empty : ""},
			{name : "decoders", key : "device_relatedDecoders", empty : ""}
		])
	},
	terminal: {
		clz : "terminal-edit",
		tpl : t_editTerminal,
		checkers : getCheckers([ChooseChecker[0]])
	},
	other: {
		clz : "other-edit",
		tpl : t_editOther,
		checkers : getCheckers([ChooseChecker[2], ChooseChecker[3],
			{name : "path", key : "device_path", empty : "对应的软件名称或网页地址"}
		])
	},
	decoder: {
		clz : "decoder-edit",
		tpl : t_editDecoder,
		checkers : getCheckers([ChooseChecker[4], ChooseChecker[0], ChooseChecker[1], ChooseChecker[5], ChooseChecker[6],
			{name : "channelNum", key: "device_channelNum", empty : "设备通道数"}
		])
	},
	monitor: {
		clz : "monitor-edit",
		tpl : t_editMonitor,
		checkers : getCheckers([ChooseChecker[2], ChooseChecker[3]])
	},
	coder: {
		clz : "coder-edit",
		tpl : t_editCoder,
		checkers : getCheckers([ChooseChecker[4], ChooseChecker[0],	ChooseChecker[1], ChooseChecker[5], ChooseChecker[6],
			{name : "channelNum", key: "device_channelNum", empty : ""},
			{name : "bc", key: "device_bc", empty : ""}
		])
	},
	vdm: {
		clz : "vdm-edit",
		tpl : t_editVdm,
		checkers : getCheckers([ChooseChecker[4],
			{name : "commPort", key : "device_commPort", empty : ""},
			{name : "baudRate", key : "device_baudRate", empty : ""},
			{name : "dataBit", key : "device_dataBit", empty : ""},
			{name : "parityBit", key : "device_parityBit", empty : ""},
			{name : "stopBit", key : "device_stopBit", empty : ""},
			{name : "relatedCamera", key : "device_relatedCamera", empty : ""}
		])
	},
	IPC: {
		clz : "IPC-edit",
		tpl : t_editIPC,
		checkers : getCheckers([ChooseChecker[4], ChooseChecker[0],	ChooseChecker[1], ChooseChecker[5], ChooseChecker[6],
			{name : "bcAddr", key: "device_bcAddr", empty : "组播流地址"},
			{name : "bcPort", key: "device_bcPort", empty : "组播流端口"},
			{name : "channelNum", key: "device_channelNum", empty : ""},
			{name : "zoneId", key: "zone_id", empty : ""},
			{name : "id", key: "device_id", empty : ""}
		])
	},
	camera: {
		clz : "camera-edit",
		tpl : t_editCamera,
		checkers : getCheckers([ChooseChecker[4],
			{name: "coderId", key: "coder_id", empty: "关联编码器"},
			{name: "channelNo", key: "channel_no", empty: "关联编码器的通道号"},
			{name : "zoneId", key: "zone_id", empty : ""},
			{name : "controlParams", key: "device_controlParams", empty : ""},
			{name : "bitsets", key: "device_bitsets", empty : ""}
		])
	}
};

function getProperty(arr, key){
	for (var i = 0; i < arr.length; i++) {
		if(key == arr[i].id)
			return arr[i].name;
	}
	return "";
}

function getCameraTplData(rowModel, data, types, result){
	if (!rowModel && result.coders.length === 0)
		return false;
	data.zoneIdCombo = getZoneComboHTML("zone_id", data.zone_id || "", result.zones ? result.zones : []);
	data.bitsets = getChangeComboHTML("device_bitsets", data.device_bitsets || bitsets[0], bitsets);
	data.clz = (data.device_type || types[0]) == 33 ? "cameraSphere" : "camera-edit";
	if (!rowModel && types.length === 1)
		data.camerasTypeCombo = getTransHTML("device_type", data.device_type || types[0]);
	else
		data.camerasTypeCombo = getCamerasTypeHTML("device_type", data.device_type || types[0], [31, 32, 33]);
	data.coderCombo = getCoderComboHTML("coder_id", data.coder_id || "", result.coders);
	data.channelNoCombo = getComboHTML("channel_no", {
		value: data.channel_no || "", 
		valueText: data.channel_no || "", 
		items: data.coder_id? getChannelNo(coderHT[data.coder_id].channels): []
	});
	if (types[0] == 33)
		data.driverCombo = getDriverHTML("device_driverId", 33, data.device_driverId);
	return data;
}

function getTplDataHasResult(rowModel, data, types, result){
	var relatedCamera = data.device_relatedCamera && rowModel? [{id: data.device_relatedCamera, name: rowModel.get("relatedCameraName")}] : [];
	data.deviceRelated = getNotRelated4DecoderComboHTML(
		"device_relatedCamera",
		data.device_relatedCamera || "",
		rowModel ? rowModel.get("relatedCameraName") : "",
		relatedCamera.concat(result.notRelatedCameras || [])
	);

	data.zoneIdCombo = getZoneComboHTML("zone_id", data.zone_id || "", result ? result : []);
	var parityBit = getProperty(ParityComboItem, data.device_parityBit || 0);
	var stopBit = getProperty(StopBitComboItem, data.device_stopBit || 0);
	var commPort = getProperty(CommPortComboItem, data.device_commPort || 0);
	data.maxWindowCombo = getChangeComboHTML("device_maxWindow", data.device_maxWindow || MaxWindowNums[0], MaxWindowNums, "device.changeMaxWindow");
	if(types[0]==52){
		data.baudRateCombo = getChangeComboHTML("device_baudRate", data.device_baudRate || bitsets[8], bitsets);
	}
	if(types[0]==65){
		data.baudRateCombo = getChangeComboHTML("device_baudRate", data.device_baudRate || bitsets[1], bitsets);
	}
	data.dataBitCombo = getChangeComboHTML("device_dataBit", data.device_dataBit|| Datasets[4], Datasets);
	data.parityCombo = getNotRelated4DecoderComboHTML("device_parityBit", data.device_parityBit || 0, parityBit, ParityComboItem);
	data.stopBitCombo = getNotRelated4DecoderComboHTML("device_stopBit", data.device_stopBit || 0, stopBit, StopBitComboItem);
	data.commPortCombo = getNotRelated4DecoderComboHTML("device_commPort", data.device_commPort || 0, commPort, CommPortComboItem);

	relatedDecoders = [null];
	notRelatedDecoders = result.notRelatedDecoders || [];
	data.relatedDecoders = [{
		i: 1,
		relatedDecoders: getNotRelated4DecoderComboHTML("device_relatedDecoders1", "", "", getDataDecoders(notRelatedDecoders))
	}];

	relatedDecoders = data.device_maxWindow ? new Array(Number(data.device_maxWindow)) : [null];
	notRelatedDecoders = result.notRelatedDecoders || [];
	for (var i = 0; i < relatedDecoders.length; i++) {
		relatedDecoders[i] = null;
	}
	data.relatedDecoders = IX.loop("0".multi(relatedDecoders.length).split(""), [], function(acc, decoder, idx){
		var obj = {};
		obj.i = idx+1;
		relatedDecoders[idx] = data.device_relatedDecoders ? data.device_relatedDecoders[idx] : "";
		obj.relatedDecoders = getNotRelated4DecoderComboHTML(
			"device_relatedDecoders"+(idx+1),
			relatedDecoders[idx] ? relatedDecoders[idx].id : "",
			relatedDecoders[idx] ? relatedDecoders[idx].name : "",
			getDataDecoders(notRelatedDecoders)
		);
		acc.push(obj);
		return acc;
	});
	return data;
}
//获取dialog的显示数据
function getTplData(rowModel, data, types, result){
	if (IX.Array.isFound(types[0], CameraTypes)) 
		return getCameraTplData(rowModel, data, types, result);
	if (result) 
		data = getTplDataHasResult(rowModel, data, types, result);
	data.channelNums = getChangeComboHTML("device_channelNum", data.device_channelNum || 1, channelNums, "device.changeChannel");
	data.channels = data.device_bc ? data.device_bc : [{
		addr: "", 
		port: "", 
		channelNo: 1
	}];

	data.channelNum = '<span><input disabled id="device_channelNum" value="1"></span>';
	var theType = data.device_type || types[0];
	if (rowModel) 
		data.deviceTypeCombo = getTransHTML("device_type",theType);
	else 
		data.deviceTypeCombo = getDevicesTypeComboHTML("device_type", theType, types, "relatedCamera.pick");
	data.camerasTypeCombo = getCamerasTypeHTML("device_type", theType, [20,21,22]);
	if (!rowModel && types.length === 1) {
		data.camerasTypeCombo = getTransHTML("device_type",theType);
		data.deviceTypeCombo = getTransHTML("device_type", theType);
	}	
	data.cameraId = '<input type="hidden" id="device_id" value="'+data.device_id+'">';
	data.clz = theType == 64 ? "PDU-edit" : "edit";
	if (IX.Array.isFound(theType, [10, 50, 51, 52, 65]))
		data.driverCombo = getDriverHTML("device_driverId", theType, data.device_driverId);
	if (IX.Array.isFound(theType, [20, 21, 22]))
		data.driverCombo = getDriverHTML("device_driverId", 202122, data.device_driverId);
	return data;
}

IX.ns("TCM.DeviceDialog");
//回调公开接口给index使用
TCM.DeviceDialog.editDevice = function(rowModel, okFn, siteId){
	var types = [rowModel.get("type")];
	var key = getNodeName(types[0]);
	getAllNotRelated(types[0], function(result){
		_editUnit(rowModel, IX.inherit(DeviceDialogCfg[key], {
			title : "编辑设备",
			callerName : "editDevice",
			tpldataFn : function(rowModel, data){
				return getTplData(rowModel, data, types, result);
			}
		}), okFn, types, siteId);
	});
};

TCM.DeviceDialog.createDevice = function(types, okFn, siteId){
	var key = getNodeName(types[0]);
	getAllNotRelated(types[0], function(result){
		_editUnit(null, IX.inherit(DeviceDialogCfg[key], {
			title : "添加设备",
			callerName : "addDevice",
			tpldataFn : function(rowModel, data){
				return getTplData(rowModel, data, types, result);
			}
		}), okFn, types, siteId);
		var driverVal = jQuery("#device_driverId").attr("value");
		if(jQuery(".decoder-edit").length > 0 && driverVal == driverId.JS_decoder){
			jQuery("#device_port").attr("value", "6000");
		}
		if(jQuery(".IPC-edit").length > 0 || jQuery(".coder-edit").length > 0){
			if(driverVal == driverId.DH_host_IPC || driverVal == driverId.DH_host_coder){
				jQuery("#device_port").attr("value", "37777");
			}
		}
	});
};
TCM.DeviceDialog.deleteDevices = function(rowModels, okFn, siteId){
	_deleteUnits(rowModels, {
		title : "确认删除",
		unitName : "个设备",
		callerName : "deleteDevices"
	}, okFn, siteId);
};


var t_addZone = new IX.ITemplate({tpl: [
	'<li class="expand">',
		'<a class="tree-node" data-href="$tree.click" data-key="20,21,22,31,32,33" data-siteid="{siteId}" data-name="{zoneName}" data-zoneid="{zoneId}">',
			'<span class="pic-expand"></span><span><span class="nodeName">{zoneName}</span><span class="count">({fixed})</span></span>',
		'</a>',
		'<a class="deleteZone r" data-href="$zone.delete" data-key="{zoneId}"></a>',
		'<a class="editZone r" data-href="$zone.edit" data-key="{zoneId}"></a>',
		'<ul style="display: none;">','<tpl id="items">',
			'<li class="none">',
				'<a class="tree-node" data-href="$tree.click" data-key="{type1},{type2}" data-siteid="{siteId}" data-name="{name}" data-zoneid="{zoneId}">',
					'<span class="pic-expand"></span><span>{name}<span class="count">({count})</span></span>',
				'</a>',
			'</li>','</tpl>',
		'</ul>',
	'</li>',
'']});

var t_editZone = new IX.ITemplate({tpl: [
'<ul>',
	'<li><span class="label">原名称 </span><span class="oldName">{oldName}</span></li>',
	'<li><span class="label">新名称 </span><span><input id="zone_name" value=""></span></li>',
'</ul>',
'']});

var t_addZoneBlock = new IX.ITemplate({tpl: [
	'<ul><li><span class="label">分区名</span><span><input id="zone_name" value=""></span></li></ul>',
'']});

IX.ns("TCM.TreeDialog");
//增加分区时，操作成功刷新tree数据
function addZoneOkFn(data, CurrentSite){
	var zoneHTML = t_addZone.renderData("", {
		siteId: CurrentSite.id,
		zoneId: data.id,
		zoneName: IX.encodeTXT(data.name),
		fixed: data.total.fixed,
		items: [
			{type1: 20, type2: 31, siteId: CurrentSite.id, zoneId: data.id, name: "枪机", count: data.total.fixed},
			{type1: 21, type2: 32, siteId: CurrentSite.id, zoneId: data.id, name: "半球", count: data.total.semi},
			{type1: 22, type2: 33, siteId: CurrentSite.id, zoneId: data.id, name: "球机", count: data.total.sphere}
		]
	});
	var $firstLi = jQuery(".nv-tree>ul>li");
	if($firstLi.hasClass("none"))
		$firstLi.removeClass('none').addClass('expand');
	var ul = jQuery(".nv-tree ul")[1];
	if(!ul){
		ul = jQuery("<ul></ul>");
		$firstLi.append(ul);
	}
	jQuery(ul).append(jQuery(zoneHTML));
	jQuery(ul).children("li").last().children("a").find(".count").click();
}
//增加分区
TCM.TreeDialog.addZone = function(params, el, CurrentSite){
	function _okFn(){
		var name = $X('zone_name').value;
		if (IX.isEmpty(name))
			return nvAlert("分区名称不能为空！");
		if (!checkName(name))
			return nvAlert("分区名称允许出现特殊字符/");
		deviceCaller("addZone", {name: name}, function(data){
			addZoneOkFn(data, CurrentSite);
			hideDialog();
			ixwInfo("添加分区成功！");
		});
	}
	showDialog({
		clz : "device-addZoneBlock",
		title : "新建分区",
		content :t_addZoneBlock.renderData(""),
		listen : {ok : _okFn}
	});
};
//修改分区
TCM.TreeDialog.editZone = function(params, el, CurrentSite){
	var value = IX.encodeTXT(jQuery(el).prev().prev().attr("data-name"));
	var id = jQuery(el).prev().prev().attr("data-zoneid");
	function _okFn(el){
		var newName = $X('zone_name').value;
		if (IX.isEmpty(newName))
			return nvAlert("新分区名称不能为空！");
		if (!checkName(newName))
			return nvAlert("分区名称允许出现特殊字符/");
		deviceCaller("editZone", {id : id, name: newName}, function(data){
			jQuery(".tree-node").next().children("li").each(function(){
				var zoneA = jQuery(this).children("a").first();
				if(zoneA.attr("data-zoneid") == id){
					zoneA.attr("data-name", newName);
					jQuery(el).parent().find(".nodeName").html(newName);
					jQuery("#Grid").find(".nv-title").html(newName+"摄像机列表");
				}
			});
			hideDialog();
			ixwInfo("修改成功！");
		});
	}
	showDialog({
		clz : "device-editZone",
		title : "修改名称",
		content :t_editZone.renderData("",{
			oldName: value,
		}),
		listen : {ok : function(){
			_okFn(el);
		}}
	});
};
//删除分区
TCM.TreeDialog.deleteZone = function(params, el){
	var li = jQuery(el).parent("li");
	var liParent = li.parent();
	function _okFn(){
		li.remove();
		var span = liParent.children("li").first().children("a").first().find(".count");
		if(span.length === 0){
			jQuery("#Grid").find(".body").html("");
			jQuery("#Grid").find(".nv-title").html("摄像机列表");
			jQuery(".btn-create").removeClass("btn-create").addClass("btn-discreate");
		}else{
			span.click();
		}
	}
	confirmDialog("删除分区",t_deleteMsg.renderData("",{
		count : "个分区",
		units : li.children("a").first().attr("data-name")
	}), function(cbFn){
		deviceCaller("deleteZone", {ids: [params.key]}, function(data){
			cbFn();
			ixwInfo("删除分区成功！");
			_okFn();
		});
	});
};


var t_addCameras = new IX.ITemplate({tpl: [
'<ul class="{clz}">',
	'<li><span class="label">车站选择</span>',
		'<span><input id="station" disabled="disabled" value="{station}"></span>',
		'<span class="label">分区</span>',
		'<span><input id="theZone" disabled="disabled" value="{theZone}"></span></li>',
	'<li id="choose">{chooseCameras}</li>',
'</ul>',
'']});


//增删摄像机时刷新Tree
function refreshTreeZone(zoneId, data){
	var treeEl = jQuery(".nv-tree [data-zoneid="+zoneId+"]");
	var all = data.fixed + data.semi + data.sphere;
	var arr = [], i = 0;
	arr = arr.concat(all, data.fixed, data.semi, data.sphere);
	treeEl.each(function(){
		jQuery(this).find(".count").html("("+arr[i++]+")");
	});
}

IX.ns("TCM.ZoneDialog");
//增加摄像机
TCM.ZoneDialog.addCameras = function(types, okFn){
	function _okFn(){
		var zoneId = jQuery(".select").attr("data-zoneid");
		var obj = cameraTree.getCamera4TypeAccess($X("choose"));
		if(obj.length === 0)
			return nvAlert("请选择需要添加的摄像机到分区！");
		deviceCaller("addCamerasToZone", {
			id : zoneId,
			cameras : obj.ids
		}, function(data){
			jQuery(".btn-discreate").removeClass("btn-discreate").addClass("btn-create");
			okFn(obj);
			refreshTreeZone(zoneId, data);
			hideDialog();
		});
	}
	deviceCaller("getCamerasByNoZone", {}, function(result){
		if(result.length === 0)
			return nvAlert("暂时无可分配的摄像机！");
		showDialog({
			clz : "cameraToZone",
			title : '新增摄像机',
			content :t_addCameras.renderData("", {
				station : jQuery(".nv-tree .nodeName").first().html(),
				theZone : jQuery("a.select").attr("data-name") || "",
				chooseCameras : cameraTree.getCamera4TypesHTML(result, types)
			}),
			listen : {ok : _okFn}
		});
		IX.bind(jQuery("#choose").get(0), {
			click : function(e){
				if ($XD.ancestor(e.target, "a")) return;
				var el = $XH.ancestor(e.target, "type");
				jQuery(el).siblings(".type").removeClass("expanded");
				jQuery(el).siblings(".type").find(".nv-collapse").addClass("expanded");
				$XH.toggleClass(el, "expanded");
				jQuery(el).find(".nv-collapse").toggleClass("expanded");
			}
		});
	});
};
//删除摄像机
TCM.TreeDialog.deleteCameras = function(rowModels, okFn, siteId, zoneId){
	_deleteUnits(rowModels, {
		title : "确认删除",
		unitName : "个摄像机",
		callerName : "deleteCamerasFromZone"
	}, okFn, siteId, zoneId);
};
})();
(function () {
var deviceCaller = TCM.Global.deviceAndZoneCaller;
var globalActionConfig = IXW.Actions.configActions;
var deviceNames = TCM.Const.DeviceTypeNames;

var showDialog = NV.Dialog.show;
var hideDialog = NV.Dialog.hide;
var confirmDialog = NV.Dialog.confirm;

var getComboHTML = NV.Lib.getComboHTML;
var cameraTree = TCM.Lib.CameraTree;

var nvAlert = NV.Dialog.alert;

var CurrentSite = null;
var isOCC = null;
var isHandle = null;
var driverHT = {};
var drivers = null;

var spliterHTML = null;
var decoderHTML = null;
// input搜索框暂未使用

var t_input = new IX.ITemplate({tpl: ['<div><input class="search" placeholder="设备选择"><a class="pic-search"></a></div>','']});
var t_info = new IX.ITemplate({tpl: [
	'<div id="Tree"><div id="treeName">{treeName}</div>{treeData}',
		'<div class="addZone">{addZone}',
		'</div>',
	'</div>',
	'<div id="Grid" class="{showZone}"></div>',
'']});

var t_addZone = new IX.ITemplate({tpl: ['<a data-href="$zone.add"><span></span>添加分区</a>','']});

var t_title = new IX.ITemplate({tpl: [
	'<a class="grid-navbar chooseBar" data-href="$show.grid" data-zoneId="{zoneId}" data-siteId="{siteId}" data-types="{types}">{name4Zone}</a>',
	'<span class="vertical">|</span>',
	'<a class="grid-navbar" data-href="$show.map" data-zoneid="{zoneId}" data-siteid="{siteId}">地图</a>',
'']});

/*在Grid创建出来后绑定自适应缩放函数*/
function resizeGridFn(desc){
	var height = jQuery("#Grid").height();
	jQuery("#Tree").css("height", height + "px");
	if (!desc)
		jQuery(".nv-tree").css("height", height - 55 + "px");
	else
		jQuery(".nv-tree").css("maxHeight", height - 85 + "px");
}
/*创建设备表格*/
function createDeviceGrid(cfgs, treeCfg){
	var grid = null;
	var columns = ["_checkbox"].concat($XP(cfgs, "columns").split(","));
	var types = treeCfg.types;
	var siteId = treeCfg.siteId;
	var length = treeCfg.types.length;

	function createItem(_cbFn){
		TCM.DeviceDialog.createDevice(types, function(data){
			_cbFn(data);
		}, siteId);
	}
	function deleteItems(rowModels, _cbFn){
		TCM.DeviceDialog.deleteDevices(rowModels, function(){
			_cbFn();
		}, siteId);
	}
	grid = new TCM.Lib.Grid($XP(cfgs, "container", 'Grid'),{
		title : $XP(treeCfg, "name"),
		grid : {
			clz : length>=15?"device-list":"device-list-"+treeCfg.types[0],
			columns: columns,
			actions : isHandle ? ["delete", ["edit", "编辑", function(rowModel, rowEl){
				TCM.DeviceDialog.editDevice(rowModel, function(){
					grid.refresh();
				}, siteId);
			}]] : [],
			hasCheckbox : $XP(cfgs, "hasCheckbox") || true,
			usePagination : $XP(cfgs, "usePagination") || true,
			dataLoader : function(params, _cbFn){
				deviceCaller("getDevices4Type", IX.inherit(params, {
					types: treeCfg.types,
					siteId: treeCfg.siteId
				}), function(data){
					_cbFn(data);
					resizeGridFn();
					$Xw.bind({"resize": resizeGridFn});
				});
			}
		},
		tools : {
			buttons: isHandle ? (types.length > 7 ? ["refresh", "delete"] : ["refresh", "create", "delete"]) : ["refresh"]
		},
		listen : {
			createItem: createItem,
			deleteItems: deleteItems
		}
	});
}
/*创建分区表格*/
function createZoneGrid(treeCfg){
	var types = treeCfg.types;
	var zoneId = treeCfg.zoneId;
	var siteId = treeCfg.siteId;
	function createFn(_cbFn){
		TCM.ZoneDialog.addCameras(types, function(data){
			_cbFn(data);
		});
	}
	function deleteFn(rowModels, _cbFn){
		TCM.TreeDialog.deleteCameras(rowModels, function(){
			_cbFn();
		}, siteId, zoneId);
	}
	var titleHTML = t_title.renderData("", {
		zoneId: zoneId,
		siteId: siteId,
		types: types,
		name4Zone: treeCfg.name+"列表"
	});
	return new TCM.Lib.Grid($XP(treeCfg, "container", 'Grid'),{
		title : titleHTML,
		grid : {
			clz : "device-list",
			columns: ["_checkbox","devType","devName","devDesc"],
			actions : isOCC ? [] : ["delete"],
			hasCheckbox : true,
			usePagination : true,
			dataLoader : function(params, _cbFn){
				deviceCaller("getCamerasByZone", IX.inherit(params, {
					types: types,
					siteId: siteId,
					id: zoneId
				}), function(data){
					_cbFn(data);
					if(jQuery(".select").length === 0)
						jQuery(".btn-create").removeClass("btn-create").addClass("btn-discreate");
					jQuery("#Grid").removeClass("showMap");
					resizeGridFn(!isOCC);
					$Xw.bind({"resize": function(){
						resizeGridFn(!isOCC);
					}});
				});
			}
		},
		tools : {
			buttons: isOCC ? ["refresh"] : ["refresh", "create", "delete"]
		},
		listen : isOCC? {} : {
			createItem : createFn,
			deleteItems : deleteFn
		}
	});
}
/*绑定分区地图切换对于class的操作*/
function toggleClass(el){
	jQuery(".grid-navbar").removeClass("chooseBar");
	jQuery(el).addClass("chooseBar");
	jQuery("#Grid").toggleClass("showMap");
	jQuery("#body").toggleClass("disable-scroll");
}
globalActionConfig([
	["zone.add", function(params, el, evt){TCM.TreeDialog.addZone(params, el, CurrentSite);}],
	["zone.delete", function(params, el, evt){TCM.TreeDialog.deleteZone(params, el);}],
	["zone.edit", function(params, el, evt){TCM.TreeDialog.editZone(params,el, CurrentSite);}],
	["show.grid", function(params, el, evt){
		toggleClass(el);
		var $this = jQuery(el);
		createZoneGrid({
			types: $XD.dataAttr(el, "types").split(","),
			siteId: $XD.dataAttr(el, "siteid"),
			zoneId: $XD.dataAttr(el, "zoneid"),
			name: $this.html().slice(0, -2)
		});
	}],
	["show.map", function(params, el, evt){
		var zoneId = $XD.dataAttr(el, "zoneid");
		if(!zoneId)
			return nvAlert("请先添加分区，再查看地图信息！");
		toggleClass(el);
		jQuery(".nvgrid-tools").remove();
		jQuery(".nvgrid-foot").remove();
		var zoneMap = new TCM.Lib.Map(jQuery(".nvgrid-body").get(0), {
			siteId: $XD.dataAttr(el, "siteid"),
			zoneId: zoneId
		}, isOCC);
		zoneMap.show();
	}]
]);

var DeviceGridCfgs = {
	"all" : {columns: "devType,devName,devDesc"},
	"server" : {columns: "devType,devName,devIp,devVersion,devDesc"},
	"storage" : {columns: "devName,devManageIp,devPort,devdiskNum,devCapacity,devDesc"},
	"IPC" : {columns: "devType,devName,Provider,Style,devIp,devPort,devDesc"},
	"camera" : {columns: "devType,devName,devProvider,devStyle,devDesc"},
	"pickup" : {columns: "devType,devName,devProvider,devStyle,devDesc"},
	"coder" : {columns: "devName,Provider,Style,devIp,devPort,devChannelNum,devDesc"},
	"decoder" : {columns: "devName,Provider,Style,devIp,devPort,devChannelNum,devDesc"},
	"spliter" : {columns: "devName,Provider,Style,devMaxWindow,devDesc"},
	"monitor" : {columns: "devName,devProvider,devStyle,devDesc"},
	"terminal" : {columns: "devName,devIp,devDesc"},
	"vdm" : {columns: "devName,Provider,Style,devDesc"},
	"other" : {columns: "devType,devName,devProvider,devStyle,devPath,devDesc"}
};
/*设备管理tree的点击事件*/
function deviceTreeClick(params){
	var types = IX.map(params.keys.split(","),function(type){return Number(type);});
	var gridCfgType = TCM.DeviceType.getNodeName(types[0]);
	if(types.length > 6)
		gridCfgType = "all";
	if(params.siteId == CurrentSite.id)
		isHandle = true;
	else
		isHandle = false;
	createDeviceGrid(DeviceGridCfgs[gridCfgType], {
		types: types,
		siteId: params.siteId,
		name: params.name + "列表",
		el: params.el
	});
}
/*分区管理tree的点击事件*/
function zoneTreeClick(params){
	var types = IX.map(params.keys.split(","),function(type){return Number(type);});
	createZoneGrid({
		types: types,
		siteId: params.siteId,
		zoneId: params.zoneId,
		name: IX.encodeTXT(params.name)
	});
	jQuery("#body").removeClass("disable-scroll");
}
/*构造设备tree节点数据，供tree组件使用*/
function parseTree(treeInfo, countHT, siteId) {
	function getTreeNode(_treeNodes){
		return IX.map(_treeNodes, function(treeNode){
			return IX.inherit(treeNode, getAttr(treeNode));
		});
	}
	function getAttr(treeNode){
		if(treeNode.key)
			return {
				key : treeNode.key,
				count : countHT[treeNode.key[0]] ? countHT[treeNode.key[0]] : 0,
				siteId : siteId,
				nodes : []
			};
		var arr = [], count = 0;
		var nodes = treeNode.nodes === 0 ? [] : getTreeNode(treeNode.nodes);
		for (var i = 0; i < nodes.length; i++) {
			arr = arr.concat(nodes[i].key);
			count += nodes[i].count;
		}
		return {
			key : arr,
			count : count,
			siteId : siteId,
			nodes : nodes
		};
	}
	if(isOCC)
		return getTreeNode(treeInfo).pop();
	return {nodes : getTreeNode(treeInfo)};
}
/*构造tree基础节点*/
function getLeafInfo(arr){
	return IX.map(arr, function(item, idx){
		return {name: deviceNames[item], key: [item]};
	});
}
var TreeInfo = [
{name : "",  nodes : [
	{name : '服务器', nodes : getLeafInfo([1, 2, 3])},
	getLeafInfo([10])[0],
	{name : '数字摄像机', nodes : getLeafInfo([20, 21, 22])},
	{name : '模拟摄像机', nodes : getLeafInfo([31, 32, 33])},
	{name : '拾音器', nodes : getLeafInfo([40, 41])},
	getLeafInfo([50])[0],
	getLeafInfo([51])[0],
	getLeafInfo([52])[0],
	getLeafInfo([53])[0],
	getLeafInfo([54])[0],
	getLeafInfo([65])[0],
	{name : '网络和附属设备', nodes : getLeafInfo([60, 61, 62, 63, 64, 90])}
]}];
var CurrentOne = {name: "", nodes: [
	{name : '服务器', nodes : getLeafInfo([0, 1, 2, 3])},
	getLeafInfo([10])[0],
	getLeafInfo([51])[0],
	getLeafInfo([53])[0],
	getLeafInfo([54])[0],
	{name : '网络和附属设备', nodes : getLeafInfo([60, 61, 62, 63, 64, 90])}
]};
/*通过设备回调函数，获得tree的显示*/
function getDevices(cbFn){
	deviceCaller("getAllDevices", {}, function(data){
		if(isOCC){
			var arrCount = IX.map(data, function(site, idx){
				var countHT = {};
				IX.iterate(site.devices, function(device){
					countHT[device.type] = device.count;
				});
				var lineSite = TCM.LineInfo.getSites().get(site.siteId);
				var arr = [];
				if(lineSite.type == 1){
					arr = [IX.inherit(CurrentOne, {name: lineSite.name})];
				}else{
					TreeInfo[0].name = lineSite.name;
					arr = TreeInfo;
				}
				return parseTree(arr, countHT, site.siteId);
			});
			cbFn({nodes : arrCount});
		}else{
			TreeInfo[0].name = CurrentSite.name;
			var countHT = {},site = {};
			IX.iterate(data, function(obj){
				site = obj;
				IX.iterate(obj.devices, function(device){
					countHT[device.type] = device.count;
				});
			});
			cbFn(parseTree(TreeInfo, countHT, site.siteId));
		}
	});
}
/*构造分区tree节点数据，供tree组件使用*/
function getZoneNode(data, siteName){
	var siteId = data.siteId;
	var nodeList = IX.map(data.zones, function(zone){
		var zoneId = zone.id;
		var total = zone.total;
		var zoneTreeInfo = [
			{name: "枪机", key:[20,31], count: total.fixed},
			{name: "半球", key:[21,32], count: total.semi},
			{name: "球机", key:[22,33], count: total.sphere}
		];
		return {
			name: zone.name,
			key: [20,21,22,31,32,33],
			count: total.fixed + total.semi + total.sphere,
			zoneId: zoneId,
			siteId: siteId,
			nodes: IX.map(zoneTreeInfo, function(data){
				return IX.inherit(data,{
					zoneId: zoneId,
					siteId: siteId,
					nodes:[]
				});
			})
		};
	});
	return {
		name: siteName,
		nodes: nodeList
	};
}
/*通过分区回调函数，获得tree的显示*/
function getCamerasZone(cbFn){
	deviceCaller("getAllZones", {}, function(data){
		var allSites = TCM.LineInfo.getSites();
		if (isOCC)
			cbFn({
				nodes: IX.loop(data, [], function(acc, item){
					if (CurrentSite.id != item.siteId)
						acc.push(getZoneNode(item, allSites.get(item.siteId).name));
					return acc;
				})
			});
		else
			cbFn({nodes: [getZoneNode(data.pop(), CurrentSite.name)]});
	});
}
/*Tree初始化节点显示*/
function showTreeNode(){
	if(isOCC){
		jQuery(".nv-tree>ul>li>ul>li").children("ul").hide();
		jQuery(".nv-tree>ul>li").children('ul').hide();
	}else{
		jQuery(".nv-tree>ul>li>ul>li").children("ul").hide();
	}
	jQuery(".nv-tree>ul>li>a span.count").hide();
}
/*展示设备管理页面*/
function showDeviceList(cbFn){
	getDevices(function(_cfg){
		var cfg = IX.inherit(_cfg, {
			htmlFn : function(node) {
				return '<span class="nodeName" title='+IX.encodeTXT(node.name)+'>'+IX.encodeTXT(node.name)+'</span>'+'<span class="count">('+node.count+')</span>';
			},
			click : deviceTreeClick
		});
		var tree = new TCM.Lib.Tree(cfg);
		$X('body').innerHTML = t_info.renderData("", {
			treeName : isOCC? "线路设备列表" : "单位设备列表",
			treeData : tree.getHTML(),
			addZone : "",
			showZone : ""
		});
		showTreeNode();
		if(isOCC){
			jQuery("[data-name="+CurrentSite.name+"]").find("span").each(function(index, el) {
				if(index === 0 || index === 2)
					this.click();
			});
		}else{
			var span = jQuery(".nv-tree li:first a:first span.count");
			span.parents("li").removeClass("expand").addClass("fold");
			span.click();
		}
		jQuery("#body").removeClass("disable-scroll");
	});
	cbFn();
}
/*展示分区管理页面*/
function showZoneList(cbFn){
	getCamerasZone(function(_cfg){
		var cfg = IX.inherit(_cfg, {
			htmlFn : function(node) {
				var deleteZone = isOCC ? "" :
					(node.zoneId && node.nodes.length == 3 ? '<a class="deleteZone r" data-href="$zone.delete" data-key="'+node.zoneId+'"></a><a class="editZone r" data-href="$zone.edit" data-key="'+node.zoneId+'"></a>' : "");
				return '<span class="nodeName" title='+IX.encodeTXT(node.name)+'>'+IX.encodeTXT(node.name)+'</span>'+'<span class="count">('+node.count+')</span>'+deleteZone;
			},
			click : zoneTreeClick
		});
		var tree = new TCM.Lib.Tree(cfg);
		$X('body').innerHTML = t_info.renderData("", {
			treeName : isOCC? "线路分区列表" : "单位分区列表",
			treeData : tree.getHTML(),
			addZone : isOCC ? "" : t_addZone.renderData("",{}),
			showZone : "showZone"
		});
		showTreeNode();
		var span = jQuery(".nv-tree li:first li:first a:first span.count");
		if(span.length === 0){
			zoneTreeClick({keys: "20,21,22,31,32,33",name: "", zoneId: "", siteId : CurrentSite.id});
		}else{
			span.click();
			if(!isOCC)
				jQuery(span.parents("li")[1]).removeClass("expand").addClass("fold");
			else
				jQuery(".nv-tree>ul>li>a>.pic-expand").get(0).click();
		}
	});
	cbFn();
}

var t_videoEdit = new IX.ITemplate({tpl: [
'<ul class="videoWallEdit">',
	'<li><span class="label">监视器</span>{relatedMonitor}</li>',
	'<li><span class="label">关联的设备类型</span>{relatedSD}</li>',
	'<li><span class="label choose">关联设备</span>{relatedSDR}</li>',
'</ul>',
'']});

var t_page = new IX.ITemplate({tpl: [
'<div id="Tree" class="{clz}"><div id="treeName">{treeName}</div>{tree}</div>',
'<div id="show-plan" class="nv-box">',
	'<div class="nv-title">电视墙</div>',
	'<ul class="store-plans"></ul>',
'</div>',
'']});

var t_showPlan = new IX.ITemplate({tpl: [
	'<tpl id="plans">',
		'<li class="{hasClz}"><a data-href="$video.edit" data-key="{id}">',
			'<div class="pic-">',
				'<div><span class="label">监视器：</span><span>{monitorName}</span></div>',
				'<div><span class="label">(厂家 型号)：</span><span title="{monitorProvider} {monitorStyle}">{monitorProvider} {monitorStyle}</span></div>',
				'<div><span class="label">{relatedName}</span><span>{machineName}</span></div>',
				'<div><span class="label">(厂家 型号)：</span><span title="{machineProvider}">{machineProvider}</span></div>',
			'</div>',
		'</a><a class="pic-del" data-href="$video.delete" data-key="{id}">',
		'</a></li>',
	'</tpl>',
	'<li class="{clz}"><a data-href="$video.add">',
		'<div class="pic-"></div>',
		'<div class="name">添加电视墙</div>',
	'</a></li>',
'']});


var videoWallHT = new IX.IListManager();
/*电视墙的添加和修改dialog显示*/
function _show(site, okFn, data, isEdit){
	if (isEdit) {
		data.notRelatedMonitor.unshift(data.monitor);
		if(data.spliter.id)
			data.notRelatedSpliter.unshift(data.spliter);
		if(data.decoder.id)
			data.notRelatedDecoder.unshift(data.decoder);
	}
	if (!isEdit && data.notRelatedMonitor.length === 0)
		return nvAlert("请添加监视器后再添加电视墙！");
	if (!isEdit && isOCC && data.notRelatedDecoder.length === 0)
		return nvAlert("没有可用的解码器！");
	if (!isEdit && data.notRelatedSpliter.length === 0 && data.notRelatedDecoder.length === 0)
		return nvAlert("没有可用的画面分割器或解码器！");
	function comboHTML(caller, name, items){
		return getComboHTML(caller, {
			value: name.id || "",
			valueText: name.name || "",
			items: IX.map(items, function(item){
				return {
					id: item.id,
					name: item.name
				};
			})
		});
	}
	spliterHTML = comboHTML("device_spliter", data.spliter, data.notRelatedSpliter);
	decoderHTML = comboHTML("device_decoder", data.decoder, data.notRelatedDecoder);
	var SDR = null;
	if (isEdit && data.spliter.id)
		SDR = spliterHTML;
	else
		SDR = decoderHTML;
	var items = [{
		id: 1,
		name: "画面分割器",
		action : "pick.one"
	},{
		id: 2,
		name: "解码器",
		action : "pick.one"
	}];
	var html = t_videoEdit.renderData("", {
		relatedMonitor: comboHTML("device_monitor", data.monitor, data.notRelatedMonitor),
		relatedSD: getComboHTML("device_choose", {
			value : data.spliter.id? 1: 2,
			valueText : data.spliter.id? "画面分割器": "解码器" ,
			items : isOCC? [items[1]]: items
		}),
		relatedSDR: SDR
	});
	function _okFn(){
		if(!isHandle)
			return;
		var inputData = {};
		inputData.monitor = $X("device_monitor").value;
		inputData.spliter = $X("device_spliter") ? $X("device_spliter").value : "";
		inputData.decoder = $X("device_decoder") ? $X("device_decoder").value : "";
		if(inputData.monitor==="")
			return nvAlert("请选择相应的监视器！");
		else if(inputData.spliter===""&&inputData.decoder==="")
			return nvAlert("监视器至少关联一个解码器或画面分割器！");
		inputData.id = data.id ? data.id : "";
		deviceCaller(isEdit ? "editVideoWall" : "addVideoWall", inputData, function(result){
			okFn(result);
			hideDialog();
		});
	}
	showDialog({
		clz : "video-edit",
		title : isHandle ? (data ? "编辑电视墙" : "新增电视墙") : "查看电视墙",
		content : html,
		listen : {ok : _okFn}
	});
	if (isOCC) {
		var $button = jQuery("#device_choose_combo");
		$button.attr("data-toggle", "");
		$button.find(".pic-").hide();
	}
	if(!isHandle){
		jQuery(".content").find("button").each(function(){jQuery(this).attr("data-toggle", "");});
		jQuery(".content").find(".pic-").each(function(){jQuery(this).hide();});
		jQuery(".btn.okbtn").hide();
	}
}
function _editVideo(video, okFn){
	var isEdit = video !== null;
	deviceCaller("getVideoWall", isEdit?{id : video.id}:{}, function(data){
		_show(CurrentSite, okFn, data, isEdit);
	});
}
/*获取电视墙显示数据*/
function getVideoTpldata(video){
	var c = video.spliter || video.decoder;
	return IX.inherit(video, {
		monitorName : video.monitor.name,
		monitorProvider : video.monitor.provider?video.monitor.provider:"",
		monitorStyle : video.monitor.style?video.monitor.style:"",
		machineName : c.name || "",
		machineProvider : TCM.Device.getDriver(c.driverId).provider+" "+TCM.Device.getDriver(c.driverId).style || "",
		relatedName : c.type == 52 ? "画面分割器：" : "解码器："
	});
}
globalActionConfig([["video.add", function(params, el){
	_editVideo(null, function(video){
		videoWallHT.register(video.id, video);
		video.hasClz = "hasHover";
		var html = t_showPlan.renderData("plans", getVideoTpldata(video));
		jQuery(html).insertBefore(el.parentNode);
	});
}], ["video.edit", function(params, el){
	var videoId = params.key;
	var video = videoWallHT.get(videoId);
	if (!video)
		return;
	_editVideo(video, function(_video){
		videoWallHT.register(video.id, _video);
		_video.hasClz = "hasHover";
		var html = t_showPlan.renderData("plans", getVideoTpldata(_video));
		el.parentNode.innerHTML = html.substring('<li class="hasHover">'.length, html.length-"</li>".length);
	});
}], ["video.delete", function(params, el){
	if(!isHandle)
		return;
	var videoId = params.key;
	var video = videoWallHT.get(videoId);
	if (!video)
		return;
	confirmDialog("删除电视墙", "请确认是否删除此电视？",  function(cbFn){
		deviceCaller("deleteVideoWall", {ids : [video.id]}, function(){
			videoWallHT.remove(videoId);
			var liEl = el.parentNode;
			liEl.parentNode.removeChild(liEl);
			hideDialog();
		});
	});
}], ["pick.one", function(params, el){
	var id = params.key, name = el.innerHTML;
	var dropdownEl = $XH.ancestor(el, "dropdown");
	if (!dropdownEl) return;
	var inputEl = $XD.first(dropdownEl, "input");
	inputEl.value = id;
	var nameEl = $XH.first($XH.first(dropdownEl, "dropdown-toggle"), "name");
	nameEl.innerHTML = name;
	var $chooseEl = jQuery(".choose");
	$chooseEl.next().remove();
	if(id == "1")
		jQuery(spliterHTML).insertAfter($chooseEl);
	else
		jQuery(decoderHTML).insertAfter($chooseEl);
}]]);
/*展示电视墙*/
function showWall(params, isHandle){
	deviceCaller("getVideoWalls", params, function(videos){
		var tpldatas = IX.map(videos, function(video){
			videoWallHT.register(video.id, video);
			return getVideoTpldata(video);
		});
		jQuery("#show-plan").find(".store-plans").get(0).innerHTML = t_showPlan.renderData("", {
			plans : isHandle ? IX.map(tpldatas, function(tpldata){
				tpldata.hasClz = "hasHover";
				return tpldata;
			}) : tpldatas,
			clz : isHandle ? "add" : "notOCC"
		});
	});
}
/*中心时候显示的电视墙tree*/
function getOCCTreeHTML(){
	var nodes = IX.loop(TCM.LineInfo.getSites().getAll(), [], function(acc, site, idx){
		if(site.type !== 0 && site.type !== 4 && site.type !== 5 && site.type !== 6)
			acc.push({name : site.name, key: site.id, nodes: []});
		return acc;
	});
	var treeCfg = IX.inherit({nodes : [{name : TCM.LineInfo.getName(), nodes : nodes}]}, {
		htmlFn : function(node){return '<span class="nodeName">'+node.name+'</span>';},
		click : function(params, el){
			var id = params.keys;
			if(id == CurrentSite.id)
				isHandle = true;
			else
				isHandle = false;
			showWall({siteId : id}, isHandle);
		}
	});
	return new TCM.Lib.Tree(treeCfg).getHTML();
}
/*电视墙加载完成后的缩放函数绑定*/
function resizeFn(){
	var height = jQuery("#show-plan").height();
	jQuery("#Tree").css("height", height + "px");
	jQuery(".nv-tree").css("height", height - 55 + "px");
}
/*展示电视墙页面*/
function showVideoWall(cbFn){
	videoWallHT.clear();
	if(isOCC){
		var treeHTML = getOCCTreeHTML();
		$X('body').innerHTML = t_page.renderData("", {
			treeName: "单位列表",
			clz: "",
			tree: treeHTML
		});
		showTreeNode();
		jQuery("#Tree").find("span.nodeName").each(function(){
			if(this.innerHTML == CurrentSite.name)
				this.click();		
		});
		jQuery(".nv-tree a:first span:first").click();
		resizeFn();
		$Xw.bind({"resize": resizeFn});
	}else{
		isHandle = true;
		$X('body').innerHTML = t_page.renderData("", {
			treeName: "",
			clz: "notOCC",
			tree: ""
		});
		showWall({}, isHandle);
	}
	cbFn();
}

IX.ns("TCM.Device");
TCM.Device.init = function(pageCfg, pageParams, cbFn){
	/*页面加载时获取driver，供设备使用*/
	if(!drivers){
		deviceCaller("getDriver", {}, function(data){
			drivers = data;
			IX.iterate(data, function(item, idx){
				var obj = {};
				obj.id = item.id;
				obj.provider = item.provider + "-" + item.style;
				if(!driverHT[item.type])
					driverHT[item.type] = [obj];
				else
					driverHT[item.type].push(obj);
			});
		});
	}
	CurrentSite = TCM.Env.getSession().getCurrentSite();
	isOCC = TCM.Env.getSession().getCurrentSiteType() == 1 ? true : false;
	switch(pageCfg.name){
	case "device-list":
		showDeviceList(cbFn);
		break;
	case "device-zone":
		showZoneList(cbFn);
		break;
	case "device-video":
		showVideoWall(cbFn);
	}
};
/*公开driver供dialog页面使用*/
TCM.Device.getDriver4Type = function(type){
	return driverHT[type];
};
TCM.Device.getDriver = function(id){
	for (var i = 0; i < drivers.length; i++) {
		if(id == drivers[i].id)
			return drivers[i];
	}
};
})();
(function () {
var storeCaller = TCM.Global.storeCaller;
var globalActionConfig = IXW.Actions.configActions;

var showDialog = NV.Dialog.show;
var hideDialog = NV.Dialog.hide;
var confirmDialog = NV.Dialog.confirm;
var nvAlert = NV.Dialog.alert;

var getComboHTML = NV.Lib.getComboHTML;
/*
	定义常量，开始时间段，结束时间段，天数，周期。
 */
var ComboTime = (function(){
	var count = 0;
	var arr = [];
	for (var i = 0; i < 9; i++) {
		var value = count < 10 ? "0"+count+":00" : count+":00";
		arr.push({
			id: value,
			name: value
		});
		count += 3;
	}
	return arr;
})();
function getConstant4Array(arr){
	return IX.map(arr, function(c){
		return IX.inherit(c, {action: "store.pick"});
	});
}
var FromComboItem = getConstant4Array(ComboTime.slice(0, ComboTime.length-1));
var ToComboItem = getConstant4Array(ComboTime.slice(1, ComboTime.length));
var DaysComboItem = [{id : "all", name : "全周"}].concat(IX.map(TCM.Const.Days, function(day, idx){
	return {id: idx, name: day};
}));
var CircleComboItem = getConstant4Array(IX.map([7, 15, 30], function(c){
	return {id: c, name: c+"天"};
}));


var t_leafItem = new IX.ITemplate({tpl: [
'<div class="leaf item">',
	'<a class="nv-checkbox {chkClz}" data-type="{type}" data-href="${action}" data-key="{id}">',
		'<span class="ixpic-"></span><span class="text">{name}</span></a>',
'</div>',
'']});
var t_showCamera = new IX.ITemplate({tpl: [
	'<tpl id="types">',
		'<div class="node {clz}">','<tpl id="items">',
			t_leafItem.getTpl(),
		'</tpl>','</div>',
	'</tpl>',
'']});

var t_addCamera = new IX.ITemplate({tpl: [
	'<tpl id="types">',
		'<div class="leaf type">',
			'<a class="nv-checkbox {chkClz}" data-href="${action}" data-type="{type}">',
				'<span class="ixpic-"></span><span class="text">{name}</span></a>',
			'<a class="nv-collapse {expClz}" data-href="$camera.expand">',
				'<span class="pic-"></span></a>',
		'</div>',
		'<div class="node type-cameras {clz}">','<tpl id="items">',
			t_leafItem.getTpl(),
		'</tpl>','</div>',
	'</tpl>',
'']});

var DevTypes = TCM.Const.DeviceTypes;
var DevNames = ["枪机", "球机", "半球机"];
//判断摄像机类型
function getTypeIdx(cameraType){
	switch(cameraType){
	case DevTypes.IPCFixed:
	case DevTypes.CameraFixed: return 0;
	case DevTypes.IPCSphere:
	case DevTypes.CameraSphere: return 1;
	case DevTypes.IPCSemiSphere:
	case DevTypes.CameraSemiSphere: return 2;
	}
	return 0;
}
//根据摄像机类型进行分类
function getTypes(cameras){
	var types = [[],[],[]]; // 0 :枪机， 1:球机， 2:半球机
	IX.iterate(cameras, function(c){
		var typeIdx = getTypeIdx(c.type);
		types[typeIdx].push({
			action : "cameras.move",
			chkClz : c.selected? "selected": "",
			id : c.id,
			name : c.name,
			type : c.type
		});
	});
	return types;
}
//获取tree中type的显示数据
function getTypeData(types){
	return IX.loop(types, [], function(acc, typeData, idx){
		if (typeData.length===0) return acc;
		acc.push({
			clz : "show-cameras"+idx,
			items : typeData
		});
		return acc;
	});
}
function getCamera4HTML(cameras){
	var types = getTypes(cameras);
	var typeData = getTypeData(types);
	return t_showCamera.renderData("", {
		types: typeData
	});
}
function getMonitor4HTML(monitors, allMonitors){
	var types = [[]]; 
	IX.iterate(allMonitors, function(c){
		types[0].push({
			chkClz: IX.loop(monitors, [], function(acc, item){
				if (item.id == c.id)
					acc.push("selected");
				return acc;
			}).pop(),
			action : "cameras.move",
			id : c.id,
			name: c.name
		});
	});
	var typeData = getTypeData(types);
	return t_showCamera.renderData("", {
		types: typeData
	});
}
//判定trigger中的摄像机总类上的选中状态
function getStatus(arr){
	var count = 0;
	IX.iterate(arr, function(c, idx){
		if (c.chkClz)
			count++;
	});
	if (arr.length === count)
		return "selected";
	else if (count === 0)
		return "";
	else
		return "part";
}
function getCameraTpldatData4Cameras(cameras){
	var types = getTypes(cameras);
	return IX.loop(types, [], function(acc, typeData, idx){
		if (typeData.length===0) return acc;
		acc.push({
			clz : "cameras"+idx,
			action : "cameras.move",
			chkClz : getStatus(typeData),
			expClz : "expanded",
			type: idx,
			name : DevNames[idx],
			items : typeData
		});
		return acc;
	});
}
//trigger中的摄像机显示HTML
function getCamera4TypesHTML(cameras){
	var typeData = getCameraTpldatData4Cameras(cameras);
	return t_addCamera.renderData("", {
		types: typeData
	});
}


var t_edit = new IX.ITemplate({tpl: [
'<div class="dialogHead">',
	'<span class="title_1"><span class="label">单位</span><input disabled value="{siteName}"></span>',
	'<span class="title_1"><span class="label">名称</span><input id="plan_name" value="{plan_name}"></span>',
'</div>',
'<a class="camera-move" data-href="$cameraPanel.hide"></a>',
'<div class="plan-content">',
	'<div class="lt">',
		'<h3><span class="label">录像时间计划表</span></h3>',
		'<ul>',
			'<li class="days-choose"><span class="label">日期计划</span>',
				'<a id="daysName" class="daysCombo" data-href="$store.popDays">',
					'<tpl id="dayitems">','<div id="day{id}" class="day {clz}" data-key="{id}">',
						'<span class="text">{name}</span><span class="delete-day"></span></div>',
					'</tpl>',
					'<span class="pic-"></span>',
				'</a>',
			'</li>',
			'<li class="circle"><span class="label">保存周期</span>{circleCombo}</li>',
			'<li>',
				'<span class="label">录像时间</span>',
				'<span class="time-rt">',
					'<span class="time">{fromCombo}</span>',
					'<span class="separator">--</span>',
					'<span class="time">{toCombo}</span>',
				'</span>',
			'</li>',
		'</ul>',
		'<h3><span class="label">当前单位的存储服务器</span></h3>',
		'<div id="storages">','<tpl id="ss">',
			'<a class="nv-checkbox {clz}" data-href="$store.checkToggle" data-key="{id}">',
				'<span class="ixpic-"></span><span>{name}</span></a>',
		'</tpl>','</div>',
	'</div>{showDevices}',
	'<div id="caseCameraPanel"><h3><span class="label">未分配录像的摄像机</span></h3></div>',
'</div>',
'']});

var t_showCameras = new IX.ITemplate({tpl: [
'<div class="useCamera">',
	'<h3><span class="label">已在录像的摄像机</span></h3>',
	'<div class="showCamera">{showCamera}</div>',
	'<a class="more" data-href="$store.addCamera">',
		'<span class="add-camera">新增需要录像的摄像机</span>',
		'<span class="add"></span>',
	'</a>',
'</div>',
'']});

var t_showMonitors = new IX.ITemplate({tpl: [
	'<h3><span class="label">已在录像的监视器</span></h3>',
	'<div class="showMonitor">{showMonitor}</div>',
'']});

var t_dropdownMenu = new IX.ITemplate({tpl: [
	'<div class="node">',
		'<a class="nv-checkbox {clz}" data-href="$store.checkAll" data-key="all">',
			'<span class="ixpic-"></span><span class="text">{name}</span></a>',
	'</div>','<tpl id="items">',
		'<div class="leaf ">',
			'<a class="nv-checkbox {clz}" data-href="$store.checkOne" data-key="{id}">',
				'<span class="ixpic-"></span><span class="text">{name}</span></a>',
		'</div>',
	'</tpl>',
'']});

var isOCC = null;
var CurrentSite = null;
var isHandle = null;

var planData = null; //VM对象
var caseDaysPanel = null;
var caseCameraPanel = null;
//day的trigger显示是否选中
function getSelect(ids, arr){
	return IX.map(arr, function(o){
		return IX.inherit(o, {
			clz : IX.Array.isFound(o.id, ids) ? "selected" : ""
		});
	});
}
function getIds4Array(key){
	return IX.map(key, function(item){ return item.id;});
}
//获取未分配的这相机显示
function CaseCameraPanel(planData){
	var divEl = $X("caseCameraPanel");
	if (!$XH.first(divEl, "type")) {
		jQuery(divEl).append(jQuery('<div>'+planData.cameraRefreshHTML()+'</div>'));
		IX.bind(divEl, {
			click : function(e){
				if ($XD.ancestor(e.target, "a")) return;
				var el = $XH.ancestor(e.target, "type");
				$XH.toggleClass(el, "expanded");
				jQuery(el).find(".nv-collapse").toggleClass("expanded");
			}
		});
	}
	return {
		show : function(){
			divEl.style.display = "block";
			jQuery(".camera-move").css("display", "block");
			jQuery(".plan-content").css("left", "-330px");			
		},
		hide : function(){
			divEl.style.display = "none";
			jQuery(".camera-move").css("display", "none");
			jQuery(".plan-content").css("left", "50px");
		}
	};
}

//构造Plan类，用于dialog显示的数据，以及操作对数据的改变和维护
function PlanVM(data, result){
	var BasePlan = {
		days : "all",
		circle : 30,
		from : "00:00",
		to : "24:00",
		storages : []
	};
	var	plan = IX.inherit(BasePlan, {siteId: CurrentSite.id}, data,
		data.storages ? {storages: getIds4Array(data.storages)} : [], 
		isOCC? {monitors: data.monitors ? getIds4Array(data.monitors) : []} : {cameras: data.cameras ? getIds4Array(data.cameras) : []});
	//星期下拉的trigger
	caseDaysPanel = new IXW.Lib.PopTrigger({
		id : "caseDaysPanel",
		ifKeepPanel : function(target){
			return !!$XH.ancestor(target, "days-choose");
		},
		bodyRefresh : function(bodyEl, triggerEl){
			var _value = planData.getPlanDays();
			var daysItems = DaysComboItem.slice(1, DaysComboItem.length);
			bodyEl.innerHTML = t_dropdownMenu.renderData("",{
				clz : _value == "all"? "selected": "",
				name : "全周",
				items : getSelect(_value == "all"? "0123456".split(""): _value, daysItems)
			});
		}
	});
	function refreshDay4One(value, ifChecked){
		var $daysName = jQuery("#daysName");
		var $caseDaysPanel = jQuery("#caseDaysPanel");
		var $dayall = jQuery("#dayall");
		if (ifChecked) {
			if (plan.days.length !== 7) 
				$daysName.find('[data-key="'+value+'"]').addClass("show-day");
			else {
				plan.days = "all";
				$caseDaysPanel.find('[data-key="all"]').addClass("selected");
				$daysName.find(".day").removeClass("show-day");
				$dayall.addClass("show-day");
			}
		} else {
			if (plan.days.length === 6) {
				$caseDaysPanel.find('[data-key="all"]').removeClass("selected");
				$daysName.find(".day").addClass("show-day");
			}
			$caseDaysPanel.find('[data-key="'+value+'"]').removeClass("selected");
			$daysName.find('[data-key="'+value+'"]').removeClass("show-day");
			$dayall.removeClass("show-day");
		}
		caseDaysPanel.setPos();
	}
	//操作星期时对于数据的操作和DOM的操作
	function _setDays(value, isAdd){
		if (value === "all") {
			jQuery("#daysName .day").removeClass("show-day");
			jQuery("#dayall")[isAdd? "addClass": "removeClass"]("show-day");
			jQuery("#caseDaysPanel .nv-checkbox")[isAdd? "addClass": "removeClass"]("selected");
			caseDaysPanel.setPos();
			return plan.days = isAdd? "all": null;
		}
		if (isAdd) {
			if (!plan.days)
				plan.days = [value];
			else
				plan.days.push(value);
			refreshDay4One(value, isAdd);
		} else {
			if (Array.isArray(plan.days))
				plan.days = IX.Array.remove(plan.days, value);
			else 
				plan.days = IX.Array.remove([0,1,2,3,4,5,6], value);
			refreshDay4One(value, isAdd);
		}
	}
	//修改plan的一些值为数组的属性
	function _setArr(key, value, isAdd){
		if (isAdd)
			plan[key].push(value);
		else
			plan[key] = IX.Array.remove(plan[key], value);
		if (key == "cameras") {
			IX.iterate(result.cameras, function(c, idx){
				if (c.id == value)
					c.selected = isAdd;
			});
		}
	}
	//获取提交给后台的数据，并验证是否符合提交格式
	function _getData(){
		if (!plan.days || plan.days.length === 0) {
			nvAlert("日期计划不能为空！");
			return false;
		}
		if (plan.to <= plan.from) {
			nvAlert("录像开始时间必须小于结束时间！");
			return false;
		}
		if (plan.storages.length === 0) {
			nvAlert("存储服务器不能为空！");
			return false;
		}
		if (isOCC && plan.monitors.length === 0) {
			nvAlert("监视器不能为空！");
			return false;
		}
		if (!isOCC && plan.cameras.length === 0) {
			nvAlert("摄像机不能为空！");
			return false;
		}
		return plan;
	}
	function getNameByIdInArray(arr, name){
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].id == name)
				return arr[i].name;
		}
		return "";
	}
	function getCombo(id, key, value, items){
		return getComboHTML(id, {
			value: key,
			valueText: value,
			items: items
		});
	}
	function getSelectDay(ids, days){
		return IX.loop(days, [], function(acc, day){
			if (ids == "all" && ids == day.id)
				day = IX.inherit(day, {clz: "show-day"});
			else {
				IX.iterate(ids, function(id){
					if(id == day.id)
						day = IX.inherit(day, {clz: "show-day"});
				});
			}
			acc.push(day);
			return acc;
		});
	}
	//获取dialog的显示数据
	function getTplData(){
		var cricleValue = getNameByIdInArray(CircleComboItem, plan.circle) || "30";
		var fromValue = getNameByIdInArray(FromComboItem, plan.from) || "00:00";
		var toValue = getNameByIdInArray(ToComboItem, plan.to) || "24:00";
		function getShowDevicesHTML(){
			if (isOCC && isHandle) {
				var monitors = data ? data.monitors: [];
				return t_showMonitors.renderData("",{
					showMonitor: getMonitor4HTML(monitors, monitors.concat(result.monitors))
				});
			} else {
				return t_showCameras.renderData("",{
					showCamera: getCamera4HTML(data ? IX.map(data.cameras, function(c){ 
						return IX.inherit(c, {selected: true});
					}) : [])
				});
			}
		}
		return {
			siteName : CurrentSite.name,
			plan_name : plan.name,
			circleCombo : getCombo("plan_circle", plan.circle, cricleValue, CircleComboItem),
			dayitems : getSelectDay(plan.days, DaysComboItem),
			fromCombo : getCombo("plan_from", plan.from, fromValue, FromComboItem),
			toCombo : getCombo("plan_to", plan.to, toValue, ToComboItem),
			ss : getSelect(plan.storages, result.storages),
			showDevices : getShowDevicesHTML()
		};
	}
	return {
		getTplData: getTplData,
		setProperty : function(key, value){ plan[key] = value;},
		setDays : _setDays,
		setArr : _setArr,
		getPlanDays : function(){ return plan.days;},
		cameraRefreshHTML : function(){
			var camerasHTML = getCamera4TypesHTML(result.cameras);
			if(!camerasHTML)
				return '<span class="hint">没有未分配的摄像机，请添加摄像机后再试！</span>';
			else
				return camerasHTML;
		},
		getData : _getData
	};
}
//操作单个摄像机的勾选状态对数据和DOM的操作
function checkOne(key, el, isAdd){
	var type = Number($XD.dataAttr(el, "type"));
	var $parent = jQuery(".cameras"+getTypeIdx(type));
	jQuery('[data-key="'+key+'"]')[isAdd? "addClass": "removeClass"]("selected");
	if (isAdd && jQuery('.showCamera [data-key="'+key+'"]').length === 0) {
		var $accept = jQuery(".show-cameras"+getTypeIdx(type));
		if ($accept.length === 0) {
			$accept = jQuery('<div class="node ' +("show-cameras"+getTypeIdx(type))+ '"></div>');
			jQuery(".showCamera").append($accept);
		}
		$accept.append(jQuery(el.parentNode).clone());
	}
	var max = $parent.find(".nv-checkbox").length;
	if (max === 0) return;
	var count = $parent.find(".selected").length;
	var $a = $parent.prev().find(".nv-checkbox");
	if (count === max)
		$a.removeClass("part").addClass("selected");
	else if (count === 0)
		$a.removeClass("part").removeClass("selected");
	else
		$a.removeClass("selected").addClass("part");
}
//操作摄像机总类的勾选状态对数据和DOM的操作
function checkAll(el, isAdd){
	jQuery(el.parentNode).next().find(".nv-checkbox").each(function(){
		var key = jQuery(this).attr("data-key");
		if (isAdd) {
			var parentClass = "show-cameras" + Number($XD.dataAttr(el, "type"));
			var $parent = jQuery("."+parentClass);
			if ($parent.length === 0) {
				$parent = jQuery('<div class="node ' + parentClass + '"></div>');
				jQuery(".showCamera").append($parent);
			}
			if (jQuery('.showCamera [data-key="'+key+'"]').length === 0)
				$parent.append(jQuery(this.parentNode).clone());
		}
		jQuery('[data-key="'+key+'"]')[isAdd? "addClass": "removeClass"]("selected");
		planData.setArr("cameras", key, isAdd);
	});
}
globalActionConfig([["store.pick", function(params, el){
	var id = params.key, name = el.innerHTML;
	var dropdownEl = $XH.ancestor(el, "dropdown");
	if (!dropdownEl) return;
	var inputEl = $XD.first(dropdownEl, "input");
	inputEl.value = id;
	var nameEl = $XH.first($XH.first(dropdownEl, "dropdown-toggle"), "name");
	nameEl.innerHTML = name;
	var key = inputEl.id.split("_")[1];
	planData.setProperty(key, id);
}],["store.checkToggle", function(params, el){
	if (!isHandle) return;
	var ifChecked = !$XH.hasClass(el, "selected");
	$XH[ifChecked? "addClass": "removeClass"](el, "selected");
	planData.setArr("storages", params.key, ifChecked);
}],["store.popDays", function(params, el, evt){
	if (!isHandle) return;
	var elNode = evt.target;
	if ($XH.ancestor(elNode, "day") && $XH.hasClass(elNode, "delete-day"))
		return planData.setDays($XD.dataAttr(elNode.parentNode, "key"), false);
	caseDaysPanel.trigger($X("daysName"));
}],["store.checkAll", function(params, el){
	if (!isHandle) return;
	var ifChecked = !$XH.hasClass(el, "selected");
	$XH[ifChecked? "addClass": "removeClass"](el, "selected");
	planData.setDays("all", ifChecked);
}],["store.checkOne", function(params, el){
	if (!isHandle) return;
	var ifChecked = !$XH.hasClass(el, "selected");
	$XH[ifChecked? "addClass": "removeClass"](el, "selected");
	planData.setDays(params.key, ifChecked);
}],["store.addCamera", function(params, el){
	if (!isHandle) return;
	if (!caseCameraPanel)
		caseCameraPanel = new CaseCameraPanel(planData);
	caseCameraPanel.show();
}],["cameraPanel.hide", function(params, el){
	if (!isHandle) return;
	caseCameraPanel.hide();
}],["cameras.move", function(params, el){
	if (!isHandle) return;
	var ifChecked = !$XH.hasClass(el, "selected");
	$XH[ifChecked? "addClass": "removeClass"](el, "selected");
	if (isOCC) 
		return planData.setArr("monitors", params.key, ifChecked);
	if ($XH.hasClass(el.parentNode, "type")) {
		$XH.removeClass(el, "part");
		checkAll(el, ifChecked);
	} else {
		planData.setArr("cameras", params.key, ifChecked);
		checkOne(params.key, el, ifChecked);
	}
}]]);
//新增和修改Plan时dialog， data用于判断添加/修改
function _showPlanDialog(id, okFn, data){
	storeCaller("getDevices4Plan", {siteId: id}, function(result){
		if (isOCC && result.msg)
			nvAlert(result.msg);
		if (!data.id && result.storages.length === 0)
			return nvAlert("请添加存储服务器后再添加录像计划！");
		if (!data.id && !isOCC && result.cameras.length === 0)
			return nvAlert("请添加摄像机后再添加录像计划！");
		if (!data.id && isOCC && result.monitors.length ===0)
			return nvAlert("请添加监视器后再添加录像计划！");
		caseCameraPanel = null;
		planData = new PlanVM(data, result);
		function _okFn(){
			if (!isHandle) return;
			var params = planData.getData();
			var name = $X("plan_name").value.trim();
			if (!name) 
				return nvAlert("计划名称不能为空！");
			if (!params) return;
			params.name = name;
			var showStorages = IX.loop(result.storages, [], function(acc, storage){
				for (var i = 0; i < params.storages.length; i++) {
					if(params.storages[i] == storage.id)
						acc.push(storage.name);
				}
				return acc;
			});
			storeCaller(data.id ? "editPlan": "addPlan", params, function(showData){
				okFn(data.id ? IX.inherit(params, {storages: showStorages}): showData);
				hideDialog();
			});
		}
		showDialog({
			clz : "store-edit",
			title : isHandle ? (data.id ? "编辑录像计划" : "新增录像计划") : "查看录像计划",
			content : t_edit.renderData("", planData.getTplData()),
			listen : {ok : _okFn}
		});
		if (isOCC)
			jQuery(".title_1").get(0).innerHTML = "控制中心";
		if (!isHandle) {
			var $content = jQuery(".content");
			$content.find("input").each(function(){this.disabled = true;});
			$content.find("button").attr("data-toggle", "");
			$content.find(".pic-").hide();
			$content.find(".delete-day").hide();
			jQuery(".btn.okbtn").hide();
		}
	});
}
//plan的增改操作
function _editPlan(plan, okFn){
	storeCaller("getPlan", {id : plan ? plan.id : -1}, function(data){
		var id = jQuery(".nv-tree .select").attr("data-key") || CurrentSite.id;
		_showPlanDialog(id, okFn, data);
	});
}


var t_page = new IX.ITemplate({tpl: [
'<div id="Tree" class="{clz}"><div id="treeName">{treeName}</div>{tree}</div>',
'<div id="show-plan" class="nv-box">',
	'<div class="nv-title">录像计划</div>',
	'<ul class="store-plans"></ul>',
'</div>',
'']});

var t_showPlan = new IX.ITemplate({tpl: [
	'<tpl id="plans">',
		'<li class="{hasClz}"><a data-href="$store.edit" data-key="{id}">',
			'<div class="pic-">',
				'<div><span class="label">存储服务器：</span><span>{ssNames}</span></div>',
				'<div><span class="label">保存周期：</span><span>{circle}天</span></div>',
				'<div><span class="label">日期计划：</span><span>{days}</span></div>',
				'<div><span class="label">录像时间：</span><span>从{from}至{to}</span></div>',
			'</div>',
			'<div class="name">{name}</div>',
		'</a><a class="pic-del" data-href="$store.delete" data-key="{id}">',
		'</a></li>',
	'</tpl>',
	'<li class="{clz}"><a data-href="$store.add">',
		'<div class="pic-"></div>',
		'<div class="name">添加录像计划</div>',
	'</a></li>',
'']});


var planHT = new IX.IListManager();
//获取页面显示的plan数据
function getPlanTpldata(plan){
	var planDays = plan.days;
	if (plan) {
		return IX.inherit(plan, {
			days : planDays == "all"? "全周": IX.map(planDays, function(n){
				return TCM.Const.Days[n] || "";
			}).join(),
			ssNames : Array.isArray(plan.storages)? plan.storages.join(): ""
		});
	} else {
		return IX.inherit(plan, {
			days : "",
			ssNames : ""
		});
	}
}

globalActionConfig([["store.add", function(params, el){
	_editPlan(null, function(plan){
		planHT.register(plan.id, plan);
		plan.hasClz = "hasHover";
		var html = t_showPlan.renderData("plans", getPlanTpldata(plan));
		jQuery(html).insertBefore(el.parentNode);
	});
}], ["store.edit", function(params, el){
	var planId = params.key;
	var plan = planHT.get(planId);
	if (!plan)
		return;
	_editPlan(plan, function(_plan){
		planHT.register(plan.id, _plan);
		plan.hasClz = "hasHover";
		var html = t_showPlan.renderData("plans", getPlanTpldata(_plan));
		el.parentNode.innerHTML = html.substring('<li class="hasHover">'.length, html.length-"</li>".length);
	});
}], ["store.delete", function(params, el){
	if (!isHandle) return;
	var planId = params.key;
	var plan = planHT.get(planId);
	if (!plan)
		return;
	confirmDialog("删除录像计划", "请确认是否删除此录像计划?", function(cbFn){
		storeCaller("deletePlan", {ids : [plan.id]}, function(){
			planHT.remove(planId);
			var liEl = el.parentNode;
			liEl.parentNode.removeChild(liEl);
			hideDialog();
		});
	});
}]]);
//站点为中心时候的tree显示
function getOCCTreeHTML(){
	var lineInfo = TCM.LineInfo.getSites().getAll();
	var nodes = IX.loop(lineInfo, [], function(acc, site){
		if (site.type !== 0 && site.type !== 4 && site.type !== 5 && site.type !== 6)
			acc.push({name : site.name, key: site.id, nodes: []});
		return acc;
	});
	var treeCfg = IX.inherit({nodes : [{name : TCM.LineInfo.getName(), nodes : nodes}]}, {
		htmlFn : function(node){return '<span class="nodeName">'+node.name+'</span>';},
		click : function(params, el){
			var id = params.keys;
			if (id != CurrentSite.id)
				isHandle = false;
			else
				isHandle = true;
			showPlan({siteId : id}, isHandle);
		}
	});
	return new TCM.Lib.Tree(treeCfg).getHTML();
}

function resizeFn(){
	var height = jQuery("#show-plan").height();
	jQuery("#Tree").css("height", height + "px");
	jQuery(".nv-tree").css("height", height - 50 + "px");
}
//plan的展示函数
function showPlan(cfg, isHandle){
	storeCaller("getPlans", cfg, function(plans){
		var tpldatas = IX.map(plans, function(plan){
			planHT.register(plan.id, plan);
			return getPlanTpldata(plan);
		});
		var ul = jQuery("#show-plan").find(".store-plans");
		if (isHandle) {
			ul.get(0).innerHTML = t_showPlan.renderData("", {
				plans : IX.map(tpldatas, function(tpldata){
					tpldata.hasClz = "hasHover";
					return tpldata;
				}),
				clz : "add"
			});
		} else {
			ul.get(0).innerHTML = t_showPlan.renderData("", {
				plans : tpldatas,
				clz : "notOCC"
			});
		}
	});
}

IX.ns("TCM.Store");
TCM.Store.init = function(pageCfg, pageParams, cbFn){
	isOCC = TCM.Env.getSession().getCurrentSiteType() == 1;
	CurrentSite = TCM.Env.getSession().getCurrentSite();
	planHT.clear();
	if (isOCC) {
		var treeHTML = getOCCTreeHTML();
		$X('body').innerHTML = t_page.renderData("", {
			treeName : "线路录像列表",
			clz: "",
			tree: treeHTML
		});
		jQuery(".nv-tree>ul ul").hide();
		jQuery("#Tree span.nodeName").each(function(){
			if(this.innerHTML == CurrentSite.name)
				this.click();		
		});
		jQuery(".nv-tree span:first").click();
		resizeFn();
		$Xw.bind({"resize": resizeFn});
	} else {
		isHandle = true;
		$X('body').innerHTML = t_page.renderData("", {
			treeName : "",
			clz: "notOCC",
			tree: ""
		});
		showPlan({}, isHandle);
	}
	cbFn();
};
})();
(function () {
var isFoundInArray = IX.Array.isFound;
var ixwPages = IXW.Pages;
var ixwActions = IXW.Actions;

var SiteTypes = TCM.Const.SiteTypes;
var UserTypes = TCM.Const.UserTypes;

var t_page = new IX.ITemplate({tpl: [
	'<nav class="navbar navbar-inverse navbar-fixed-top">',
		'<div class="container-fluid">',
			'<div class="navbar-header">',
				'<a href="#"><span class="badges"></span><span class="navbar-brand">CCTV配置管理</span></a>',
			'</div>',
			'<ul class="nav navbar-nav main">','<tpl id="nav">','<li id="nav-{name}" class="{clz}">',
				'<a data-href="{href}">',
					'<span class="nav-{name}"></span><span>{text}</span>',
				'</a>',
				'<ul class="sub">','<tpl id="subnav">','<li id="nav-{name}" class="{clz}">',
					'<a data-href="{href}">{text}</a>',
				'</li>','</tpl>','</ul>',
			'</li>','</tpl>','</ul>',
			'<ul class="nav navbar-nav navbar-right">',
				'<li class="nowSite"><span class="name">{sitename}</span></li>',
				'<li class="profile"><span class="sp"></span><span class="pic-avatar"></span><span class="name">{username}</span></li>',
				'<li class="logout"><a data-href="$logout"><span class="sp"></span><span>退出</span></a></li>',
			'</ul>',

		'</div>',
	'</nav>',
	'<div class="bg"><div class="fix-bottom"></div></div>',
	'<div id="topbar" class="hide"></div>',
	'<div id="body"></div>',
'']});
var t_unsupportHTML = new IX.ITemplate({tpl: [
	'<div class="bu">',
		'<div class="hdrp"><i class="pic logo"></i></div>',
		'<div class="content">',
			'<div class="t">',
				'<p>当前使用的浏览器版本过低，无法正常使用infobox服务，推荐您下载安装以下浏览器中的任一款，然后再用新浏览器访问（www.CCTVxxx.com），给您带来不便，非常抱歉。</p>',
			'</div>',
			'<div class="label">',
				'<ul>',
					'<tpl id=\'bs\'>',
						'<li>',
							'<a class =\'i {icon}\'></a>',
							'<span>{name}</span>',
							'<a class = \'href\' target="_blank" href="{href}">{href}</a>',
						'</li>',
					'</tpl>',
				'</ul>',
			'</div>',
		'</div>',
	'</div>',
'']});

var nvCache = (function(){
	var _ls = window.localStorage;
	return {
		getItem : function(key){
			return _ls.getItem(key) || null;
		}, //getItem(key, isNotJSON)：取得key对应的值--null
		setItem : function(key, value) {
			_ls.setItem(key, value);
		}, //setItem(key, value, isNotJSON):设置key对应的值
		clear : function(){
			_ls.clear();
		}
	};
})();

function checkBrowserIfSupport(){
	var mainVersion = IX.isOper || IX.isChrome || IX.isSafari || IX.isFirefox;
	var ifSupported = document.location.href.indexOf("#unSupport") > -1 ? false : !(mainVersion && IX.isBelowMSIE9);	
	var browsers = [
		{
		// 	name: "IE的Chrome插件",
		// 	href: "http://www.google.com/chromeframe?hl=zh-CN&prefersystemlevel=true",
		// 	icon: "ie"
		// },{
			name: "IE10",
			href: "http://windows.microsoft.com/zh-cn/internet-explorer/ie-10-worldwide-languages",
			icon: "ie"
		},{
			name: "IE11",
			href: "http://windows.microsoft.com/zh-cn/internet-explorer/ie-11-worldwide-languages",
			icon: "ie"
		},{
			name: "Firefox",
			href: "http://firefox.com.cn/",
			icon: "firefox"
		},{
			name: "Safari浏览器",
			href: "http://www.apple.com.cn/safari/",
			icon: "safari"
		},{
			name: "chrome浏览器",
			href: "http://rj.baidu.com/soft/detail/14744.html",
			icon: "chrome"
		},{
			name: "360极速浏览器",
			href: "http://chrome.360.cn/",
			icon: "chrome360"
		}
	];
	if (!ifSupported){
		document.body.className = "minor browser_unsupport";
		document.body.innerHTML = t_unsupportHTML.renderData('', {
			bs: browsers
		});
	}

	return ifSupported;
}
/** modules : ["lineInfo"]
 */
function SessionManager(data){
	var sessionData = data;
	var userName = $XP(data, "name", "");
	var account = $XP(data, "account", "");
	var userId = $XP(data, "id", null);
	var siteId = $XP(data, "siteId", null);
	var type = $XP(data, "type", 1);
	var isSuper = type == UserTypes.Super;

	var site = null, enabledModules = [];
	function checkSite(){
		var siteInfo = TCM.LineInfo.getSites();
		site = siteInfo && siteInfo.get(siteId);
		var hasOCC = false;
		IX.iterate(siteInfo.getAll(), function(site){
			if (site.type == SiteTypes.OCC)
				hasOCC = true;
		});
		enabledModules = (isSuper && !hasOCC) || (site && site.type == SiteTypes.OCC) ? ["lineInfo"]: [];
	}
	checkSite();
	nvCache.setItem("tcmSessionKey", siteId+"-"+userId);
	return {
		//_get: function(){return sessionData;},
		hasAuth : function(){return userId !== null;},
		getUserName : function(){return userName;},
		getAccount : function(){return account;},
		getUserId : function(){return userId;},
		getCurrentSiteId : function(){return siteId;},
		getCurrentSite: function(){return site;},
		setCurrentSiteId : function(id){
			siteId = id;
			checkSite();
		},
		getSessionKey: function(){
			return siteId+"-"+userId;
		},
		setUserName : function(name){
			userName=name;
			jQuery(".profile").children('.name').html(userName);
		},
		getCurrentSiteType : function(){return site ? site.type : "";},
		isSuper : function(){return isSuper;},
		checkIfModuleEnabled : function(module){
			return isFoundInArray(module, enabledModules);
		}
	};
}
var sessionMgr = new SessionManager();

var NavItems = [
["sys", "系统管理", [
	["sys-line", "线路和车站管理"],
	["sys-role", "角色管理"],
	["sys-level", "用户优先级定义"],
	["sys-user", "用户管理"],
	["sys-config", "系统设置"]
]],
["device", "设备管理", [
	["device-list", "设备列表"],
	["device-zone", "摄像机分区"],
	["device-video", "电视墙"]
]],
["store", "存储管理"]
];
var NavItems4Super = [
["sys", "系统管理", [
	["sys-line", "线路和车站管理"],
	["sys-role", "角色管理"],
	["sys-level", "用户优先级定义"],
	["sys-user", "用户管理"]
]]
];
var DefaultNav = "sys-line";
function NavManager(focusedNavName){
	var focused = focusedNavName || DefaultNav;

	function _getSubNavItemTplData(item){
		var name = item[0];
		return {
			name : name,
			text : item[1],
			clz : "",
			href: item[2] || ixwPages.createPath(name)
		};
	}
	function _getNavItemTplData(item){
		var name = item[0];
		var subNavs = item.length>2 ? item[2] : [];
		return {
			name : name,
			text : item[1],
			clz : subNavs.length>0 ? "" : "nosub",
			href: ixwPages.createPath(subNavs.length>0? subNavs[0][0]: name),
			subnav : IX.map(subNavs, _getSubNavItemTplData)
		};
	}
	function _focus(itemName, isFocused){
		var arr = itemName.split("-");
		var fn = isFocused ? $XH.addClass: $XH.removeClass;
		if (arr.length==2) 
			fn($X("nav-" + arr[0]), "active");
		fn($X("nav-" + itemName), "active");
	}
	function focus(itemName){
		var el = $X('nav-' + itemName);
		if (itemName == focused || !el)
			return;
		_focus(focused, false);
		focused = itemName;
		_focus(itemName, true);
	}
	function enableHover(){
		jQuery(".main li").hover(
			function(){$XH.addClass(this, "hover");}, 
			function(e){
				var _this = this;
				var pEl = $XH.ancestor(e.toElement, "ul");
				pEl = pEl ? pEl.parentNode : null;
				if (!$XH.hasClass(pEl, "hover"))
					$XH.removeClass(_this, "hover");
			}
		);
	}
	return {
		getRenderData : function(){
			return IX.map(sessionMgr.isSuper()?NavItems4Super: NavItems, _getNavItemTplData);
		},
		enableHover : enableHover,
		focus : focus
	};
}
var navMgr = new NavManager();

function clearSession(){
	sessionMgr = new SessionManager();
	TCM.LineInfo.destroy();
	IXW.Pages.load("entry");
}
function startSession(data){
	TCM.LineInfo.init(data.lineInfo);
	sessionMgr = new SessionManager(data);
	var nowSite=TCM.LineInfo.getSites().get(data.siteId)?TCM.LineInfo.getSites().get(data.siteId).name:"";
	document.body.innerHTML = t_page.renderData("",{
		nav : navMgr.getRenderData(),
		username : data.name,
		sitename : nowSite
	});
	navMgr.enableHover();
}
var PagesConfiurations = IX.map([
//{type?, name+, path?, bodyClz?, needAuth?},
{type: "ErrPage", name: "401", needAuth : false},
{type: "ErrPage", name: "404", needAuth : false},

// {name: "sys", path : "sys/line", isDefault : true},
{name: "sys-line", isDefault : true},
{name: "sys-role"},
{name: "sys-level"},
{name: "sys-user"},
{name: "sys-config"},

// {name: "device", path : "device/-/list"},
{name: "device-list", path : "device/{type}/list"},
{name: "device-zone", path : "device/{id}/{type}/zone"},
{name: "device-zoneMap", path : "device/{id}/map"},
{name: "device-video", path : "device/{type}/video"},

{name: "store"}, //, path : "store/plan"},
//{name: "store-plan"},

{name: "entry", bodyClz: "entry", needAuth : false}
], function(item){
	var name = item.name;
	var arr = name.split("-");
	var moduleName = arr[0];
	var className = item.type || moduleName.capitalize();
	return IX.inherit({
		initiator : "TCM." + className + ".init",
		path : arr.join("/"),

		nav : "service",
		navItem : name,

		needAuth : true
	}, item);
});

ixwActions.configActions([["logout", function(){
	function _okFn(){
		TCM.Global.entryCaller("logout", {}, function(){	
			clearSession();
		});
	}
	NV.Dialog.confirm("提示", "确认是否退出?", _okFn);
}]]);

function loadSession(pageFn){
	TCM.Global.commonCaller("session", {}, function(data){
		if (!data || !data.id)
			return ixwPages.load("entry");
		startSession(data);
		pageFn();
	});
}
function checkSession(){
	var timers = setInterval(function(){
		var sessionKey = nvCache.getItem("tcmSessionKey");
		if (sessionKey == sessionMgr.getSessionKey())
			return;
		if(sessionKey == "null-null"){
			return NV.Dialog.confirm4login("提示", "当前用户已在其他窗口退出，请重新登录！", {
					left : [],
					right : [{name:"ok", text: "确定"}] 
				}, function(){
				loadSession(function(){
					ixwPages.reload();
				});
			});
		}
		NV.Dialog.confirm4login("提示", "已存在登录用户，请刷新页面！", {
				left : [],
				right : [{name:"ok", text: "确定"}] 
			}, function(){
			loadSession(function(){
				ixwPages.reload();
			});
		});
	}, 3000);
}

IX.ns("TCM.Env");
TCM.Env.init = function(){
	ixwPages.listenOnClick(document.body);
	ixwPages.configPages(PagesConfiurations, function(pageName, pageCfg){
		return !$XP(pageCfg, "needAuth", true) || sessionMgr.hasAuth();
	});
	IXW.Navs.register("service", function(cfg){
		navMgr.focus(cfg.navItem || "");
	});
	loadSession(function(){
		ixwPages.start();
	});
	checkSession();
	$Xw.bind({
		keydown : function(e){
			if (e.keyCode == 8 && jQuery("#nv-dialog").css('display') != 'none') {    
				if(e.target.nodeName == "INPUT") return ;
				IX.Util.Event.stop(e);
			}
		}
	});
};
TCM.Env.isMe = function(userId){return userId === sessionMgr.getUserId();};
TCM.Env.reloadSession = function(){
	loadSession(function(){
		ixwPages.reload();
	});
};
TCM.Env.clearSession = clearSession;
TCM.Env.hasSession = function(){return sessionMgr.hasAuth();};
TCM.Env.resetSession = function(data){startSession(data);};
TCM.Env.getSession = function(){return sessionMgr;};
TCM.Env.canUpdateLineInfo = function(){
	return sessionMgr.checkIfModuleEnabled("lineInfo");
};

var appInitialized = false;
TCM.init = function(){
	if (appInitialized)
		return;
	appInitialized = true;
	checkBrowserIfSupport();
	TCM.Env.init();
};
})();