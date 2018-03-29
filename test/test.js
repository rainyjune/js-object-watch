var assert = require('assert');
var watch = require('../watch');

describe('#watch()', function() {
  it('Notified when a property changed', function(done) {
    this.timeout(500);
    var o = { p: 1};
    watch(o, 'p', function(id, oldval, newval) {
      assert.equal(id, 'p');
      assert.equal(oldval, 1);
      assert.equal(newval, 2);

      setTimeout(function() {
        assert.equal(o.p, 2);
        done();
      }, 200);

      // The watchpoint can filter or nullify the assignment, by returning a modified new value.
      return newval;
    });
    o.p = 2;

  });
});