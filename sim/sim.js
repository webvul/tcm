(function(){
IX.ns("Test");

var _config = {
	ControlReleaseTime: "3000",// MS
	TimingSetting: '{"schedule":"01:00:00","useRS422":false,"useNTP":true,"ntpIP":"1.1.1.1","ntpPort":"1","autoTiming":true}',
	ServerBackupSetting: '{"backupTVS" : true,"backupSS": true}', 
	StorageBackupSetting : true, 
	Sync : false,
}

Test.getConfig = function(){
	return _config;
};
Test.setConfig = function(params){
	_config = params;
};
Test.timingSetting = function(params){
	_config.TimingSetting = params;
};

function getRandonItem(arr){
	return arr[Math.floor(Math.random() * arr.length)];
}
function getPagedData(arr, pageNo, pageSize){
	return {
		total : arr.length,
		items : IX.partLoop(arr, pageNo* pageSize, pageNo*pageSize + pageSize, [], function(acc, item){acc.push(item); return acc;})
	};
}

var SiteTypes = TCM.Const.SiteTypes;
var SiteTypeNames = TCM.Const.SiteTypeNames;
var UserRoles = IX.map([ 
["TCC 调度员",					SiteTypes.TCC, true],

["控制中心防灾值班员", 			SiteTypes.OCC],
["控制中心行车调度员", 			SiteTypes.OCC],
["控制中心电力调度员", 			SiteTypes.OCC],
["控制中心AFC调度员", 				SiteTypes.OCC],

["车辆段/停车场防灾值班员",			SiteTypes.Depot],
["车辆段/停车场行车值班员",			SiteTypes.Depot],
["车辆段/停车场运转值班员",			SiteTypes.Depot],
["车辆段/停车场安保值班员", 		SiteTypes.Depot],

["车站防灾值班员", 				SiteTypes.Station],
["车站行车值班员", 				SiteTypes.Station],
["换乘线路车站值班员", 			SiteTypes.Station],
["公安车站值班员",					SiteTypes.Station],

["公安派出所调度员",				SiteTypes.LinePolice],
["公安派出所值班员", 				SiteTypes.LinePolice],
["公安交总队调度员及其它部门人员",		SiteTypes.PTSD]
], function(r, idx){
	return {id:idx+1, name: r[0], siteType: r[1], promptable : r[2] || false};
});

Test.createRole = function(info){
	var id = UserRoles[UserRoles.length-1].id +1;
	var newRole =IX.inherit(info, {
		id : id
	});
	UserRoles.push(newRole);
	return newRole;
};
Test.editRole = function(info){
	UserRoles = IX.map(UserRoles, function(r){
		return IX.inherit(r, info.id== r.id ? info : {});
	});
};
Test.deleteRoles = function(ids){
	var idsStr = "," + ids.join(",")+",";

	UserRoles = IX.loop(UserRoles, [], function(acc, r){
		if (idsStr.indexOf("," + r.id + ",")<0)
			acc.push(r);
		return acc;
	});
};

var RolesSelectable = IX.map(SiteTypeNames, function(item, idx){
	return IX.loop(UserRoles, [], function(acc, r, _idx){
		if (r.siteType === idx)
			acc.push(r.id);
		return acc;
	});
});
var LevelRoles = [
[1, 1, true],
[2, 2],
[10, 6],
[3, 3],
[11,7],
[4, 8],
[5, 4],
[14,5],
[13,14],
[1, 1],
[12,16],
[16,9]
];
var UserLevels = (function(){
	var arr = [];
	for (var i=0;i<49; i++){
		var level = i<LevelRoles.length ? LevelRoles[i] : [null,null];
		arr.push({
			id : i,
			name : "第" + (i + 1) + "级",
			level : i+1,
			station : {id: level[0], prompted: level[2] || false},
			depot:{id: level[1], prompted: level[2] || false}
		});
	}
	return arr;
})();

Test.editUserLevel = function(params){
	UserLevels[params.id] = IX.inherit(UserLevels[params.id], params);
	return UserLevels[params.id];
};

var Line = {id: 1, name: "13号线"};
var siteIds = [];
var allSiteIds = [];
function genSite(idx, name, type, _idx){
	if (type == 2 || type == 3) {
		siteIds.push(idx);
	}
	allSiteIds.push(idx);
	return {id: idx, name: name, lineId:1, type: type,
		no:idx+1, desc: type===3?("第"+ _idx + "站") : ""};
}
var siteNames = "西直门,大钟寺,知春路,五道口,上地,西二旗,龙泽,回龙观,霍营,立水桥,北苑,望京西,芍药居,光熙门,柳芳,东直门".split(",");
var Sites = [].concat(
	genSite(0, "地铁指挥中心", 0),
	genSite(1, "13号线控制中心", 1),
	genSite(2, "回龙观车辆段", 2),
	genSite(3, "东直门停车场", 2),
	IX.map(siteNames, function(name, idx){
		return genSite(4 + idx, name, 3, idx + 1);}),
	genSite(4 + siteNames.length, "13号线备用中心", 4),
	genSite(5 + siteNames.length, "13号线派出所", 5),
	genSite(6 + siteNames.length, "公交总队", 6)
);


var CurrentSite = Sites[2];
var CurrentSiteArr = CurrentSite.type == 1 ? IX.loop(Sites, [], function(acc, Sites){
	if (Sites.type != 0 && Sites.type != 6 && Sites.type != 5 && Sites.type != 4)
		acc.push(Sites);
	return acc;
}) : [CurrentSite];
Test.createSites(CurrentSiteArr);

Test._getAllSites = function(){
	return Sites;
};
Test._getCurrentSite = function(){
	return CurrentSite;
};
Test._getSiteById = function(id){
	return IX.loop(Sites, null, function(acc, site){
		return acc || (site.id == id ? site :null); 
	});
};

Test.setLineName = function(name){
	Line.name = name;
};

Test.deleteSites = function(ids){
	var idsStr = "," + ids.join(",")+",";

	Sites = IX.loop(Sites, [], function(acc, site){
		if (idsStr.indexOf("," + site.id + ",")<0)
			acc.push(site);
		return acc;
	});
};
Test.createSite = function(info){
	var id = Sites[Sites.length-1].id +1;
	var newSite =IX.inherit(info, {
		lineId : 1, 
		id : id
	});
	Sites.push(newSite);
	return newSite;
};
Test.editSite = function(info){
	Sites = IX.map(Sites, function(site){
		return IX.inherit(site, info.id== site.id ? info : {});
	});
};

Test.setCurrentSite = function(siteId){
	IX.iterate(Sites, function(site){
		if(siteId== site.id) CurrentSite = site;
	});
};

var Users = {
	super : {id: 0, name: "超级用户", type: 0, siteId : 0},
	admin : [
		{id: 1, name: "张无忌", account: "admin1", type: 1, siteId : 1},
		{id: 2, name: "杨无悔", account: "admin2", type: 1, siteId : 2},
		{id: 3, name: "赵敏", account: "admin3", type: 1, siteId : 3},
		{id: 4, name: "阳顶天", account: "admin4", type: 1, siteId : 4}
	],
	users : []
};

var SNames = "赵钱孙李周吴郑王刘花辛魏宋马朱陆".split("");
var LNames = "系统部署时由超级用户创建拥有创建修改删除各自车站的普通用户及赋予权限拥有创建修改删除等权限不能登陆以及云台控制等权限".split("");
function getUser(idx){
	var username = getRandonItem(SNames) + getRandonItem(LNames) +  getRandonItem(LNames);
	var site = getRandonItem(Sites);
	while(site.type == 4)
		site = getRandonItem(Sites);
	return {
		id : 10 + idx, name : username, account: "user" + idx, type: 2,
		siteId: site.id, role : getRandonItem(RolesSelectable[site.type]),
		desc : "<asdasd><asdaSD<asd>",
		access:""
	};
}
Users.users = (function(){
	var arr = [];
	for (var i=0; i<300; i++)
		arr.push(getUser(i));
	return arr;
})();

function getCurrentLineInfo (){
	return  IX.inherit(Line,{
		sites : Sites,
		roles : UserRoles,
		levels : UserLevels
	});
}

Test.getSessionData = function(){ return {
	"id" : 1,
	"name" : "张无忌",
	"type" : 1, 
	"siteId" : CurrentSite.id,
	"lineInfo" : getCurrentLineInfo()
};};

Test.getUserRole = function(){return {total: UserRoles.length, items: UserRoles};};
Test.getUserLevel= function(){return {total: UserLevels.length, items: UserLevels};};
Test.getLineInfo = function(){return IX.inherit(Line,{sites : Sites});};
Test.getUsers = function(params){
	return getPagedData(Users.admin.concat(Users.users), $XP(params, "pageNo", 0), $XP(params, "pageSize", 20));
};

Test.createUser = function(info){
	var adminUser = Users.admin, users = Users.users;
	var id = users[users.length-1].id + 1;
	var user = IX.inherit(info, {
		id : id,
		siteId : CurrentSite.id
	});
	if (info.type == 1)
		adminUser.push(user);
	else
		users.push(user);
	return user;
};
Test.editUser = function(info){
	var isAdmin = info.type == 1;
	Users[isAdmin?"admin":"users"] = IX.map(Users[isAdmin?"admin":"users"], function(u){
		return IX.inherit(u, info.id== u.id ? info : {});
	});
};
Test.deleteUsers = function(ids){
	var idsStr = "," + ids.join(",")+",";

	Users.admin = IX.loop(Users.admin, [], function(acc, u){
		if (idsStr.indexOf("," + u.id + ",")<0)
			acc.push(u);
		return acc;
	});
	Users.users = IX.loop(Users.users, [], function(acc, u){
		if (idsStr.indexOf("," + u.id + ",")<0)
			acc.push(u);
		return acc;
	});
};
Test.resetPwd = function(){};
Test.getUserPriv=function(params){
	var userId = params.id;
	var access;
	IX.iterate(Users.users, function(u){
		if(u.id == userId)
			access = u.access;
	});
	return access;
}
Test.resetPriv = function(params){
	var userId = params.id;
	IX.iterate(Users.users, function(u){
		if(u.id == userId)
			u.access = JSON.parse(params.access);
	});
};

var DayPlans = ["all", [1,2,3,4,5], [0,6]];
var DatePlans = [
{from: "00:00", to : "24:00"},
{from: "03:00", to : "21:00"},
{from: "09:00", to : "24:00"},
];

var StorePlans = (function(){
	var arr = [];
	for (i=0; i<6; i++){
		arr.push(IX.inherit({
			id :i,
			name : "存储计划-" + i,
			siteId : CurrentSite.id,
			ssIds : [0], //...
			cameraIds : [1, 2, 3], //....
 			circle : getRandonItem([7,15,30]),
 			days : getRandonItem(DayPlans)
		}, getRandonItem(DatePlans)));
	}
	return arr;
})();

Test.getPlans = function(){return IX.map(StorePlans, function(plan){
	return IX.inherit(plan, {
		storages : IX.map(plan.ssIds, function(ssId){
			return "存储服务器" + ssId;
		})
	});
});};
Test.getPlan = function(id){
	if (id === -1)
		return {name: "新录像计划" + IX.id()};
	var idx = IX.Array.indexOf(StorePlans, function(plan){
		return plan.id == id;
	});
	if (idx < 0)
		return null;
	var plan = StorePlans[idx];
	return IX.inherit(plan, {
		storages : IX.map(plan.ssIds, function(ssId){
			return {id : ssId, name : "存储服务器"+ssId};
		}),
		cameras : IX.map(plan.cameraIds,function(cId){
			return {id: cId + 5, name : "摄像机" + cId + 5, type: [20,21,22][Math.floor(Math.random()*3)]};
		}),
		monitors : IX.map(plan.cameraIds,function(cId){
			return {id: cId, name : "监视器" + cId, type: 53};
		})
	});
}
Test.getDevices4Plan = function(siteId){
	return IX.inherit({
		storages : IX.map("0".multi(Math.floor(Math.random()*5)+1).split(""), function(ssId, idx){
			return {id : idx, name : "存储设备" + idx};
		})
	}, siteId != 1 ? {
		cameras : IX.map("0".multi(Math.floor(Math.random()*100)+1).split(""),function(cId, idx){
			return {id: 10 + idx, name : "摄像机" + 10 + idx, type: [20,21,22][Math.floor(Math.random()*3)]};
		})
	} : {
		monitors : IX.map("0".multi(Math.floor(Math.random()*10)+1).split(""),function(cId, idx){
			return {id: idx+100, name : "监视器" + 100 + idx, type: 53};
		})
	});
};
Test.addPlan = function(params){
	var obj = {
		id:StorePlans.length,
		name:params.name,
		siteId: CurrentSite.id,
		ssIds: params.storages,
		cameraIds: params.cameras ? params.cameras : [],
		monitorIds: params.monitors ? params.monitors : [],
		circle: params.circle,
		days: params.days,
		from: params.from,
		to: params.to,
		storages: IX.map(params.storages, function(s){ return "存储服务器"+s;})
	}
	StorePlans.push(obj);
	return obj;
};
Test.editPlan = function(params){
	var idx = IX.Array.indexOf(StorePlans, function(plan){
		return plan.id == params.id;
	});
	if (idx < 0)
		return null;
	StorePlans[idx] = {
		id:params.id,
		name:params.name,
		siteId: CurrentSite.id,
		ssIds: params.storages,
		cameraIds: params.cameras ? params.cameras : [],
		monitorIds: params.monitors ? params.monitors : [],
		circle: params.circle,
		days: params.days,
		from: params.from,
		to: params.to,
		storages: IX.map(params.storages, function(s){ return "存储服务器"+s;})
	};
};
Test.getCurrentSite = function(){
	if (CurrentSite.type == 1) 
		return CurrentSiteArr;
	else
		return CurrentSite;
};
Test.getData4TCM = function(){
	function _getSiteData(site){
		var siteId = site.id;
		return {
			site : site,
			devices : Test.hasKey4HT(siteId)?Test.getDevicesHT(siteId):[],
			users : IX.loop(Users.users, [], function(acc, u){
				if (u.siteId == siteId) acc.push(u);
				return acc;
			}),
			storePlans : IX.loop(StorePlans, [], function(acc, u){
				if (u.siteId == siteId) acc.push(u);
				return acc;
			})
		};
	}
	return {
		current: CurrentSite.id,
		lineName: Line.name,
		roles: UserRoles,
		levels: UserLevels,
		sites: IX.map(Sites, _getSiteData)
	}
};
Test.hasData = function(){
	return {
		msg : Math.floor(Math.random()*200 % 5) == 0? "此站点有数据存在，不能修改！": ""
	};
}
})();