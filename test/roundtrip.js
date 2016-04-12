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

describe("JSON2016", function(){
	it("Simple", function(){
		var target = {
			one: 1,
			two: 2
		};

		assert.deepEqual(json.parse(json.stringify(target)),target);
	});

	it("Complex", function(){
		var target = {
			one: 1,
			two: 2,
			three: {
				one: 31,
				two: 3.2,
				true: true,
				false: false,
				five: "thirty five",
				six: [
					36,
					3.6,
					"thirty six",
					{
						one: 36.1,
						two: 362,
						three: "three hundred sixty three",
						four: [
							{
								one: 1,
								two: 2,
								date: 1234567890123
							},
							{
								three: 3,
								two: 2,
								date: 1234567890123
							}
						]
					}
				]
			}
		};

		assert.deepEqual(json.parse(json.stringify(target)),target);
	});



});
