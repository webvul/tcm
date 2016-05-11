(function(){
IX.ns("TCM.Util");

var CommonQueryInterval = 5000; // 5 seconds
TCM.Util.PeriodicChecker = function(condFn, checkFn, interval){
	var isStarted = false;
	var intv = interval || CommonQueryInterval;
	var timers = null;
	function _query(){
		if (IX.isFn(condFn) && !condFn()){
			isStarted = false;
			return;
		}
		timers = function(){
			return setTimeout(function(){
				if(isStarted) _query();
			}, intv);
		};
		checkFn(isStarted, timers);
	}
	return {
		start : function(){
			if (!isStarted) _query();
			isStarted = true;
		},
		stop : function(){
			isStarted = false;
			clearTimeout(timers);
		}
	};
};

})();