var _ = require('./index');


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
  
  'returns undefined if property does not exist': function(test) {
    test.same(undefined, _.path(this.obj, 'herua'));
    test.same(undefined, _.path(this.obj, 'child1.guhrs'));
    
    test.done();
  },
  
  'handles null or undefined': function(test) {
    test.same(undefined, _.path(undefined, 'test'));
    test.same(null, _.path(null, 'test'));
    
    test.done();
  }
};


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
