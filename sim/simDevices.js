(function(){
IX.ns("Test");

var zoneNames = "站台层,站厅层,通道层,出入口层,设备区层,票务室".split(",");;

var DeviceTypeNums = {
	0: {num: 4, tpl:{
		name: "网管服务<a>aaa</a>器",
		type: 0,
		desc: "网管服务器",
		ip: "192.168.1.",
		port: 1123123222222222222222222,
		version: ""
	}},
	1: {num: 7, tpl: {
		name: "视频服务器", 
		type: 1,
		desc: "视频服务器",
		ip: "192.168.2.",
		port: 1,
		version: "1.0"
	}},
	2: {num: 8, tpl: {
		name: "视频分析服务器", 
		type: 2,
		desc: "视频分析服务器",
		ip: "192.168.3.",
		port: 1,
		version: "1.0"
	}},
	3: {num: 3, tpl: {
		name: "存储服务器", 
		type: 3,
		desc: "存储服务器",
		ip: "192.168.3.",
		port: 1,
		version: "1.0"
	}},
	10: {num: 5, tpl: {
		name: "存储设备", 
		type: 10, 
		diskNum: 1, 
		capacity: '2',
		desc: "存储设备",
		dataIp: "192.168.4.",
		manageIp: "192.168.9.",
		driverId: 3,
		port: 1,
		version: "1.0"	
	}},
	20: {num: 46, tpl:{
		name: "数字固定枪机",
		type: 20,
		style: "ADT-VSDB3MPTW",
		provider: "泰科",
		ip: "192.168.5.",
		port: 0,
		desc: "数字固定枪机kjlas;kjdf;laskjd;flkasjdflkahkdljfhalkjsfhdlkahdflajhdlfkajhdflkjahdflkjhadklfhj",
		version: "1.0",
		channelNum: 1,
		bcAddr: "224.169.1.", 
		bcPort: 1
	}},
	21: {num: 21, tpl: {
		name: "数字半球",
		type: 21, 
		style: "ADT-VSDB3MPTW",
		provider: "泰科",
		ip: "192.168.6.",
		port: 0,
		desc: "数字半球",
		version: "1.0",
		channelNum: 1,
		bcAddr: "224.169.2.", 
		driverId: 1,
		bcPort: 1
	}},
	22: {num: 31, tpl: {
		name: "数字球机",
		type: 22,
		style: "ADT-VSDB3MPTW",
		provider: "泰科",
		ip: "192.168.7.",
		port: 0,
		desc: "数字球机",
		version: "1.0",
		channelNum: 1,
		bcAddr: "224.169.2.", 
		driverId: 1,
		bcPort: 1
	}},
	31: {num: 65, tpl: {
		name: "模拟固定枪机",
		type: 31,
		style: "ADT-VSCB650TW",
		provider: "泰科",
		desc: "模拟固定枪机",
		ip: "192.168.8.",
		coderId: 277,
		channelNo: 1,
		controlType: 1, 
		controlAddr: "192.168.8.1",
		bitsets: 1
	}},
	32: {num: 11, tpl: {
		name: "模拟半球",
		type: 32,
		style: "ADT-VSVD700VF3312",
		provider: "泰科",
		desc: "模拟半球",
		ip: "192.168.8.",
		coderId: 278,
		channelNo: 2,
		controlType: 1, 
		controlAddr: "192.168.8.2",
		bitsets: 1
	}},
	33: {num: 25, tpl: {
		name: "模拟球机",
		type: 33,
		style: "ADT-VSSD540X26PDN",
		provider: "泰科",
		desc: "模拟球机",
		ip: "192.168.8.",
		coderId: 279,
		channelNo: 1,
		controlAddr: "192.168.8.3",
		bitsets: 1,
		commPort: 0,
		dataBit: 0,
		parityBit: 0,
		stopBit: 0
	}},
	40: {num: 105, tpl: {
		name: "定向拾音器",
		type: 40,
		style: "定制",
		provider: "定制",
		desc: "定向拾音器",
		relatedCamera: 1
	}},
	41: {num: 13, tpl: {
		name: "全向拾音器",
		type: 41,
		style: "定制",
		provider: "定制",
		desc: "全向拾音器",
		relatedCamera: 1
	}},
	50: {num: 5, tpl: {
		name: "编码器",
		type: 50,
		style: "S-54",
		provider: "NKF",
		ip: "192.168.8.",
		port: 1,
		desc: "编码器",
		version: "1.0",
		username:"admin",
		password:"admin",
		driverId: 1,
		channelNum: 16,
		bc: IX.map("0".multi(16).split(""), function(item, idx){
			return {
				addr : "192.170.11." + idx,
				port : idx,
				channelNo: idx+1
			};
		})
	}},
	51: {num: 17, tpl: {
		name: "解码器",
		type: 51,
		style: "S-60D-SD",
		provider: "NKF",
		ip: "192.168.9.",
		port: 1,
		desc: "解码器",
		version: "1.0",
		driverId: 1,
		channelNum: 2
	}},
	52: {num: 5, tpl: {
		name: "画面分割器",
		type: 52,
		style: "AP-CH4",
		provider: "AP",
		desc: "画面分割器",
		driverId: 1,
		maxWindow: 9
	}},
	53: {num: 7, tpl: {
		name: "监视器",
		type: 53,
		style: "LC42HD-A",
		provider: "维曼",
		desc: "监视器",
		relatedSpliter: 1
	}},
	54: {num: 1, tpl: {
		name: "控制终端",
		type: 54,
		style: "DELL  T1650",
		provider: "DELL",
		ip: "192.168.10.",
		desc: "控制终端"
	}},
	55: {num: 17, tpl: {
		name: "解码器(带画面分割)",
		type: 55,
		style: "S-60D-SD",
		provider: "NKF",
		ip: "192.168.9.",
		port: 1,
		desc: "解码器(带画面分割)",
		version: "1.0",
		driverId: 1,
		channelNum: 2,
		maxWindow: 4
	}},
	65: {num: 5, tpl: {
		name: "字符叠加器",
		type: 65,
		style: "AP-CH4",
		provider: "AP",
		desc: "字符叠加器",
		driverId: 1
	}},
	60: {num: 1, tpl: {
		name: "交换机",
		type: 60,
		style: "LS-7506E-S",
		provider: "H3C",
		desc: "交换机",
		path: "localhost1"
	}},
	61: {num: 1, tpl: {
		name: "光端机",
		type: 61,
		style: "NV4508-4SD-8SA-DT",
		provider: "安邦新创",
		desc: "光端机",
		path: "localhost2"
	}},
	62: {num: 44, tpl: {
		name: "光纤收发器",
		type: 62,
		style: "FS100-1",
		provider: "亚腾时达",
		desc: "光纤收发器",
		path: "localhost3"
	}},
	63: {num: 1, tpl: {
		name: "数字KVM",
		type: 63,
		style: "KN1108V",
		provider: "ATEN",
		desc: "数字KVM",
		path: "localhost4"
	}},
	64: {num: 1, tpl: {
		name: "数字PDU",
		type: 64,
		style: "PE8208G",
		provider: "ATEN",
		desc: "数字PDU",
		path: "localhost5"
	}},
	90: {num: 1, tpl: {
		name: "其他设备",
		type: 90,
		desc: "其他设备",
		path: "localhost6"
	}}
};

function SiteDevices(site){
	var siteId = site.id, siteType = site.type;
	var DeviceZones = [];
	var DevicesHT = new IX.IListManager();
	var Devices4All = new IX.I1ToNManager();
	var identity = 0, count = 0;
	
	function getDeviceIdsByTypes(types){
		var arr = [];
		for (var i = 0; i < types.length; i++) 
			arr = arr.concat(Devices4All.get(types[i]));
		return arr;
	}
	function getPagedData(arr, pageNo, pageSize){
		return {
			total : arr.length,
			items : IX.partLoop(arr, pageNo* pageSize, pageNo*pageSize + pageSize, [], function(acc, item){acc.push(item); return acc;})
		};
	}
	/*function getDevicesByIds(idArr){ 
		console.log(idArr);
		var all = [];
		for (var i = 0; i < idArr.length; i++) 
			all = all.concat(DevicesHT.get(idArr[i]));
		return all;
	}*/

	function createCommonDevice(arr, morePros){
		IX.iterate(arr, function(type){
			var Tpls = DeviceTypeNums[type];
			for (var i = 0; i < Tpls.num; i++) {
				var obj = IX.inherit(Tpls.tpl, {
					id: 10+identity++,
					name: Tpls.tpl.name + i,
					siteId : siteId,
					ip: (Tpls.tpl.ip || "") + i
				}, morePros);
				DevicesHT.register(obj.id, obj);
				Devices4All.put(Tpls.tpl.type, obj.id);
			}; 
		});
	}

	if(site.type == 2 || site.type == 3){
		for (var i = 0; i < zoneNames.length; i++){
			DeviceZones.push({
				id : i+1,
				name : zoneNames[i],
				siteId : siteId,
				no : "0"+ i,
				desc : "第" + (i + 1) + "分区"
			});
		}

		IX.iterate([20, 21, 22], function(type){
			var Tpls = DeviceTypeNums[type];
			for (var i = 0; i < Tpls.num; i++) {
				var obj = IX.inherit(Tpls.tpl, {
					id: 1000+identity++,
					name: Tpls.tpl.name + i,
					siteId : siteId,
					ip: (Tpls.tpl.ip || "") + i,
					// zoneId: Math.floor(Math.random() * DeviceZones.length),
					bcAddr: Tpls.tpl.bcAddr+(count++),
					driverId: Math.floor(Math.random() * 5),
					controlable: count++ % 2 == 0 ? true : false
				});
				DevicesHT.register(obj.id, obj);
				Devices4All.put(Tpls.tpl.type, obj.id);
			}; 
		});

		IX.iterate([31, 32, 33], function(type){
			var Tpls = DeviceTypeNums[type];
			for (var i = 0; i < Tpls.num; i++) {
				var obj = IX.inherit(Tpls.tpl, {
					id: 2000+identity++,
					name: Tpls.tpl.name + i,
					siteId : siteId,
					ip: (Tpls.tpl.ip || "") + i,
					zoneId: Math.floor(Math.random() * DeviceZones.length),
					driverId: Math.floor(Math.random() * 5),
					controlType: Math.floor(Math.random() * 5),
					controlParams: Math.floor(Math.random() * 5)
				});
				DevicesHT.register(obj.id, obj);
				Devices4All.put(Tpls.tpl.type, obj.id);
			}; 
		});

		var allCameras = getDeviceIdsByTypes([20, 21, 22, 31, 32, 33]);
		createCommonDevice([40, 41], {relatedCamera: allCameras[count++]});

		createCommonDevice([50], {driverId: Math.floor(Math.random() * 5)});

		createCommonDevice([65], {
			driverId: Math.floor(Math.random() * 5),
			relatedCamera: count+2000
		});
	}
	
	createCommonDevice([0, 1, 2, 3, 51, 54, 55], {});

	createCommonDevice([10], {capacity: Math.floor(Math.random()*5 + 1)});

	createCommonDevice([52], {
		maxWindow: [1, 2, 4, 9, 16][Math.floor(Math.random() * 5)],
		driverId: Math.floor(Math.random() * 5),
		decoders: [
			{id: 100, name: "解码器-1", relatedSpliterChannel: 1, channel: 1},
			null,
			{id: 101, name: "解码器-2", relatedSpliterChannel: 2, channel: 2},
			{id: 102, name: "解码器-3", relatedSpliterChannel: 3, channel: 3},
			{id: 103, name: "解码器-4", relatedSpliterChannel: 4, channel: 2}
		]
	});


	createCommonDevice([53], {relatedSpliter: Devices4All.get('52')});

	createCommonDevice([60, 61, 62, 63, 64, 90], {path: count++});

	function getByZoneId(zoneId){
		for (var i = 0; i < DeviceZones.length; i++) {
			if(DeviceZones[i].id == zoneId)
				return DeviceZones[i];
		};
	}

	function getAllZones(siteId){
		var allZones = [];
		var CF = DevicesHT.getByKeys(getDeviceIdsByTypes([20, 31]));
		var CSE = DevicesHT.getByKeys(getDeviceIdsByTypes([21, 32]));
		var CSP = DevicesHT.getByKeys(getDeviceIdsByTypes([22, 33]));
		for (var i = 0; i < DeviceZones.length; i++) {
			var fi = 0, si = 0, spi = 0;
			IX.iterate(CF, function(obj){
				if(obj.zoneId == DeviceZones[i].id)
					fi++;
			});
			IX.iterate(CSE, function(obj){
				if(obj.zoneId == DeviceZones[i].id)
					si++;
			});
			IX.iterate(CSP, function(obj){
				if(obj.zoneId == DeviceZones[i].id)
					spi++;
			});
			allZones.push({
				id: DeviceZones[i].id,
				name: DeviceZones[i].name,
				total:{
					fixed: fi,
					semi: si,
					sphere: spi
				}
			});
		};
		var obj = {
			siteId: siteId,
			zones: allZones
		};
		var arr = [];
		arr.push(obj);
		return arr;
	}
	//新增分区
	/**
	 * params{
	 * 	name
	 * }
	 */
	function addZone(params){
		var obj = {
			id: DeviceZones.length+1,
			name: params.name,
			siteId : params.siteId,
			no : "0"+ DeviceZones.length,
			desc : "第" + (DeviceZones.length + 1) + "分区"
		};
		DeviceZones.push(obj);
		return {
			id: obj.id,
			name: params.name,
			total: {
				fixed: 0,
				semi: 0,
				sphere: 0 
			}
		}
	}
	//修改分区
	/**
	 * params{
	 * 	id,
	 * 	name
	 * }
	 */
	function editZone(params){
		getByZoneId(params.id).name = params.name;
	}

	//删除分区
	/**
	 * params{
	 * 	ids: [id1, id2...]
	 * }
	 */
	function deleteZone(params){
		var allCameras = DevicesHT.getByKeys(getDeviceIdsByTypes([20, 21, 22, 31, 32, 33]));
		for (var i = 0; i < params.ids.length; i++) {
			for (var j = 0; j < DeviceZones.length; j++) {
				if(params.ids[i] == DeviceZones[j].id){
					IX.iterate(allCameras, function(obj){
						if(obj.zoneId == DeviceZones[j].id)
							obj.zoneId = null;
					});
					DeviceZones.splice(j, 1);
				}
			}
		}
	}


	function getAllZoneCameras(siteId){
		var allZones = [];
		var cameras = DevicesHT.getByKeys(getDeviceIdsByTypes([20, 21, 22, 31, 32, 33]));
		for (var i = 0; i < DeviceZones.length; i++) {
			var zone = DeviceZones[i];
			if (zone.siteId != siteId) continue;
			var zoneId = zone.id;
			var zoneData = {name : zone.name};
			zoneData.cameras = IX.loop(cameras, [], function(acc, c){
				if (c.zoneId == zoneId)
					acc.push({id : c.id, type:c.type, name:c.name});
				return acc;
			});
			allZones.push(zoneData);
		}

		return allZones;
	}

	//列出分区所有摄像机
	/**
	 * params{
	 * 	siteId,
	 * 	id: zoneId,
	 * 	types: [],
	 * 	pageNo,
	 * 	pageSize
	 * }
	 */
	function getCamerasByZone(params){
		var arr = [];
		IX.iterate(DevicesHT.getByKeys(getDeviceIdsByTypes(params.types)), function(obj){
			if(params.id == obj.zoneId)
				arr.push(obj);
		});
		return getPagedData(arr, params.pageNo, params.pageSize);
	} 
	//获取所有无分区摄像机
	function getCamerasByNoZone(){
		var arr = [];
		var allCameras = DevicesHT.getByKeys(getDeviceIdsByTypes([20, 21, 22, 31, 32, 33]));
		IX.iterate(allCameras, function(obj){
			if (!obj)
				return;
			if(obj.zoneId == null && obj.id){
				arr.push({
					id: obj.id,
					name: obj.name,
					type: obj.type
				});
			}
		});
		return arr;
	}
	//添加摄像机到当前分区
	/**
	 * params{
	 * 	id: zoneId,
	 * 	cameras: [cameraId1, cameraId2...],
	 * }
	 */
	function addCamerasToZone(params){
		var siteId = Test.getCurrentSite().id;
		var obj = null;
		IX.iterate(params.cameras, function(id){
			var type = DevicesHT.get(id).type;
			DevicesHT.register(id, {
				zoneId: params.id,
				type: type
			});
			Devices4All.put(type, id);
		});
		IX.iterate(getAllZones(siteId)[0].zones, function(zone){
			if(zone.id == params.id){
				obj = zone.total;
			}
		});
		return obj;
	}
	//从分区中删除摄像机
	/**
	 * params{
	 * 	id: zoneId
	 * 	cameras: [cameraId1, cameraId2...]
	 * }
	 */
	function deleteCamerasFromZone(params){
		var allCameras = DevicesHT.getByKeys(getDeviceIdsByTypes([20, 21, 22, 31, 32, 33]));
		var siteId = Test.getCurrentSite().id;
		IX.iterate(allCameras, function(obj){
			if(obj.zoneId == params.id){
				for (var i = 0; i < params.cameras.length; i++) {
					if(params.cameras[i] == obj.id)
						obj.zoneId = null;
				};
			}
		});
		return getAllZones(siteId)[0].zones.total;
	}

	//列出所有设备
	function getAllDevices(siteId){
		var DevicesTypes = [1, 2, 3, 10, 20, 21, 22, 31, 32, 33, 40, 41, 50, 51, 52, 53, 54, 55, 60, 61, 62, 63, 64, 65, 90];
		if(siteType == 1)
			DevicesTypes = [0, 1, 2, 3, 10, 51, 52, 53, 54, 55, 60, 61, 62, 63, 64, 90];
		var allDevices = [];
		for (var i = 0; i < DevicesTypes.length; i++) {
			allDevices.push({
				type: DevicesTypes[i],
				count: Devices4All.get(DevicesTypes[i]).length
			});
		};
		var obj = {
			siteId: siteId,
			devices: allDevices,
		}
		var arr = [];
		arr.push(obj);
		return arr;
	}
	//列出某类型设备
	/**
	 * params{
	 * 	types: DeviceType,
	 * 	pageNo,
	 * 	pageSize 
	 * }
	 */
	function getDevices4Type(params){
		var itemIds = [];
		IX.iterate(params.types,function(type){
			var allIds4Type = Devices4All.get(type);
			itemIds = itemIds.concat(allIds4Type);
		});
		return getPagedData(DevicesHT.getByKeys(itemIds), params.pageNo, params.pageSize);
	}
	function getAllNotRelatedCameras(params){
		var itemIds = [];
		IX.iterate([20, 21, 22],function(type){
			var allIds4Type = Devices4All.get(type);
			itemIds = itemIds.concat(allIds4Type);
		});
		var objs = DevicesHT.getByKeys(itemIds);
		return {notRelatedCameras: IX.loop(objs, [], function(acc, obj){
			acc.push({id: obj.id, name: obj.name});
			return acc;
		})};
	}	

	function getAllNotRelatedDecoders(params){
		var itemIds = Devices4All.get(51);
		var objs = DevicesHT.getByKeys(itemIds);
		return {notRelatedDecoders: IX.loop(objs, [], function(acc, obj){
			acc.push({id: obj.id, name: obj.name, notRelatedChannels: IX.map("0".multi(obj.channel).split(""), function(item, idx){
				return idx+1;
			})});
			return acc;
		})};
		// return {notRelatedDecoders: []};
	}

	//增加设备
	/**
	 * params{
	 * 	name,
	 * 	type,
	 * }
	 */
	function addDevice(params){
		var Tpl = DeviceTypeNums[params.type];
		var thisId = identity++;
		DevicesHT.register(thisId, IX.inherit(Tpl.tpl, {
			id: thisId,
			name: params.name,
			ip: Tpl.tpl.ip + thisId
		}));
		Devices4All.put(params.type, thisId); 
		return DevicesHT.get(thisId);
	}

	/**修改设备
	 * params{
	 * 	id,
	 * 	name,
	 * }
	 */
	function editDevice(params){
		DevicesHT.get(params.id).name = params.name;
	}

	/**删除设备
	 * params{
	 * 	ids: [deviceId1, deviceId2...]
	 * }
	 */
	function deleteDevices(params){
		var arr = DevicesHT.getByKeys(params.ids);
		for (var i = 0; i < params.ids.length; i++) {
			DevicesHT.remove(params.ids[i]);
			Devices4All.remove(arr[i].type, params.ids[i]);
		};
	}
var result = [];
var monitor = DevicesHT.getByKeys(Devices4All.get(53));
var spliter = DevicesHT.getByKeys(Devices4All.get(52));
var decoder = DevicesHT.getByKeys(Devices4All.get(51));
var specialDecoder = DevicesHT.getByKeys(Devices4All.get(55));
	function getVideoWalls(params){
		// result = []
		// for (var i = 0; i < 3; i++) {
		// 	result.push({
		// 		id : i,
		// 		monitor: {
		// 			id: monitor[i].id,
		// 			name: monitor[i].name,
		// 			provider :monitor[i].provider,
		// 			style:monitor[i].style
		// 		},
		// 		spliter: {
		// 			id: spliter[i].id,
		// 			name: spliter[i].name,
		// 			driverId :spliter[i].driverId,
		// 			type: 52
		// 		}
		// 	});
		// };
		return result;
	}

	function getVideoWall(params){
		if($XP(params,"id")||$XP(params,"id")==0){
			return {id: result[params.id-1].id, monitor: result[params.id-1].monitor, spliter: result[params.id-1].spliter||{}, decoder: result[params.id-1].decoder||{},
				specialDecoder: result[params.id-1].specialDecoder || {}, relatedChannel: result[params.id-1].relatedChannel || "",
				notRelatedMonitor:IX.loop(DevicesHT.getByKeys(Devices4All.get(53)), [], function(acc, monitor){
					var flag=true;
					for(var i=0;i<result.length;i++){
						if(result[i].monitor.id==monitor.id)
							flag=false;
					}
					if(flag)
						acc.push(monitor);
					return acc;
				}),
				notRelatedSpliter:IX.loop(DevicesHT.getByKeys(Devices4All.get(52)), [], function(acc, spliter){
					var flag=true;
					for(var i=0;i<result.length;i++){
						if(result[i].spliter&&result[i].spliter.id==spliter.id)
							flag=false;
					}
					if(flag)
						acc.push(IX.inherit(spliter, {channels: [1, 2, 3]}));
					return acc;
				}),
				notRelatedDecoder:IX.loop(DevicesHT.getByKeys(Devices4All.get(51)), [], function(acc, decoder){
					var flag=true;
					for(var i=0;i<result.length;i++){
						if(result[i].decoder&&result[i].decoder.id==decoder.id)
							flag=false;
					}
					if(flag)
						acc.push(IX.inherit(decoder, {channels: [6, 1, 3]}));
					return acc;
				}),
				notRelatedSpecialDecoder: IX.loop(DevicesHT.getByKeys(Devices4All.get(55)), [], function(acc, specialDecoder){
					var flag = true;
					for (var i = 0; i < result.length; i++) {
						if(result[i].specialDecoder&&result[i].specialDecoder.id==specialDecoder.id)
							flag=false;
					}
					if(flag)
						acc.push(IX.inherit(specialDecoder, {channels: [4, 2, 3]}));
					return acc;
				})
			};
		}else{
			return {monitor: {}, spliter: {}, decoder: {}, specialDecoder: {}, relatedChannel: "",
				notRelatedMonitor:IX.loop(DevicesHT.getByKeys(Devices4All.get(53)), [], function(acc, monitor){
					var flag=true;
					for(var i=0;i<result.length;i++){
						if(result[i].monitor.id==monitor.id)
							flag=false;
					}
					if(flag)
						acc.push(monitor);
					return acc;
				}),
				notRelatedSpliter:IX.loop(DevicesHT.getByKeys(Devices4All.get(52)), [], function(acc, spliter){
					var flag=true;
					for(var i=0;i<result.length;i++){
						if(result[i].spliter&&result[i].spliter.id==spliter.id)
							flag=false;
					}
					if(flag)
						acc.push(IX.inherit(spliter, {channels: [1, 2, 3]}));
					return acc;
				}),
				notRelatedDecoder:IX.loop(DevicesHT.getByKeys(Devices4All.get(51)), [], function(acc, decoder){
					var flag=true;
					for(var i=0;i<result.length;i++){
						if(result[i].decoder&&result[i].decoder.id==decoder.id)
							flag=false;
					}
					if(flag)
						acc.push(IX.inherit(decoder, {channels: [1, 2, 4]}));
					return acc;
				}),
				notRelatedSpecialDecoder: IX.loop(DevicesHT.getByKeys(Devices4All.get(55)), [], function(acc, specialDecoder){
					var flag = true;
					for (var i = 0; i < result.length; i++) {
						if(result[i].specialDecoder&&result[i].specialDecoder.id==specialDecoder.id)
							flag=false;
					}
					if(flag)
						acc.push(IX.inherit(specialDecoder, {channels: [1, 3, 6]}));
					return acc;
				})
			};
		}
	}
	function addVideoWall(params){
		var obj;
		var x1=IX.loop(monitor, [], function(acc, mon){
				if(mon.id==params.monitor)
				acc.push(mon);
			return acc;
			});
		if(params.spliter){
			var x2=IX.loop(spliter, [], function(acc, spl){
				if(spl.id==params.spliter)
					acc.push(spl);
			return acc;
			});
			obj={
				id:result.length+1,
				monitor:x1[0],
				spliter:x2[0],
				relatedChannel: 1
			}
		}else if(params.decoder){
			var x3=IX.loop(decoder, [], function(acc, dec){
				if(dec.id==params.decoder)
				acc.push(dec);
			return acc;
			});
			obj={
				id:result.length+1,
				monitor:x1[0],
				decoder:x3[0],
				relatedChannel: 2
			}
		}else {
			var x4=IX.loop(specialDecoder, [], function(acc, dec){
				if(dec.id==params.specialDecoder)
				acc.push(dec);
			return acc;
			});
			obj={
				id:result.length+1,
				monitor:x1[0],
				specialDecoder:x4[0],
				relatedChannel: 4
			}
		}
		result.push(obj);
		return obj;
	}
	function deleteVideoWall(params){
		result=IX.loop(result, [], function(acc, one){
			if(one.id!=params.ids[0])
			acc.push(one);
			return acc;
		});
	}
	function editVideoWall(params){
		var obj;
		var x1=IX.loop(monitor, [], function(acc, mon){
				if(mon.id==params.monitor)
				acc.push(mon);
			return acc;
			});
		if(params.spliter){
			var x2=IX.loop(spliter, [], function(acc, spl){
				if(spl.id==params.spliter)
				acc.push(spl);
			return acc;
			});
			obj={
				id:params.id,
				monitor:x1[0],
				spliter:x2[0],
				relatedChannel: 1
			}
		}else if(params.decoder){
			var x3=IX.loop(decoder, [], function(acc, dec){
				if(dec.id==params.decoder)
				acc.push(dec);
			return acc;
			});
			obj={
				id:params.id,
				monitor:x1[0],
				decoder:x3[0],
				relatedChannel: 2
			}
		}else {
			var x4=IX.loop(specialDecoder, [], function(acc, dec){
				if(dec.id==params.specialDecoder)
				acc.push(dec);
			return acc;
			});
			obj={
				id:params.id,
				monitor:x1[0],
				specialDecoder:x4[0],
				relatedChannel: 5
			}
		}
		result[params.id-1]=obj;
		return obj;

	}

	function getMap(params){
		var obj = IX.inherit(params, {
			id: params.zoneId,
			pageNo: 0,
			pageSize: 30,
			types: [20,21,22,31,32,33]
		});
		var allCameras = getCamerasByZone(obj);
		var arr = IX.loop(allCameras.items, [], function(acc, camera, idx){
			IX.loop(MapDevice, [], function(acc1, r){
				if (camera.id==r.id){
					acc.push(IX.inherit(camera, {
				x: r.x,
				y: r.y
			}));}else acc.push(IX.inherit(camera, {
				x: Math.floor(Math.random()*5000),
				y: Math.floor(Math.random()*1000)+1000
			}));

			});
			
			return acc;
		});
		return {
			url: "img.jpg",
			width: 14956,
			height: 2502,
			cameras: arr
		};
	}

	return {
		getDevicesHT: function(){return DevicesHT.getAll();},
		Devices4All: Devices4All,
		getDeviceIdsByTypes: getDeviceIdsByTypes,
		getByZoneId: function(zoneId){return getByZoneId(zoneId);},
		getAllZones: function(siteId){return getAllZones(siteId);},
		addZone: function(params){return addZone(params);},
		editZone: function(params){return editZone(params);},
		deleteZone: function(params){return deleteZone(params);},
		
		getAllZoneCameras: getAllZoneCameras,
		getCamerasByZone: function(params){return getCamerasByZone(params);},
		getCamerasByNoZone: function(){return getCamerasByNoZone();},
		addCamerasToZone: function(params){return addCamerasToZone(params);},
		deleteCamerasFromZone: function(params){return deleteCamerasFromZone(params);},
		getAllDevices: function(siteId){return getAllDevices(siteId);},
		getDevices4Type: function(params){return getDevices4Type(params);},
		addDevice: function(params){return addDevice(params);},
		editDevice: function(params){return editDevice(params);},
		deleteDevices: function(params){return deleteDevices(params);},
		getVideoWalls: function(params){return getVideoWalls(params);},
		getVideoWall: function(params){return getVideoWall(params);},
		addVideoWall: function(params){return addVideoWall(params);},
		deleteVideoWall:function(params){return deleteVideoWall(params);},
		editVideoWall:function(params){return editVideoWall(params);},
		getAllNotRelatedCameras: function(params){return getAllNotRelatedCameras(params);},
		getAllNotRelatedDecoders: function(params){return getAllNotRelatedDecoders(params);},
		getMap: function(params){ return getMap(params);}
	}
}

var siteDevicesHT= new IX.IListManager();
Test.createSites = function(sites){
	IX.iterate(sites, function(site){siteDevicesHT.register(site.id, new SiteDevices(site));});
};
Test.hasKey4HT = function(key){
	return siteDevicesHT.hasKey(key);
}
Test.getDevicesHT = function(){
	var site = Test.getCurrentSite();
	var siteDevices = siteDevicesHT.get(site.id);
	return  siteDevices.getDevicesHT();
};
Test.getByZoneId = function(params) {
	var site = Test.getCurrentSite();
	var siteDevices = siteDevicesHT.get(site.id);
	return siteDevices.getByZoneId(params.zoneId);
};

Test.getAllZones = function(){
	var sites = Test.getCurrentSite();
	if(Array.isArray(sites)){
		return IX.map(sites,function(site){
			var siteDevices = siteDevicesHT.get(site.id);
			return siteDevices.getAllZones(site.id).pop();
		});
	}else{
		var siteDevices = siteDevicesHT.get(sites.id);
		return siteDevices.getAllZones(sites.id);
	}
};


Test.addZone = function(params){
	var site = Test.getCurrentSite();
	var siteDevices = siteDevicesHT.get(site.id);
	return siteDevices.addZone(params);
};
Test.editZone = function(params){
	var site = Test.getCurrentSite();
	var siteDevices = siteDevicesHT.get(site.id);
	return siteDevices.editZone(params);
};
Test.deleteZone = function(params){
	var site = Test.getCurrentSite();
	var siteDevices = siteDevicesHT.get(site.id);
	return siteDevices.deleteZone(params);
};
Test.getCamerasByZone = function(params){
	var siteDevices = siteDevicesHT.get(params.siteId);
	return siteDevices.getCamerasByZone(params);
};

function getSiteZoneAndCameras(siteId){
	var siteDevices = siteDevicesHT.get(siteId);
	return [siteId, siteDevices.getAllZoneCameras(siteId)];
}
Test.getAllCameras = function(){
	var _site = Test._getCurrentSite();
	if (_site.type == 2 || _site.type == 3)
		return [getSiteZoneAndCameras(_site.id)];

	return IX.loop(Test._getAllSites(), [], function(acc, site){
		if (site && (site.type == 2 || site.type == 3))
			acc.push(getSiteZoneAndCameras(site.id));
		return acc;
	});
};
Test.getCamerasByNoZone = function(){
	var site = Test.getCurrentSite();
	var siteDevices = siteDevicesHT.get(site.id || site[0].id);
	return siteDevices.getCamerasByNoZone();
};
Test.addCamerasToZone = function(params){
	var site = Test.getCurrentSite();
	var siteDevices = siteDevicesHT.get(site.id);
	return siteDevices.addCamerasToZone(params);
};
Test.deleteCamerasFromZone = function(params){
	var site = Test.getCurrentSite();
	var siteDevices = siteDevicesHT.get(site.id);
	return siteDevices.deleteCamerasFromZone(params);
};


Test.getAllDevices = function(){
	var sites = Test.getCurrentSite();
	if(Array.isArray(sites)){
		return IX.map(sites,function(site){
			var siteDevices = siteDevicesHT.get(site.id);
			return siteDevices.getAllDevices(site.id).pop();
		});
	}else{
		var siteDevices = siteDevicesHT.get(sites.id);
		return siteDevices.getAllDevices(sites.id);
	}
};

Test.getDevices4Type = function(params){
	var siteDevices = siteDevicesHT.get(params.siteId);
	return siteDevices.getDevices4Type(params);
};

Test.getAllNotRelatedCameras = function(params){
	var sites = Test.getCurrentSite();
	var siteDevices = siteDevicesHT.get(sites.id);
	return siteDevices.getAllNotRelatedCameras(params);
};

Test.getAllNotRelatedDecoders = function(params){
	var sites = Test.getCurrentSite();
	if(Array.isArray(sites)){
		var siteDevices = siteDevicesHT.get(1);
		return siteDevices.getAllNotRelatedDecoders(params);
	}else{
		var siteDevices = siteDevicesHT.get(sites.id);
		return siteDevices.getAllNotRelatedDecoders(params);
	}
};

Test.addDevice = function(params){
	var sites = Test.getCurrentSite();
	if(Array.isArray(sites)){
		var siteDevices = siteDevicesHT.get(1);
		return siteDevices.addDevice(params);
	}else{
		var siteDevices = siteDevicesHT.get(sites.id);
		return siteDevices.addDevice(params);
	}
};
Test.editDevice = function(params){
	var sites = Test.getCurrentSite();
	if(Array.isArray(sites)){
		var siteDevices = siteDevicesHT.get(1);
		return siteDevices.editDevice(params);
	}else{
		var siteDevices = siteDevicesHT.get(sites.id);
		return siteDevices.editDevice(params);
	}
};
Test.deleteDevices = function(params){
	var sites = Test.getCurrentSite();
	if(Array.isArray(sites)){
		var siteDevices = siteDevicesHT.get(1);
		return siteDevices.deleteDevices(params);
	}else{
		var siteDevices = siteDevicesHT.get(sites.id);
		return siteDevices.deleteDevices(params);
	}
};
Test.getVideoWalls = function(params){
	var siteId = null;
	if($XP(params,"siteId")){
		siteId = params.siteId;
	}else{
		siteId = Test.getCurrentSite().id || Test.getCurrentSite()[0].id;
	}
	var siteDevices = siteDevicesHT.get(siteId);
	return siteDevices.getVideoWalls(params);
};
Test.getVideoWall = function(params){
	var sites = Test.getCurrentSite();
	if(Array.isArray(sites)){
		var siteDevices = siteDevicesHT.get(1);
		return siteDevices.getVideoWall(params);
	}else{
		var siteDevices = siteDevicesHT.get(sites.id);
		return siteDevices.getVideoWall(params);
	}
};
Test.addVideoWall = function(params){
	var sites = Test.getCurrentSite();
	if(Array.isArray(sites)){
		var siteDevices = siteDevicesHT.get(1);
		return siteDevices.addVideoWall(params);
	}else{
		var siteDevices = siteDevicesHT.get(sites.id);
		return siteDevices.addVideoWall(params);
	}
}
Test.deleteVideoWall=function(params){
	var sites = Test.getCurrentSite();
	if(Array.isArray(sites)){
		var siteDevices = siteDevicesHT.get(1);
		return siteDevices.deleteVideoWall(params);
	}else{
		var siteDevices = siteDevicesHT.get(sites.id);
		return siteDevices.deleteVideoWall(params);
	}
}
Test.editVideoWall=function(params){
	var sites = Test.getCurrentSite();
	if(Array.isArray(sites)){
		var siteDevices = siteDevicesHT.get(1);
		return siteDevices.editVideoWall(params);
	}else{
		var siteDevices = siteDevicesHT.get(sites.id);
		return siteDevices.editVideoWall(params);
	}
}
Test.getMap = function(params){
	var siteDevices = siteDevicesHT.get(params.siteId);
	return siteDevices.getMap(params);
};
var MapDevice=[{id:1,zoneId:1,x:1,y:1}];
Test.addDeviceOfMap=function(params){
	MapDevice.push({id:params.id,zoneId:params.zoneId,x:params.x,y:params.y});
};
Test.editDeviceOfMap=function(params){
	MapDevice = IX.loop(MapDevice, [], function(acc, camera){
		if(!camera){
			acc.push({id:camera.id,zoneId:params.zoneId,x:params.x,y:params.y});
		}else if (camera.id==params.id){
			acc.push({id:camera.id,zoneId:params.zoneId,x:params.x,y:params.y});
		}else{
			acc.push(camera);
		}
		return acc;
	});
};
Test.deleteDeviceOfMap=function(params){
	MapDevice = IX.loop(MapDevice, [], function(acc, camera){
		if (camera.id!=params.id){
			acc.push(camera);
		}
		return acc;
	});
};
Test.getCamerasNotInMap = function(params){
	return Test.getCamerasByNoZone();
};

var drivers = IX.map("0".multi(20).split(""), function(item, idx){
	return {
		id: idx,
		provider: "大华海信大华海信大华海信大华海信".slice(Math.floor(Math.random() * 5), Math.floor(Math.random() * 5+5)),
		style: "akdaskdkweiohgvkasjdhegjljh".slice(Math.floor(Math.random() * 5), Math.floor(Math.random() * 15 +5)),
		type: [10,202122,33,50,51,52,55,65][Math.floor(Math.random() * 8)]
	}
});

Test.getDriver = function(params){
	return drivers;
};

Test.isRelatePickup = function(){
	var isRelate = Math.floor((Math.random()* 200))% 2 == 0? true: false;
	return isRelate? {msg: "该摄像机已关联拾音器，更改类型后将解除关联关系！"}: {msg: ""};
};
Test.getAllCoders = function(params){
	var coder = DeviceTypeNums[50].tpl;
	var acc=[];
	for (var i = 1; i < 6; i++){
		var obj = {
			id: 276+i,
			name: coder.name + i,
			channels: [{channelNo:1,used:1},{channelNo:2,used:0}]
		};
		acc.push(obj);
	}; 
	return acc;
}
})();
