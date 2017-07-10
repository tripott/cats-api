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

function updateCat(id, cat, callback) {
  catsData = compose(append(cat), reject(c => c.id === id))(catsData)

  callback(null, cat)
}

function deleteCat(id, callback) {
  catsData = reject(c => c.id === id, catsData)

  callback(null, { deleted: true })
}

function listCats(callback) {
  callback(null, catsData)
}

function getCat(catId, callback) {
  // find and return a single cat object
  const foundCat = find(cat => cat.id === catId, catsData)
  callback(null, foundCat)
}

const dal = {
  addCat,
  listCats,
  getCat,
  updateCat,
  deleteCat
}

module.exports = dal
