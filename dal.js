const PouchDB = require('pouchdb-http')

const db = new PouchDB(
  'https://reedneassinegunterfultyr:3246da1179f98a4766f68f950a8c926f638cc8fd@90629927-b1a9-4251-9b99-f76bd5ad8656-bluemix.cloudant.com/test'
)

console.log('process.env.COUCHDB_NAME: ', process.env.COUCHDB_NAME)

//console.log('db', db)

var catsData = [
  {
    id: 2,
    type: 'cat',
    breed: 'Siamese',
    desc:
      'The Siamese cat is one of the first distinctly recognized breeds of Asian cat. Derived from the rtgs: wichianmat landrace, one of several varieties of cat native to Thailand.'
  },
  {
    id: 3,
    type: 'cat',
    breed: 'Maine Coon',
    desc:
      'The Maine Coon is the largest domesticated breed of cat. It has a distinctive physical appearance and valuable hunting skills.'
  },
  {
    id: 4,
    type: 'cat',
    breed: 'Pixie-bob',
    desc:
      'The Pixie-bob is a breed of domestic cat claimed by breed founder Carol Ann Brewer of Washington State to be the progeny of naturally occurring bobcat hybrids.'
  }
]

const { append, find, reject, compose } = require('ramda')

function addCat(cat, callback) {
  catsData = append(cat, catsData)
  callback(null, cat)
}

// function updateCat(id, cat, callback) {
//   catsData = compose(append(cat), reject(c => c.id === id))(catsData)
//
//   callback(null, cat)
// }

function updateCat(updatedCat, callback) {
  db.put(updatedCat, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function listCats(callback) {
  callback(null, catsData)
}

function getCat(catId, callback) {
  // find and return a single cat object
  //const foundCat = find(cat => cat.id === catId, catsData)
  db.get(catId, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function deleteCat(catId, callback) {
  catsData = reject(cat => cat.id === catId, catsData)
  callback(null, { deleted: true })
}

const dal = {
  addCat,
  listCats,
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
