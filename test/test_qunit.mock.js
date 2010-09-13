/*
 * Copyright (c) 2010 Bitzesty
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Sample = function() {};

Sample.prototype = {
	method: function() {
		this.otherMethod();
		return "hello"
	},
	
	callAsync: function() {
		self = this;
		
		setTimeout(function() {self.otherMethod()}, 300)
	},
	
	otherMethod: function() {}
};

obj = new Sample();

module("QUnit Mock");

test("basic expecting assertions", function() {
	expectCall(obj, 'otherMethod');
	obj.method();
});

test("return method back after test", function() {
	same(obj.otherMethod, Sample.prototype.otherMethod, "method is same as old original one");
});

asyncTest("async mocking", function() {
	expectCall(obj, 'otherMethod');
	obj.callAsync();
	setTimeout(function() {
		start();
	}, 500);
});

test("stubbing", function() {
	stub(obj, 'method', function() {return "world"});
	equal(obj.method(), "world");
});

test("stubbing same method multiple times", function() {
	stub(obj, 'method', function() {return "one"})
	stub(obj, 'method', function() {return "two"})
	
	equal(obj.method(), "two");
});

test("stub returns original method", function() {
	equal(obj.method(), "hello");
});

test("given error when wrong number of call count", function() {
	mock(function() {
		obj = new Sample();
		expectCall(obj, 'otherMethod', 2);
		obj.method();
	});
});
