const {difference, keys} = require('ramda')

module.exports = (arrKeys, data) => difference(arrKeys, keys(data))
