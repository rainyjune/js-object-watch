(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.watcher = factory();
  }
}(this, function () {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch
  // https://gist.github.com/eligrey/384583
  // Known limitations:
  // - `delete object[property]` will remove the watchpoint
  // Note: Calling watch() on an object for a specific property overrides any previous handler attached for that property.

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

        if (delete this[prop]) {
          // can't watch constants
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

  if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, 'unwatch', {
      enumerable: false,
      configurable: true,
      writable: false,
      value: function (prop) {
        var val = this[prop];
        delete this[prop]; // remove accessors
        this[prop] = val;
      }
    });
  }

  function watch(obj, prop, handler) {
    obj.watch(prop, handler);
  }

  function unwatch(obj, prop) {
    obj.unwatch(prop);
  }

  return {
    watch: watch,
    unwatch: unwatch
  };

}));