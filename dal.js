const PouchDB = require('pouchdb-http')
const { map } = require('ramda')
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)
const pkGenerator = require('./lib/build-pk')

console.log('process.env.COUCHDB_NAME: ', process.env.COUCHDB_NAME)

const { append, find, reject, compose, trim } = require('ramda')

//////////////////////
//      CATS
//////////////////////
function addCat(cat, callback) {
  // example _id -- "cat_big_time_owner_333"
  cat._id = pkGenerator('cat_', trim(cat.name) + ' ' + trim(cat.ownerId))

  db.put(cat, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function getCat(catId, callback) {
  db.get(catId, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function updateCat(updatedCat, callback) {
  db.put(updatedCat, function(err, doc) {
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

//////////////////////
//      BREEDS
//////////////////////
function addBreed(breed, callback) {
  // example _id -- "breed_pixie-bob"
  breed._id = pkGenerator('breed_', trim(breed.breed))

  db.put(breed, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function getBreed(breedId, callback) {
  db.get(breedId, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function updateBreed(updatedBreed, callback) {
  db.put(updatedBreed, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function deleteBreed(breedId, callback) {
  db
    .get(breedId)
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
  getCat,
  deleteCat,
  updateCat,
  addBreed,
  getBreed,
  updateBreed,
  deleteBreed,
  listBreeds
}

module.exports = dal

// function deleteCat(id, callback) {
//   catsData = reject(c => c.id === id, catsData)
//
//   callback(null, { deleted: true })
// }
