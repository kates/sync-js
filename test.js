var sync = require('./sync').sync;
console.log("starting");

sync.series(
	function(next) {
		setTimeout(function(){
			console.log("1");
			next();
		}, 3000);
	},
	function(next) {
		setTimeout(function() {
			console.log("2");
			next();
		}, 1000);
	},
	function(next) {
		setTimeout(function() {
			console.log("3");
			next();
		}, 2000);
	}
);

console.log("end");

