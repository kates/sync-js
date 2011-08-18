describe("sync lib", function() {
	describe("series function", function() {
		it("should execute function in series", function() {
			var results = [];
			var done = false;
			sync.series([
				function(next) {
					setTimeout(function() {
						results.push(1);
						next();
					}, 3000);
				},
				function(next) {
					setTimeout(function() {
						results.push(2);
						next();
					}, 1000);
				},
				function(next) {
					setTimeout(function() {
						results.push(3);
						next();
					}, 2000);
				}
			],
			function() {
				done = true;
			});

			waitsFor(function() {
				return done;
			}, "never done", 10000);

			runs(function(){
				expect(results[0]).toEqual(1);
				expect(results[1]).toEqual(2);
				expect(results[2]).toEqual(3);
			});
		});
	});
	
	describe("pipe function", function() {
		it("pass result thru a series of function", function() {
			var done = false;
			var finalResult = 0;
			var callbacks = [];
			callbacks.push(function(next) {
				setTimeout(function(){
					next(10);
				}, 3000);
			});
			callbacks.push(function(result, next) {
				setTimeout(function() {
					next(result * 2);
				}, 1000);
			});
			callbacks.push(function(result, next) {
				setTimeout(function() {
					next(result * 3);
				}, 2000);
			});
			sync.pipe(callbacks, function(result) {
				finalResult = result;
				done = true;
			});
			waitsFor(function(){ return done; }, "never done", 10000);
			runs(function() {
				expect(finalResult).toEqual(60);
			});
		});

		it("without a callback", function() {
			var finalResult = 0;
			var done = false;
			var callbacks = [];
			callbacks.push(function(next) {
				setTimeout(function(){
					next(10);
				}, 3000);
			});
			callbacks.push(function(result, next) {
				setTimeout(function() {
					next(result * 2);
				}, 1000);
			});
			callbacks.push(function(result, next) {
				setTimeout(function() {
					next(result * 3);
				}, 2000);
			});
			callbacks.push(function(result, next) {
				finalResult = result;
				done = true;
			});
			sync.pipe(callbacks);
			waitsFor(function(){ return done; }, "never done", 10000);
			runs(function() {
				expect(finalResult).toEqual(60);
			});

		});
	});

	describe("each function", function() {
		it("iterates the list", function() {
			var finalResult = 0;
			var done = false;
			var timeout = 3000;
			sync.each([1,2,3,4], function(next, value, k) {
				setTimeout(function() {
					finalResult += value;
					next();
				}, timeout);
				timeout -= 500;
			}, function() { done = true; });
			
			waitsFor(function() { return done; }, "never done", 10000);
			runs(function() {
				expect(finalResult).toEqual(10);
			});
		});
	});

	describe("map function", function() {
		it("map", function() {
			var finalResult;
			var done = false;
			var timeout = 3000;
			sync.map([1,2,3,4], function(next, v, k) {
				setTimeout(function() {
					next(v * 2);
				}, timeout);
				timeout -= 500;
			}, function(results) {
				finalResult = results;
				done = true;
			});

			waitsFor(function() { return done; }, "never done", 10000);
			runs(function() {
				expect(finalResult[0]).toEqual(2);
				expect(finalResult[1]).toEqual(4);
				expect(finalResult[2]).toEqual(6);
				expect(finalResult[3]).toEqual(8);
			});
		});
	});
});
