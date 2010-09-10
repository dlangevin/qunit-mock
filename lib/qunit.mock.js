(function() {
  var expectCall, finishMock, mock, mocked, mocking, stack, stub, testExpectations;
  var __slice = Array.prototype.slice;
  mocking = null;
  stack = [];
  expectCall = function(object, method, calls) {
    var expectation;
    calls = (typeof calls !== "undefined" && calls !== null) ? calls : 1;
    expectation = {
      object: object,
      method: method,
      expectedCalls: calls,
      originalMethod: object[method],
      callCount: 0
    };
    object[method] = function() {
      var args;
      args = __slice.call(arguments, 0);
      expectation.originalMethod.apply(object, args);
      return expectation.callCount += 1;
    };
    return mocking.expectations.push(expectation);
  };
  stub = function(object, method, fn) {
    var stb;
    stb = {
      object: object,
      method: method,
      original: object[method]
    };
    object[method] = fn;
    return mocking.stubs.push(stb);
  };
  mock = function(test) {
    var mk;
    mk = {
      expectations: [],
      stubs: []
    };
    mocking = mk;
    stack.push(mk);
    test();
    return !(QUnit.config.blocking) ? finishMock() : QUnit.config.queue.unshift(finishMock);
  };
  mocked = function(fn) {
    return function() {
      return mock(fn);
    };
  };
  finishMock = function() {
    testExpectations();
    stack.pop();
    return (mocking = stack.length > 0 ? stack[stack.length - 1] : null);
  };
  testExpectations = function() {
    var _a, _b, _c, _d, _e, _f, _g, expectation, stb;
    _b = mocking.expectations;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      expectation = _b[_a];
      equals(expectation.callCount, expectation.expectedCalls, "method " + (expectation.method) + " should be called " + (expectation.expectedCalls) + " times");
      expectation.object[expectation.method] = expectation.originalMethod;
    }
    _d = []; _f = mocking.stubs;
    for (_e = 0, _g = _f.length; _e < _g; _e++) {
      stb = _f[_e];
      _d.push(stb.object[stb.method] = stb.original);
    }
    return _d;
  };
  window.expectCall = expectCall;
  window.stub = stub;
  window.mock = mock;
  window.QUnitMock = {
    mocking: mocking,
    stack: stack
  };
  window.test = function() {
    var _a, _b, arg, args, i;
    args = __slice.call(arguments, 0);
    console.log(args);
    _a = args;
    for (i = 0, _b = _a.length; i < _b; i++) {
      arg = _a[i];
      if ($.isFunction(arg)) {
        args[i] = mocked(arg);
      }
    }
    return QUnit.test.apply(this, args);
  };
  window.asyncTest = function(testName, expected, callback) {
    if (arguments.length === 2) {
      callback = expected;
      expected = 0;
    }
    return QUnit.test(testName, expected, mocked(callback), true);
  };
})();
