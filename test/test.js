var assert = require('assert');
var watch = require('../watch').watch;
var unwatch = require('../watch').unwatch;

describe('#watch()', function() {
  it('Notified when a property changed once', function(done) {
    this.timeout(500);
    var o = { p: 1};
    watch(o, 'p', function(id, oldval, newval) {
      assert.strictEqual(id, 'p', 'The property p was changed');
      assert.strictEqual(oldval, 1, 'The old value was 1');
      assert.strictEqual(newval, 2, 'The new value is 2');

      setTimeout(function() {
        assert.strictEqual(o.p, 2, 'Make sure o.p equals 2');
        done();
      }, 200);

      // The watchpoint can filter or nullify the assignment, by returning a modified new value.
      return newval;
    });
    o.p = 2;

  });

  it('Notified when a property changed mutiple times', function(done) {
    this.timeout(500);
    var o = { p: 1};
    var times = 0;
    watch(o, 'p', function(id, oldval, newval) {
      times += 1;
      // The watchpoint can filter or nullify the assignment, by returning a modified new value.
      return newval;
    });
    o.p = 2;
    o.p = 3;
    setTimeout(function() {
      assert.strictEqual(times, 2, 'The handler should be called twice.');
      assert.strictEqual(o.p, 3, 'o.p === 3');
      done();
    }, 200);
  });

  // Known limitations:
  // - `delete object[property]` will remove the watchpoint
  /*
  it.only('Notified when a property deleted', function(done) {
    this.timeout(500);
    var o = { p: 1};
    watch(o, 'p', function(id, oldval, newval) {
      assert.strictEqual(id, 'p');
      assert.strictEqual(oldval, undefined);
      assert.strictEqual(newval, 4);

      setTimeout(function() {
        assert.strictEqual(o.p, 4);
        done();
      }, 200);

      // The watchpoint can filter or nullify the assignment, by returning a modified new value.
      return newval;
    });
    delete o.p;
    o.p = 4;
  });
  */

});

describe('#unwatch', function() {
  it.only('Unwatch a property after it changed', function() {
    var o = { p: 1};
    var counter = 0;
    watch(o, 'p', function(id, oldval, newval) {
      counter++;
      return newval;
    });
    o.p = 2;
    o.p = 3;
    assert.strictEqual(o.p, 3, 'o.p === 3');
    unwatch(o, 'p');
    assert.strictEqual(o.p, 3, 'o.p still equals 3 after unwatch was called');
    o.p = 5;
    assert.strictEqual(counter, 2, 'The watch handler wasn\'t called after the unwatch invoked.');
  });
});