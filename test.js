var _ = require('./index');


exports['log'] = {
  setUp: function(done) {
    var self = this;
    
    self.calledWith = null;
    
    //Mock log function
    self._log = console.log;
    console.log = function() {
      self.calledWith = Array.prototype.slice.call(arguments);
    };
    
    done();
  },
  
  tearDown: function(done) {
    console.log = this._log;
    
    done();
  },
  
  'aliases console.log': function(test) {
    _.log('Msg', 123, [1,2,3], { a: 1, b: 2 });
    
    test.deepEqual(['Msg', 123, [1,2,3], { a: 1, b: 2 }], this.calledWith);
    
    test.done();
  },
  
  'fails silently if console does not exist (e.g. IE)': function(test) {
    console.log = undefined;
    
    try {
      _.log('test');
    } catch (e) {
      test.ok(false, 'Should not have thrown error');
    }
    
    test.done();
  }
};


exports['extendDeep'] = {
  'changes the first object and returns it - 1 level deep': function(test) {
    var obj1 = {
      a: 'A',
      b: 'B',
      c: 'C'
    };
    
    var obj2 = {
      a: 1,
      c: 3
    };
    
    var expected = {
      a: 1,
      b: 'B',
      c: 3
    };
    
    var result = _.extendDeep(obj1, obj2);
    
    test.same(obj1, result);
    test.deepEqual(result, expected);
    
    test.done();
  },
  
  'changes the first object and returns it - multiple levels': function(test) {
    var obj1 = {
      a: { a: 'A', b: 'B' },
      b: { a: 'A', b: 'B' }
    };
    
    var obj2 = {
      a: { a: 1 },
      b: { b: 2 }
    };
    
    var expected = {
      a: { a: 1, b: 'B' },
      b: { a: 'A', b: 2 }
    };
    
    var result = _.extendDeep(obj1, obj2);
    
    test.same(obj1, result);
    test.deepEqual(result, expected);
    
    test.done();
  },

  'creates embedded objects if they dont exist': function(test) {
    var o1 = {
      foo: 'bar'
    };

    var o2 = {
      parent: {
        child: 'child1'
      }
    };

    var expected = {
      foo: 'bar',
      parent: {
        child: 'child1'
      }
    };

    var result = _.extendDeep(o1, o2);

    test.same(expected, result);
    test.done();
  }
};


exports['extendPaths'] = {
  'changes the first object and returns it - 1 level deep': function(test) {
    var obj1 = {
      a: 'A',
      b: 'B',
      c: 'C'
    };
    
    var obj2 = {
      a: 1,
      c: 3
    };
    
    var expected = {
      a: 1,
      b: 'B',
      c: 3
    };
    
    var result = _.extendPaths(obj1, obj2);
    
    test.same(obj1, result);
    test.deepEqual(result, expected);
    
    test.done();
  },
  
  'changes the first object and returns it - multiple levels': function(test) {
    var obj1 = {
      a: { a: 'A', b: 'B' },
      b: { a: 'A', b: 'B' }
    };
    
    var obj2 = {
      'a.a': 1,
      'b.b': 2
    };
    
    var expected = {
      a: { a: 1, b: 'B' },
      b: { a: 'A', b: 2 }
    };
    
    var result = _.extendPaths(obj1, obj2);
    
    test.same(obj1, result);
    test.deepEqual(result, expected);
    
    test.done();
  }
};


exports['flatten'] = {
  'converts nested object to single level object with paths': function(test) {
    var input = {
      foo: 'bar',
      
      child1: {
        id: 123,
        name: 'Child 1',
        child2: { name: 'Child 2' }
      }
    };
    
    var expected = {
      'foo': 'bar',
      'child1.id': 123,
      'child1.name': 'Child 1',
      'child1.child2.name': 'Child 2'
    };
    
    test.deepEqual(_.flatten(input), expected);
    
    test.done();
  },
  
  'works with non-nested objects too': function(test) {
    var input = {
      id: 123,
      name: 'foo'
    };
    
    test.deepEqual(_.flatten(input), input);
    
    test.done();
  }
};


