const catsData = [
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

const { append } = require('ramda')

function add(cat, callback) {
  console.log('Someone tried to add a cat.')
}

function listCats(callback) {
  callback(null, catsData)
}

const dal = {
  add,
  listCats
}

module.exports = dal
