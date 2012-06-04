define(function() {
// TODO: abstract duplicate codes.
	var sync = {
		pipe: function(callbacks, done) {
			var next = function(result) {
				var args = Array.prototype.slice.apply(arguments);
				var callback = callbacks.shift();
				if (callback) {
					args.push(next);
					callback.apply(null, args);
				} else {
					done && done.apply(null, args);
				}
			};
			next();
		},

		series: function(callbacks, done) {
			this.pipe(callbacks, done);
		},

		each: function(arr, iterator, done) {
			var items = [];
			var next = function() {
				var item = items.shift();

				if (item) {
					item.unshift(next);
					iterator.apply(null, item);
				} else {
					done && done();
				}
			};

			items = this.normalize(arr);

			next();
		},

		map: function(arr, iterator, done) {
			var items = [];
			var results = [];
			var next = function(result) {
				results.push(result);
				var item = items.shift();
				if (item) {
					item.unshift(next);
					iterator.apply(null, item);
				} else {
					done && done(results);
				}
			};

			var start = function() {
				var item = items.shift();
				if (item) {
					item.unshift(next);
					iterator.apply(null, item);
				} else {
					done && done(results);
				}
			};

			items = this.normalize(arr);

			start();
		},

		reduce: function(arr, iterator, initial, done) {
			var items = [];

			var next = function(result) {
				var item = items.shift();
				if (item) {
					item.unshift(result);
					item.unshift(next);
					iterator.apply(null, item);
				} else {
					done && done(result);
				}
			};
			
			items = this.normalize(arr);

			next(initial);
		},

		detect: function(arr, iterator, done) {
			var items = [];
			var currentItem;

			var next = function(result) {
				if (result) {
					done && done(arr[currentItem]);
				}
				var item = items.shift();
				if (item) {
					currentItem = item[1];
					item.unshift(next);
					iterator.apply(null, item);
				} else {
					done && done(undefined);
				}
			};

			items = this.normalize(arr);

			next(false);
		},

		while: function(test, body, done) {
			var next = function() {
				if (test()) {
					body.apply(null, [next]);
				} else {
					done && done(undefined);
				}
			}
			next();
		},

		normalize: function(src) {
			var items = [];

			if (src instanceof Array) {
				for (var i = 0; i < src.length; i++) {
					items.push([src[i], i]);
				}
			} else {
				for(var i in src) {
					if (src.hasOwnProperty(i)) {
						dest.push([src[i], i]);
					}
				}
			}

			return items;
		}
	};

	return sync;
});

