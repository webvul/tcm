(function(){
IX.ns("TCM.Global");

var baseUrl = TCM_BaseUrl + "/sim";
var imgUrl = TCM_BaseUrl + "/src/images";
var mapUrl = TCM_BaseUrl + "/sim";

IXW.ajaxEngine.init({
	ajaxFn : jQuery.ajax,
	baseUrl : baseUrl,
	imgUrl : imgUrl,
	mapUrl : mapUrl
});

IXW.urlEngine.mappingUrls([
["uploadImg", "/uploadImg.html"],
["backgroundImg", "/entrybg.png", "img"],
["image", "/img.jpg", "img"]
]);
TCM.Global.filUploadUrl = IXW.urlEngine.genUrl("uploadImg"); // or baseUrl + "/uploadImg.html"
TCM.Global.backgroundUrl = IXW.urlEngine.genUrl("backgroundImg");
TCM.Global.image = IXW.urlEngine.genUrl("image");
TCM.Global.getMapUrl = function(map){return imgUrl + '/' + map;}

TCM.Global.entryCaller = function(name, params, cbFn, failFn){
	var remotefile = null;
	switch(name){
	case "login":
		//params : {username, password}
		/**	cbFn({id,name,type,siteId, lineInfo:{
			id, name, 
			levels:[{id,level,name,depot:{id,prompted},station:{id:prompted}}],
			roles:[{id,name,siteType,promptable}], 
			sites:[{id,name,type,no,desc}]
		}})
		 */
		if (params.username == "admin" && params.password == "123456")
			return setTimeout(function(){cbFn(Test.getSessionData());}, 100);
		remotefile = baseUrl + "/failLogin.json";
		break;
	case "logout":
		return cbFn();
	}
	IX.Net.loadFile(remotefile, function(txt){
		var ret = JSON.parse(txt);
		if (ret.retCode != 1)
			IX.isFn(failFn)?failFn(ret) : alert(ret.err);
		else
			cbFn(ret.data);
	});
};

TCM.Global.commonCaller = function(name, params, cbFn, failFn){
	switch(name){
	case "session" :
		/**	cbFn({id,name,type,siteId, lineInfo:{
			id, name, 
			levels:[{id,level,name,depot:{id,prompted},station:{id:prompted}}],
			roles:[{id,name,siteType,promptable}], 
			sites:[{id,name,type,no,desc}]
		}})
		 */
		return setTimeout(function(){cbFn(Test.getSessionData());}, 100);
	}
};

TCM.Global.sysCaller = function(name, params, cbFn, failFn){
	switch(name){
	case "getLineInfo":
		/**	cbFn({id,name,
			sites:[{id,name,type,no,desc}]
		}})
		 */
		setTimeout(function(){cbFn(Test.getLineInfo());},100);
		break;
	case "setLineName":
		/** params : {name : lineName} */
		setTimeout(function(){cbFn(Test.setLineName(params.name));}, 100);
		break;
	case "setCurrentSite":
		/*	params : {id : siteId}*/
		setTimeout(function(){cbFn(Test.setCurrentSite(params.id));},100);
		break;
	case "deleteSites" : 
		/* params : {ids : [id]} */
		setTimeout(function(){cbFn(Test.deleteSites(params.ids));}, 100);
		break;
	case "createSite" : 
		/* params : {desc, name, type, no} 
			cbFn({id, name, type, no, desc})
		*/
		setTimeout(function(){cbFn(Test.createSite(params));}, 100);
		break;
	case "editSite" :
		/* params : {id, desc, name, type, no} */ 
		setTimeout(function(){cbFn(Test.editSite(params));}, 100);
		break;

	case "getUserRole":
		/* cbFn({total, items:[{id,name,siteType,promptable}]})
		*/
		setTimeout(function(){cbFn(Test.getUserRole());},100);
		break;	
	case "createRole" : 
		/* params : {name, siteType, promptable} 
			cbFn({id, name, siteType, promptable})
		*/
		setTimeout(function(){cbFn(Test.createRole(params));}, 100);
		break;
	case "editRole" :
		/* params : {id, name, siteType, promptable} */ 
		setTimeout(function(){cbFn(Test.editRole(params));}, 100);
		break;
	case "deleteRoles" : 
		/* params : {ids : [id]} */
		setTimeout(function(){cbFn(Test.deleteRoles(params.ids));}, 100);
		break;

	case "getUserLevel":
		/* cbFn({total, items:[{id,level,name,depot:{id,prompted},station:{id:prompted}}]}) */
		setTimeout(function(){cbFn(Test.getUserLevel());},100);
		break;
	case "editUserLevel" :
		/* params : {id,name, level,depot:{id,prompted},station:{id, prompted}}
		*/ 
		setTimeout(function(){cbFn(Test.editUserLevel(params));}, 100);
		break;
	case "getUsers":
		/* params : {pageNo, pageSize}
		 cbFn({total, items:[{id,name,account,type,siteId,desc,role:roleId,access}])
		*/
		setTimeout(function(){cbFn(Test.getUsers(params));},100);
		break;
	case "addUser":
		/* params : {password, desc,account, name,type,role:roleId,access}	 
			cbFn({id, siteId, desc, account, name,type,role:roleId,access})
		*/
		setTimeout(function(){cbFn(Test.addUser(params));}, 100);
		break;
	case "editUser" :
		/* params : {id, desc, name,account, type,role:roleId,access}*/ 
		setTimeout(function(){cbFn(Test.editUser(params));}, 100);
		break;
	case "deleteUsers" : 
		/* params : {ids : [id]} */
		setTimeout(function(){cbFn(Test.deleteUsers(params.ids));}, 100);
		break;
	case "resetPwd" : 
		/* params : {id, password} */
		setTimeout(function(){cbFn(Test.resetPwd(params));}, 100);
		break;
	case "getAllCameras" :
		/* 
			DATADEF: ZoneData = {name : zoneName, cameras : [{id,type, name}]} 
			cbFn(CurrentIsOCC?
				[[siteId1, [ZoneData]], [siteId2, [ZoneData]], ...]
				:
				[[CurrentSiteId1, [ZoneData]]
			)
		 */
		setTimeout(function(){cbFn(Test.getAllCameras());}, 100);
		break;
	case "getUserPriv":
		/*  params : {id} 
			cb({ptzc,vsv, vra})
		 */
		setTimeout(function(){cbFn(Test.getUserPriv(params));}, 100);
		break;	
	case "resetPriv":
		/*  params : {id, access:{ptzc,vsv, vra}} 
		 */
		setTimeout(function(){cbFn(Test.resetPriv(params));}, 100);
		break;	

	case "getConfig" :
		/*	cbFn({
				ControlReleaseTime, TimingSetting, ServerBackupSetting, 
				StorageBackupSetting, Sync
			})
		 */
		setTimeout(function(){cbFn(Test.getConfig());},100);
		break;
	case "setConfig":
		/*	params : {ControlReleaseTime, TimingSetting, ServerBackupSetting,
			 StorageBackupSetting, Sync}
		 */
		setTimeout(function(){cbFn(Test.setConfig(params));},100);
		break;
	case "timingSetting":
		/*	params : {useRS422,useNTP,ntpIP,ntpPort,schedule,autoTiming}
		 */
		setTimeout(function(){cbFn(Test.timingSetting(params));},100);
		break;
	case "syncData":
		setTimeout(function(){cbFn();},100);
		break;
	case "syncTiming":
		setTimeout(function(){cbFn();},100);
		break;
	case "hasData" :
		/*
			params: id, toType
		 */
		setTimeout(function(){cbFn(Test.hasData(params));}, 100);
		break;
	}
};
TCM.Global.deviceAndZoneCaller = function(name, params, cbFn, failFn){
	switch(name){
	case "getAllZones":
		/*
		 cbFn([{siteId, zones: [{id, name, total:{fixed, semi, sphere}}]}]);
		 */
		setTimeout(function(){cbFn(Test.getAllZones());},100);
		break;
	case "addZone":
		/* params : {name}
		 cbFn({id,name,total:{fixed,semi,shpere}})
		 */
		setTimeout(function(){cbFn(Test.addZone(params));},100);
		break;	
	case "editZone":
		/* params : {id, name}
		*/
		setTimeout(function(){cbFn(Test.editZone(params));},100);
		break;	
	case "deleteZone":
		/* params : {ids: []}
		*/
		setTimeout(function(){cbFn(Test.deleteZone(params));},100);
		break;
	case "getCamerasByZone":
		/* params : {siteId, id: zoneId,types: [],pageNo,pageSize}
		 cbFn({total, items})
		*/
		setTimeout(function(){cbFn(Test.getCamerasByZone(params));},100);
		break;
	case "getCamerasByNoZone":
		/* 
		 cbFn([{id, name, type}])
		*/
		setTimeout(function(){cbFn(Test.getCamerasByNoZone(params));},100);
		break;
	case "addCamerasToZone":
		/* params : {id: zoneId,cameras: [cameraId1, cameraId2...]}
		 cbFn({fixed, semi, shpere})
		*/
		setTimeout(function(){cbFn(Test.addCamerasToZone(params));},100);
		break;
	case "deleteCamerasFromZone":
		/* params : {id: zoneId,cameras: [cameraId1, cameraId2...]}
		 cbFn({fixed, semi, shpere})
		*/
		setTimeout(function(){cbFn(Test.deleteCamerasFromZone(params));},100);
		break;
	case "getAllDevices":
		/* 
		 cbFn([{siteId, siteType, devices:[{count, type}]}])
		*/
		setTimeout(function(){cbFn(Test.getAllDevices());},100);
		break;
	case "getDevices4Type":
		/* params : {pageNo, pageSize, siteId, types:[type]}
		 cbFn({total, items})
		*/
		setTimeout(function(){cbFn(Test.getDevices4Type(params));},100);
		break;
	case "addDevice":
		/* params : {type....}
		 cbFn({id, type....})
		*/
		setTimeout(function(){cbFn(Test.addDevice(params));},100);
		break;
	case "editDevice":
		/* params : {id,type....}
		*/
		setTimeout(function(){cbFn(Test.editDevice(params));},100);
		break;
	case "deleteDevices":
		/* params : {ids:[]}
		*/
		setTimeout(function(){cbFn(Test.deleteDevices(params));},100);
		break;
	case "getAllNotRelatedCameras":
		/* params : {type}
		 cbFn({notRelatedCameras : [ { id, name} ]})
		*/
		setTimeout(function(){cbFn(Test.getAllNotRelatedCameras(params));},100);
		break;
	case "getAllNotRelatedSpliters":
		/* params : {type}
		 cbFn({notRelatedSpliters : [ { id, name} ]})
		*/
		setTimeout(function(){cbFn(Test.getAllNotRelatedSpliters(params));},100);
		break;
	case "getAllNotRelatedDecoders":
		/*
		 cbFn({notRelatedSpliters : [ { id, name} ]})
		*/
		setTimeout(function(){cbFn(Test.getAllNotRelatedDecoders(params));},100);
		break;
	case "getVideoWalls" :
		/*  params : [{siteId}]
			cbFn([{id,monitor:{id,name,ip}, spliter:{id,name,ip},decoder{id,name,ip}}])
		*/
		setTimeout(function(){cbFn(Test.getVideoWalls(params));},100);
		break;
	case "getVideoWall" :
		/* params : {id : videoWallId}  
			cbFn({id,monitor:{id,name,ip}, decoder{id,name,ip},spliter:{id,name,ip}, notRelatedDecoder:[{id,name,ip}],notRelatedMonitor:[{id,name,ip}], notRelatedSpliter:[{id,name,ip}]})
		*/
		setTimeout(function(){cbFn(Test.getVideoWall(params));},100);
		break;
	case "addVideoWall" :
		/* params : {monitor:id, spliter:id, decoder:id}//spliter与decoder有且仅有一个
			cbFn({id,monitor:{id,name,ip}, spliter:{id,name,ip},decoder{id,name,ip}})
		 */	
		setTimeout(function(){cbFn(Test.addVideoWall(params));},100);
		break;
	case "editVideoWall":
		/* params : {id, monitor:id, spliter:id, decoder:id}
			cbFn({id,monitor:{id,name,ip}, spliter:{id,name,ip},decoder{id,name,ip}})
		 */
		setTimeout(function(){cbFn(Test.editVideoWall(params));},100);	
		break;
	case "deleteVideoWall" :
		/* params : {ids:[videoWallId]}
		*/	
		setTimeout(function(){cbFn(Test.deleteVideoWall(params));},100);
		break;

	case "getMap" :
		/* params : {zoneId, siteId}
			cbFn({url, cameras:[{camera}]})
			camera : {
				id, name, type, siteId, zoneId, x, y
			}
		*/	
		setTimeout(function(){cbFn(Test.getMap(params));},100);
		break;

	case "addDeviceOfMap" :
		/* params : {id, siteId, zoneId, x, y}
			cbFn()
		*/	
		setTimeout(function(){cbFn(Test.addDeviceOfMap(params));},100);
		break;
	case "editDeviceOfMap" :
		/* params : {id, siteId, zoneId, x, y}
			cbFn()
		*/	
		setTimeout(function(){cbFn(Test.editDeviceOfMap(params));},100);
		break;
	case "deleteDeviceOfMap" :
		/* params : {id}
			cbFn()
		*/	
		setTimeout(function(){cbFn(Test.deleteDeviceOfMap(params));},100);
		break;
	case "getCamerasNotInMap" :
		/* params : {zoneId, siteId}
			cbFn([{id, name, type}])
		*/	
		setTimeout(function(){cbFn(Test.getCamerasNotInMap(params));},100);
		break;
	case "getDriver" :
		/* 
			cbFn([{id, name, style, type}])
		*/	
		setTimeout(function(){cbFn(Test.getDriver());},100);
		break;
	case "isRelatePickup" :
		/*
			params: id, type
		 */
		setTimeout(function(){cbFn(Test.isRelatePickup(params));}, 100);
		break;
	case "getAllCoders" :
		/*
			cbFn([{id, name, channels}])
			channels:[
				{channelNo, used:1/0}
			]
		 */
		setTimeout(function(){cbFn(Test.getAllCoders(params));}, 100);
		break;
	}
}

TCM.Global.storeCaller = function(name, params, cbFn, failFn){
	switch(name){
	case "getPlans" :
		/*  params : [{siteId}]
			cbFn([{id,name, storages:[storageName], circle, days, from, to}])
		*/
		setTimeout(function(){cbFn(Test.getPlans());},100);
		break;
	case "getDevices4Plan":
		/*  给出当前站点的所有存储服务器和未指定计划的摄像机
			params:{siteId}
			cbFn({storages:[{id, name}],
				cameras : [{id, name, type}]})
		*/
		setTimeout(function(){cbFn(Test.getDevices4Plan(params.siteId));},100);
		break;
	case "addPlan" :
		/* params : {name, storages:[id],cameras : [id], circle, days, from, to}
			cbFn({id,name, storages:[storageName], circle, days, from, to})
		 */	
		setTimeout(function(){cbFn(Test.addPlan(params));},100);	
		break;
	case "getPlan" :
		/* params : {id : planId}
			cbFn({id,name, storages:[{id, name}],
				cameras : [{id, name, type}]
			 	circle, days, from, to})
		*/
		setTimeout(function(){cbFn(Test.getPlan(params.id));},100);
		break;
	case "editPlan":
		/* params : {id,name, storages:[id],cameras:[id], circle, days, from, to}
		 */
		setTimeout(function(){cbFn(Test.editPlan(params));},100);	
		break;
	case "deletePlan" :
		/* params : {ids:[planId]}
		*/	
		setTimeout(function(){cbFn(Test.deletePlan(params));},100);
		break;
	}
};

})();