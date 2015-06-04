var rdb = require('rethinkdb');
var dbConfig = require('../config/database');

var connection = rdb.connect(dbConfig)
.then(function (connection) {

    module.exports.find = function (tableName, id) {
        return rdb.table(tableName).get(id).run(connection)
        .then(function (result) {
            return result;
        });
    };

    module.exports.findAll = function (tableName) {
        return rdb.table(tableName).run(connection)
        .then(function (cursor) {
            return cursor.toArray();
        });
    };

    module.exports.findBy = function (tableName, fieldName, value) {
      return rdb.table(tableName).filter(rdb.row(fieldName).eq(value)).run(connection)
        .then(function (cursor) {
            return cursor.toArray();
        }); 
    };
    
    module.exports.findArray = function (tableName, items) {
      console.log('findArray.');
      console.log('items',items);
      console.log('query is: table('+tableName+').getAll(r.args('+items+'))');
      //return rdb.table(tableName).getAll(r.args(items)).run(connection)
      
      return rdb.table('events').getAll(r.args([ '46dfb2f0-89e7-461b-82a5-e0dbc2a97cd3',
  '8bd2202a-7854-4c9f-b2ff-12b9513c883e' ])).run(connection)
      
      .then(function (cursor) {
          console.log('result cursor:', cursor);
          return cursor.toArray();
      }); 
    };

    module.exports.findIndexed = function (tableName, query, index) {
        return rdb.table(tableName).getAll(query, { index: index }).run(connection)
        .then(function (cursor) {
            return cursor.toArray();
        });
    };

    module.exports.save = function (tableName, object) {
        return rdb.table(tableName).insert(object).run(connection)
        .then(function (result) {
            return result;
        });
    };

    module.exports.edit = function (tableName, id, object) {
        return rdb.table(tableName).get(id).update(object).run(connection)
        .then(function (result) {
            return result;
        });
    };

    module.exports.destroy = function (tableName, id) {
        return rdb.table(tableName).get(id).delete().run(connection)
        .then(function (result) {
            return result;
        });
    };

});