exports['path'] = {
  setUp: function(done) {
    this.obj = {
      foo: 'bar',
      
      child1: {
        name: 'Child 1',
        child2: { name: 'Child 2' }
      }
    };
    
    done();
  },
  
  'gets value in top object': function(test) {
    test.same('bar', _.path(this.obj, 'foo'));
    test.done();
  },
  
  'gets value in nested objects': function(test) {
    test.same('Child 1', _.path(this.obj, 'child1.name'));
    test.same('Child 2', _.path(this.obj, 'child1.child2.name'));
    
    test.done();
  },
  
  'returns defaultValue if property does not exist': function(test) {
    test.same(undefined, _.path(this.obj, 'herua'));
    test.same(undefined, _.path(this.obj, 'child1.guhrs'));

    test.same('foo', _.path(this.obj, 'heruafaea', 'foo'));
    test.same('foo', _.path(this.obj, 'child1.gadweuhrs', 'foo'));
    
    test.done();
  },
  
  'handles null or undefined passed as object': function(test) {
    test.same(undefined, _.path(undefined, 'test'));
    test.same('foo', _.path(undefined, 'test', 'foo'));

    test.same(undefined, _.path(null, 'test'));
    test.same('foo', _.path(null, 'test', 'foo'));
    
    test.done();
  }
};


exports['setPath'] = {
  'sets an existing path': function(test) {
    var obj = {
      child1: {
        foo: 'bar'
      }
    };
    
    _.setPath(obj, 'child1.foo', 'BAR');
    
    test.same(obj.child1.foo, 'BAR');
    
    test.done();
  },
  
  'sets a new path, creating the nested objects as necessary': function(test) {
    var obj = {
      child1: {
        foo: 'bar'
      }
    };
    
    _.setPath(obj, 'child1.child2.child3.foo', 'bar');
    
    test.same(obj.child1.child2.child3.foo, 'bar');
    
    test.done();
  }
};


exports['pluckPath'] = {
  setUp: function(done) {
    this.collection = [
      { id: 10, name: 'Name 1', child: { name: 'child1' } },
      { id: 11, name: 'Name 2', child: { name: 'child2' } },
      { id: 12, name: 'Name 3', child: { name: 'child3' } }
    ];
    
    done();
  },
  
  'plucks nested properties given a path - top level': function(test) {
    var names = _.pluckPath(this.collection, 'name');
    
    test.same(names, ['Name 1', 'Name 2', 'Name 3']);
    
    test.done();
  },
  
  'plucks nested properties given a path - top level': function(test) {
    var names = _.pluckPath(this.collection, 'child.name');
    
    test.same(names, ['child1', 'child2', 'child3']);
    
    test.done();
  }
}


exports['fetch'] = {
  setUp: function(done) {
    this.collection = [
      { id: 10, name: 'Name 1', child: { name: 'child1' } },
      { id: 11, name: 'Name 2', child: { name: 'child2' } },
      { id: 12, name: 'Name 3', child: { name: 'child3' } }
    ];
    
    done();
  },
  
  'returns the object by value, when searching at the top level': function(test) {
    test.same(this.collection[0], _.fetch(this.collection, 'id', 10));
    test.same(this.collection[2], _.fetch(this.collection, 'id', 12));
    test.same(this.collection[1], _.fetch(this.collection, 'name', 'Name 2'));
    test.same(this.collection[2], _.fetch(this.collection, 'name', 'Name 3'));
    
    test.done();
  },
  
  'returns the object by value, when searching by nested property': function(test) {
    test.same(this.collection[0], _.fetch(this.collection, 'child.name', 'child1'));
    test.same(this.collection[2], _.fetch(this.collection, 'child.name', 'child3'));
    
    test.done();
  },
  
  'returns undefined if not found': function(test) {
    test.same(undefined, _.fetch(this.collection, 'foo', 'bar'));
    test.same(undefined, _.fetch(this.collection, 'name', 'gursbgru'));
    
    test.done();
  }
};


exports['capitalize'] = {
  'capitalizes a string': function(test) {
    test.same(_.capitalize('HELLO'), 'Hello');
    test.same(_.capitalize('hello there'), 'Hello there');
    test.same(_.capitalize("What's your name?"), "What's your name?");
    test.same(_.capitalize('bob.'), 'Bob.');
    
    test.done();
  }
}