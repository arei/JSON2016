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

describe("JSON2016.parse", function(){
	it("Default", function(){
		var target = {
			one: 1,
			two: 2
		};

		assert.deepEqual(target,json.parse('{"one":1,"two":2}'));
	});

	it("Comments", function(){
		var target = {
			one: 1,
			two: 2
		};

		assert.deepEqual(target,json.parse('{"one":1,"two":2}'));
		assert.deepEqual(target,json.parse('{"one":1//first,"two":"2"}'));
		assert.deepEqual(target,json.parse('{"one":1,"two":"2"//second}'));
		assert.deepEqual(target,json.parse('{"one":1,"two":"2"}//asdfaasdf'));
		assert.deepEqual(target,json.parse('{//asdf"one":1,"two":"2"}'));
		assert.deepEqual(target,json.parse('//asdfasdf{"one":1,"two":"2"}'));
		assert.deepEqual(target,json.parse('//asdfasdf\n//asdfasdfasdfasdf\n//asdfasdf {"one":1,"two":"2"}'));
		assert.deepEqual(target,json.parse('{"one":1,"two":"2"}//asdfasdfasdf'));
		assert.deepEqual(target,json.parse('//sdfgsdfgsdfg{//asdf"one":1,"two":"2"//second}//sdfgsdfg'));
	});

	it ("Trailing Commas",function(){
		var target = {
			one: 1,
			two: 2
		};

		assert.deepEqual(target,json.parse('{"one":1,"two":"2",}'));
		assert.deepEqual(target,json.parse('{"one":1,,"two":"2"}'));
		assert.deepEqual(target,json.parse('{"one":1,,,,,,,,,"two":"2"}'));
		assert.deepEqual(target,json.parse('{"one":1,,,,,,,,,,"two":"2",	, ,\n,\r,\f,\t}'));
	});

	it("Dates",function(){
		var target = {
			one: 1,
			two: 2,
			date: new Date(1234567890123)
		};

		assert.deepEqual(target,json.parse('{"one":1,"two":2,"date":d1234567890123}'));

	});
});
