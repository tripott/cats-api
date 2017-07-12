const PouchDB = require('pouchdb-http')
const { map } = require('ramda')
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)
const pkGenerator = require('./lib/build-pk')

console.log('process.env.COUCHDB_NAME: ', process.env.COUCHDB_NAME)

const { append, find, reject, compose, trim } = require('ramda')

function addCat(cat, callback) {
  cat._id = pkGenerator('cat_', trim(cat.name) + ' ' + trim(cat.ownerId))

  // "cat_big_time_owner_333"
  db.put(cat, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })

  //console.log('cat PK value: ', catPKGenerator(cat, 'cat_'))
}

function updateCat(updatedCat, callback) {
  db.put(updatedCat, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function listCats(limit, callback) {
  const options = limit
    ? {
        include_docs: true,
        startkey: 'cat_',
        endkey: 'cat_\uffff',
        limit: limit
      }
    : {
        include_docs: true,
        startkey: 'cat_',
        endkey: 'cat_\uffff'
      }

  list(options, callback)
}

function listBreeds(limit, callback) {
  const options = limit
    ? {
        include_docs: true,
        startkey: 'breed_',
        endkey: 'breed_\uffff',
        limit: limit
      }
    : {
        include_docs: true,
        startkey: 'breed_',
        endkey: 'breed_\uffff'
      }

  list(options, callback)
}

function getCat(catId, callback) {
  db.get(catId, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function deleteCat(catId, callback) {
  db
    .get(catId)
    .then(function(doc) {
      return db.remove(doc)
    })
    .then(function(result) {
      callback(null, result)
    })
    .catch(function(err) {
      callback(err)
    })
}

////////////////////////////
//    helper functions
////////////////////////////
function list(options, callback) {
  db.allDocs(options, function(err, data) {
    if (err) callback(err)
    callback(null, map(row => row.doc, data.rows))
  })
}

const dal = {
  addCat,
  listCats,
  listBreeds,
  getCat,
  deleteCat,
  updateCat
}

module.exports = dal

// function deleteCat(id, callback) {
//   catsData = reject(c => c.id === id, catsData)
//
//   callback(null, { deleted: true })
// }
