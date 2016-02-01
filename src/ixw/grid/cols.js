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