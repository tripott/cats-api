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
  add(cat, callback)
}

function getCat(catId, callback) {
  get(catId, callback)
}

function updateCat(updatedCat, callback) {
  update(updatedCat, callback)
}

function deleteCat(catId, callback) {
  deleteDoc(catId, callback)
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
  add(breed, callback)
}

function getBreed(breedId, callback) {
  get(breedId, callback)
}

function updateBreed(updatedBreed, callback) {
  update(updatedBreed, callback)
}

function deleteBreed(breedId, callback) {
  deleteDoc(breedId, callback)
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

function add(doc, callback) {
  db.put(doc, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function get(id, callback) {
  db.get(id, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function update(doc, callback) {
  db.put(doc, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function deleteDoc(id, callback) {
  db
    .get(id)
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
