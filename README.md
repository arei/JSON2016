# JSON2016

## Purpose

JSON2016 is a polyfill for modernized update to JSON. It adds support to JSON in javascript for trailing commas, dates, and comments.  Nothing else is changed for the original json specification.


## Installation

```shell
npm install JSON2016
```

## Usage

JSON2016 has four usage aproaches, depending on your environment: Node, Node Modules, Browser, or Browserify.

#### NodeJS Usage

JSON2016 can be required just like any other node module:

```
var json = require("JSON2016");
json.parse(...);
json.stringify(...);
```

JSON2016 can be imported if you're using .mjs modules/ES syntax:

```
import json from "JSON2016";
json.parse(...);
json.stringify(...);
```

JSON2016 can also be "installed" which will essentially replace the global JSON object with the JSON2016 version.

```
require("JSON2016").install();
JSON.parse(...);
JSON.stringify(...);
```

#### Browser Usage

JSON2016 can be directly included into your browser scripts:

```
	<script src="./JSON2016.js"></script>
```

JSON2016 can also be "installed" which will essentially replace the global JSON object with the JSON2016 version.

```
	<script>
		var f = function() {
			if (window && window.JSON2016) {
				window.JSON2016.install();
			}
			else {
				setTimeout(f,100);
			}
		};
		f();
	</script>
```

#### Browserify Usage

JSON2016 can be used with browserify and it has no underlying dependencies.  Just require it in your source and browserify will handle the rest.  Nothing special.

```
var json = require("JSON2016");
json.parse(...);
json.stringify(...);
```

JSON2016 can also be "installed" which will essentially replace the global JSON object with the JSON2016 version.

```
require("JSON2016").install();
JSON.parse(...);
JSON.stringify(...);
```

## JSON Changes

JSON2016 adds three new rules to the JSON standard...

#### Comments

JSON20167 allow for commas to occur inside of JSON.  JSON2016 will remove the comments prior to JSON parsing.

Comments may be of the following forms:

```
    // start of json
 	{
 		// comment at the start of an object literal
 		// and it can be multi-line.

 		"one": 1, 		// comment after a value
 		"two": 2 		// works regardless of comma or tabs/space/newlines

 		// comment at the end of an object literal
    }
    // end of json
```

#### Trailing Commas

JSON2016 will fix any trailing commas, empty commas, or the like.

NOTE: There is one side effect for trailing comma filtering in that if you have multiple commas bunched together in your json string, JSON2016 will convert them to a single comma.

```
 	{
 		"one": 1,
 		"two": 1,,,,,,
 	}
```

#### Dates

JSON20165 will encode and decode dates into a special format so that JSON2016 can recognize them as dates.

NOTE: JSON2016 Dates are incompatible with standard JSON, so don't expect them to parse if you use a standard JSON parser.

Any date run through stringify() will be returned in the form ```d1234567``` where "d" signifies it is a date, and the number following is the date as a valid UTC based epoch long.

JSON parsed using JSON2016 can recognize the ```d1234567``` format and will convert it to an appropriate JavaScript Date object.

## Example JSON2016

```
{
	// comment
	"integer": 1,
	"float": 2.2,
	"boolean:" false,
	"string": "the quick brown fox jumped over the lazy dog.",
	"date": d1234567890123,
	"array": [],
	"object": {},
	// notice the trailing comma
}
```

## Known Side Effects

 - Multiple commas in valid strings will be reduced to a single comma.

 - Anything of the form "~D#~D~\d+~" (ie "~D#~D~12345~") as its own String will be treated as a date.  This is pretty rare.

## Performance

This relies on regular expression parsing of incoming json strings.  It is thus not unreasonable to expect a minor performance hit when using JSON2016.  Maybe some day we can get these change incorporated into the underlying architecture and this polyfill will no longer be necessary.  However, until then, JSON2016 will cost extra.

## Feedback

Feedback on this tool is always welcome and bugs submitted via github will always be answered.

Thanks for using JSON2016.
