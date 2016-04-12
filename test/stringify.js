"use strict";

var json = require("../JSON2016.js");

var assert = require("assert");

if (!global || !global.describe || !(global.describe instanceof Function)) {
	global.describe = function(name,f) {
		f(function(){});
	};
	global.it = function(name,f) {
		f(function(){});
	};
}

describe("JSON2016.stringify", function(){
	it("Default", function(){
		var target = {
			one: 1,
			two: 2
		};

		assert.deepEqual(json.stringify(target),'{"one": 1,"two": 2}');
	});

	it("Dates",function(){
		var target = {
			one: 1,
			two: 2,
			date: new Date(1234567890123)
		};

		assert.deepEqual(json.stringify(target),'{"one": 1,"two": 2,"date": d1234567890123}');
		console.log(json.stringify(target,null,2));

		var nested = {
			one: 1,
			two: 2,
			three: {
				date: new Date(1234567890123)
			},
			four: [
				new Date(1234567890123)
			]
		};

		assert.deepEqual(json.stringify(nested),'{"one": 1,"two": 2,"three": {"date": d1234567890123},"four": [d1234567890123]}');
	});
});
