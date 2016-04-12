/*
	JSON2016 - A modern refresh of JSON with additions for trailing
	commas, dates, and comments.

	Copyright 2016, Glen R. Goodwin

	MIT Licensed
 */

"use strict";

var originalParse = JSON.parse;
var originalStringify = JSON.stringify;

var walk = function(obj) {
	if (obj===undefined) return undefined;
	if (obj===null) return null;
	if (obj===true || obj===false) return obj;

	var type = typeof(obj);

	if (type==="number") return obj;
	if (obj && type==="string" && obj.match(/^~D#~D~\d+~$/)) {
		var epoch = parseInt(obj.slice(6,-1));
		return new Date(epoch);
	}

	var keys = Object.keys(obj);
	keys.forEach(function(key){
		obj[key] = walk(obj[key]);
	});

	return obj;
};

/**
 * Replaces the JSON.parse function and does some pre and post processing to
 * handle trailing commas, comments, and dates.
 *
 * Comments may be of the following forms:
 *
 *  // start of json
 * 	{
 * 		// comment at the start of an object literal
 * 		// and it can be multi-line.
 *
 * 		"one": 1, 		// comment after a value
 * 		"two": 2 		// works regardless of comma or tabs/space/newlines
 *
 * 		// comment at the end of an object literal
 *  }
 *  // end of json
 *
 * Trailing commas are removed in the following cases:
 *
 * 	{
 * 		"one": 1,
 * 	}
 *
 * Trailing commas handle mupltiple redundant commas as well.
 * 	{
 * 		"one": 1,,,,,,
 * 	}
 *
 * Any json with a valid date encoded as "d123456" will be converted to
 * a JS Date object.  "d" signifies a Date object.  The number following it
 * is a standard numeric date epoch value.
 *
 * Known Side effects...
 *
 * 	- Multiple commas in valid strings will be reduced to a single comma.
 *
 *  - Anything of the form "~D#~D~\d+~" (ie "~D#~D~12345~") as its own
 * 	  String will be treated as a date.  This is pretty rare.
 *
 */
var parse = function(s) {
	var hasDates = false;

	if (typeof(s)==="string") {
		// handle comments
		s = s.replace(/^\/\/[^{]*[{]/,"{");
		s = s.replace(/\/\/.*?([,}"\n\r\v\f])/g,"$1");
		s = s.replace(/\/\/.*?$/g,"");
		s = s.replace(/(\\\*.*?\*\\)/g,"");

		// handle trailing commas
		s = s.replace(/(\,[\s\t\n\r\v\f]*){2,}/g,",");
		s = s.replace(/\,([\s\t\n\r\v\f]*[}])/g,"$1");
		s = s.replace(/^\,|\,$/g,"");

		// handle dates
		if (s.match(/\:[\s\t\n\r\v\f]*d(\d+)/g)) {
			hasDates = true;
			s = s.replace(/\:[\s\t\n\r\v\f]*d(\d+)/g,":\"~D#~D~$1~\"");
		}
	}

	var obj = originalParse(s);
	if (hasDates) walk(obj);

	return obj;
};

/**
 * Internal method for padding string with spaces.
 */
var pad = function(padding) {
	var s = "";
	for (var i=0;i<padding;i++) s += " ";
	return s;
};

/**
 * Replaces the JSON.stringify function. The only change for stringify is to make
 * sure dates coming out are encoded in the form "d1234567" where the number is
 * a valid date epoch long.
 */
var stringify = function(obj,f,padding,depth) {
	depth = depth || 1;

	if (obj===undefined) return "";
	if (obj===null) return "null";

	if (obj===true) return "true";
	if (obj===false) return "false";

	var type = typeof(obj);
	if (type==="number") return originalStringify(obj,null,padding);
	if (type==="string") return originalStringify(obj,null,padding);

	if (obj instanceof Date) return "d"+obj.getTime();

	if (obj instanceof Array) {
		return "["+obj.map(function(value){
			return (padding?"\n":"")+pad(padding*depth)+stringify(value,f,padding,depth+1);
		}).join(",")+(padding?"\n":"")+pad(padding*(depth-1))+"]";
	}

	return "{"+Object.keys(obj).map(function(key){
		return (padding?"\n":"")+pad(padding*depth)+"\""+key+"\": "+stringify(obj[key],f,padding,depth+1);
	}).join(",")+(padding?"\n":"")+pad(padding*(depth-1))+"}";
};

/**
 * "Installs" JSON2016 to the global space overloading the existing JSON.parse and
 * JSON.stringify method.  Additionally, the original JSON.parse and JSON.stringify
 * methods are preserved in the JSON.original.parse and JSON.original.stringify
 * functions.
 */
var install = function() {
	if (typeof(window)!=="undefined" && window.JSON) {
		window.JSON.original = {
			parse: window.JSON.parse,
			stringify: window.JSON.stringify
		};
		window.JSON.parse = parse;
		window.JSON.stringify = stringify;
	}

	if (global && global.JSON) {
		global.JSON.original = {
			parse: global.JSON.parse,
			stringify: global.JSON.stringify
		};
		global.JSON.parse = parse;
		global.JSON.stringify = stringify;
	}
};

/**
 * Export for node and browserify.
 */
if (typeof(module)!=="undefined" && module.exports)) {
	module.exports = {
		parse: parse,
		stringify: stringify,
		install: install
	};
}

/**
 * Export for browser
 */
if (typeof(window)!=="undefined" && window.JSON) {
	window.JSON2016.original = {
		parse: parse,
		stringify: stringify,
		install: install
	};
}

/**
 *
 *
 * Doesn't work for you? why not try submitting a pull request with the fix!
 * Open Source is community driven; that means you! Get involved! Have Fun! Live!
 *
 *
 */
