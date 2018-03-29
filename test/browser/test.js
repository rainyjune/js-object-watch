var watch = watcher.watch;
var unwatch = watcher.unwatch;

describe('#watch()', function() {
  it('Notified when a property changed once', function(done) {
    this.timeout(500);
    var o = { p: 1};
    watch(o, 'p', function(id, oldval, newval) {
      expect(id).to.be('p');
      expect(oldval).to.be(1);
      expect(newval).to.be(2);

      setTimeout(function() {
        expect(o.p).to.be(2);
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
      expect(times).to.be(2);
      expect(o.p).to.be(3);
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
      expect(id).to.be('p');
      expect(oldval).to.be(undefined);
      expect(newval).to.be(4);

      setTimeout(function() {
        expect(o.p).to.be(4);
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
  it('Unwatch a property after it changed', function() {
    var o = { p: 1};
    var counter = 0;
    watch(o, 'p', function(id, oldval, newval) {
      counter++;
      return newval;
    });
    o.p = 2;
    o.p = 3;
    expect(o.p).to.be(3);
    unwatch(o, 'p');
    expect(o.p).to.be(3);
    o.p = 5;
    expect(counter).to.be(2);
  });
});