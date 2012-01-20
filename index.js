//Underscore with added mixins

var _ = require('underscore');

var mixins = {};

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

/**
 * Plucks deeply nested values in an array
 *
 * @param {Object}    obj
 * @param {String}    Path
 * @return {Array}    Returns array of plucked values
 * @api public
 */
 
mixins.pluckPath = function(obj, path) {
  var self = this;
  
  return this.map(obj, function(val) {
    return self.path(val, path);
  });
}


//Mixin to underscore and return the extended underscore
_.mixin(mixins);

module.exports = _;
