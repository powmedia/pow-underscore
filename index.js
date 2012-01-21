//Underscore with added mixins

var _ = require('underscore');

var mixins = {};


/**
 * Alias to console.log
 */
mixins.log = function() {
  if (!console || !console.log) return;
  
  console.log.apply(null, arguments);
};



/**
 * Takes a nested object and returns a flattened, shallow object keyed with the path names
 * e.g. { "level1.level2": "value" }
 * 
 * Useful with Mongoose to create a safer way of updating nested documents.
 * I.e. Create a whitelist of attributes a client is able to change and
 * then check that the paths they are trying to set is valid
 * 
 * @param {Object}      Nested object e.g. { level1: { level2: 'value' } }
 * @return {Object}      Shallow object with path names e.g. { 'level1.level2': 'value' }
 */
mixins.flatten = function flatten(obj) {
  var ret = {};

  for (var key in obj) {
    var val = obj[key];

    if (val.constructor === Object) {
      //Recursion for embedded objects
      var obj2 = flatten(val);

      for (var key2 in obj2) {
        var val2 = obj2[key2];

        ret[key+'.'+key2] = val2;
      }
    } else {
      ret[key] = val;
    }
  }

  return ret;
};



/**
 * Get a deeply nested object property without throwing an error
 *
 * Usage:
 *      _.path(obj, 'foo.bar');
 *      _(obj).path('foo.bar');
 *
 * @param {Object}
 * @param {String}      Path e.g.  'foo.bar.baz'
 * @return {Mixed}      Returns undefined if the property is not found
 */
mixins.path = function path(obj, path) {
  if (!obj) return obj;
  
  var fields = path.split(".");
  var result = obj;
  for (var i = 0, n = fields.length; i < n; i++) {
    result = result[fields[i]];

    if (typeof result === 'undefined') {
      return result;
    }
  }
  return result;
};



/**
 * A shortcut for _.find()
 * 
 * Find the first item in a collection that matches the given value.
 * Similar to 'find by ID' or 'find by slug' functionality.
 * 
 * Usage: 
 *    _.fetch(obj, 'id', 123)
 *    _.fetch(obj, 'slug', 'post-title')
 *    _.fetch(obj, 'slug', 'child.id')
 *
 * @param {Object} collection
 * @param {String} path
 * @param {Mixed} val
 * @return {Mixed}
 */
mixins.fetch = function fetch(collection, path, val) {
  var self = this;
  
  return this.find(collection, function(item) {
    return self.path(item, path) == val;
  });
};



//Mixin to underscore and return the extended underscore
_.mixin(mixins);

module.exports = _;
