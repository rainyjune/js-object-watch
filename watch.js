module.exports = watch;

// https://gist.github.com/eligrey/384583
if (!Object.prototype.watch) {
  Object.defineProperty(Object.prototype, "watch", {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (prop, handler) {
      var oldval = this[prop],
          newval = oldval,
          getter = function () {
            return newval;
          },
          setter = function (val) {
            oldval = newval;
            return newval = handler.call(this, prop, oldval, val);
          };

      if (delete this[prop]) { // can't watch constants
        Object.defineProperty(this, prop, {
          get: getter,
          set: setter,
          enumerable: true,
          configurable: true
        });
      }
    }
  });
}

function watch(obj, prop, handler) {
  obj.watch(prop, handler);
}