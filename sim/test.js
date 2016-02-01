require("../_tasks/_lib/ix.js");
IX.ns("Test");
require("../src/ixw/lib/const.js");
require("./simDevices.js");
require("./sim.js");

var util = require('util');

var data = Test.getData4TCM();

var s = JSON.stringify(data).replace(/\:/g, " : ")
.replace(/,\"/g, ",\n\"").replace(/\{/g, "{\n").replace(/\}/g, "\n}");

var strArr = s.split("\n");

var level = 0;
for (var i =0; i<strArr.length; i++){
	var str = strArr[i];
	if (str.substring(0,1)=="}")
		level --;
	strArr[i] = "\t".multi(level) + str;
	if (str.substring(str.length-1) == "{")
		level ++;
}

console.log(strArr.join("\n"));
