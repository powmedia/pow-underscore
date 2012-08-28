//Underscore with added mixins

var _ = require('underscore');

var mixins = {};


/**
 * Alias to console.log
 */
var log = mixins.log = function log() {
  if (!console || !console.log) return;
  
  console.log.apply(null, arguments);
};


/**
 * Merge 2 objects. Properties of the second object will overwrite the first. Similar to _.extend but deep.
 *
 * @param {Object}  First object which will contain the merged properties
 * @param {Object}  Second object
 * @return {Object} The object (now merged with object2)
 */
var extendDeep = mixins.extendDeep = function extendDeep(obj1, obj2) {
  for (var p in obj2) {
    if (!obj2.hasOwnProperty(p)) continue;

    if (obj2[p] && obj2[p].constructor == Object) {
      obj1[p] = obj1[p] || {};

      //Recursion
      extendDeep(obj1[p], obj2[p]);
    } else {
      obj1[p] = obj2[p];
    }
  }

  return obj1;
};



/**
 * Merges 2 objects, but uses paths (e.g. 'child1.child.property') to overwrite nested properties
 *
 * @param {Object}  Object to update
 * @param {Object}  New values to override, using paths e.g. 'formContents.firstName'
 * @return {Object}
 */
var extendPaths = mixins.extendPaths = function extendPaths(obj, attrs) {
  if (!attrs) return obj;
  
  _.each(attrs, function(val, key) {
    setPath(obj, key, val);
  });
  
  return obj;
}



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
var flatten = mixins.flatten = function flatten(obj) {
  var ret = {};

  for (var key in obj) {
    var val = obj[key];

    if (val.constructor.name == 'Object') {
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
 * @param {Mixed}       Value to return if the path is not found (Default: undefined)
 * @return {Mixed}      Returns undefined if the property is not found
 */
var path = mixins.path = function path(obj, path, defaultValue) {
  if (!obj) return defaultValue;
  
  var fields = path.split(".");
  var result = obj;
  for (var i = 0, n = fields.length; i < n; i++) {
    result = result[fields[i]];

    if (typeof result === 'undefined') {
      return defaultValue;
    }
  }
  return result;
};


/**
 * Sets a deeply nested object property given a path.
 * 
 * @param {Object}  Object to set property on
 * @param {String}  Object path e.g. 'user.name'
 * @param {Mixed}   Value to set
 */
var setPath = mixins.setPath = function setPath(obj, path, val) {
  var fields = path.split(".");
  var result = obj;
  for (var i = 0, n = fields.length; i < n; i++) {
    var field = fields[i];

    //If the last in the path, set the value
    if (i === n - 1) {
      result[field] = val;
    } else {
    //Create the child object if it doesn't exist
    if (typeof result[field] === 'undefined') {
        result[field] = {};
    }

      //Move onto the next part of the path
      result = result[field];
    }
  }
}



/**
 * _.pluck() with paths.
 * 
 * Gets the nested attribute from a collection
 *
 * @param {Array|Object}    Collection to pluck from
 * @param {String}          Path e.g. 'user.name'
 */
var pluckPath = mixins.pluckPath = function pluckPath(collection, path) {
  var pathFn = mixins.path;
  
  return _.map(collection, function(val) {
    return pathFn(val, path);
  });
};



/**
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
var fetch = mixins.fetch = function fetch(collection, path, val) {
  var self = this;
  
  return this.find(collection, function(item) {
    return self.path(item, path) == val;
  });
};



/**
 * Capitalise the first letter in a string
 * 
 * @param {String} string
 * @return {String}
 */
var capitalize = mixins.capitalize = function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
};


/**
 * Compares two objects and returns a new object with the changed properties.
 *
 * @param {Object} o1
 * @param {Object} o2
 * 
 * @return {Object}
 */
var getChanges = mixins.getChanges = function getChanges(o1, o2) {
  var val,
      changed = {},
      o1 = flatten(o1),
      o2 = flatten(o2);

  for (var attr in o2) {
    if (_.isEqual(o1[attr], (val = o2[attr]))) continue;

    changed[attr] = val;
  }

  return changed;
}


//Mixin to underscore and return the extended underscore
_.mixin(mixins);

module.exports = _;
