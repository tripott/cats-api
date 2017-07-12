require('dotenv').config()

const express = require('express')
const app = express()
const dal = require('./dal.js')
const port = process.env.PORT || 4000
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const { pathOr } = require('ramda')

app.use(bodyParser.json())

//  C - create (POST) a single cat
//  R - read (GET)  a single cat
//  U - update (PUT) a single cat
//  D - delete (DELETE) a single cat
//  L - list (GET) all the cats

app.get('/', function(req, res, next) {
  res.send('Welcome to the Cats API, meow.')
})

/////////////////////////
///   CATS, CATS, CATS!
////////////////////////

//   CREATE  - POST /cats
app.post('/cats', function(req, res, next) {
  console.log('POST /cats, req.body: ', req.body)

  dal.add(req.body, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(201).send(data)
  })
})

// READ - GET /cats/:id

app.get('/cats/:id', function(req, res, next) {
  dal.getCat(req.params.id, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    if (data) {
      res.status(200).send(data)
    } else {
      next(new HTTPError(404, 'Not Found', { path: req.path }))
    }
  })
})

//   UPDATE -  PUT /cats/:id

app.put('/cats/:id', function(req, res, next) {
  const catId = req.params.id
  const requestBodyCat = pathOr('no body', ['body'], req)
  if (catId != requestBodyCat._id) {
    return next(new HTTPError(400, 'Bad Request, meow.'))
  }
  dal.updateCat(requestBodyCat, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

// DELETE -  DELETE /cats/:id
app.delete('/cats/:id', function(req, res, next) {
  const catId = req.params.id
  console.log('cat id: ', catId)
  dal.deleteCat(catId, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))

    res.status(200).send(data)
  })
})

//   LIST - GET /cats
app.get('/cats', function(req, res, next) {
  const limit = pathOr(null, ['query', 'limit'], req)

  dal.listCats(limit, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

/////////////////////////
//      BREEDS
/////////////////////////
//   LIST - GET /breeds

app.get('/breeds', function(req, res, next) {
  const limit = pathOr(null, ['query', 'limit'], req)

  dal.listBreeds(limit, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

app.use(function(err, req, res, next) {
  console.log(req.method, ' ', req.path, ' ', 'error: ', err)
  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, () => console.log('API Running on port:', port))
