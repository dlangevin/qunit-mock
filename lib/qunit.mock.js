(function() {
  var expectCall, finishMock, mock, mocked, mocking, stack, testExpectations;
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
    var _a, _b, _c, _d, expectation;
    _a = []; _c = mocking.expectations;
    for (_b = 0, _d = _c.length; _b < _d; _b++) {
      expectation = _c[_b];
      _a.push((function() {
        equals(expectation.callCount, expectation.expectedCalls, "method " + (expectation.method) + " should be called " + (expectation.expectedCalls) + " times");
        return (expectation.object[expectation.method] = expectation.originalMethod);
      })());
    }
    return _a;
  };
  window.expectCall = expectCall;
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
