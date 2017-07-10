const express = require('express')
const app = express()
const dal = require('./dal.js')
const port = process.env.PORT || 4000
const HTTPError = require('node-http-error')
//  C - create (POST) a single cat
//  R - read (GET)  a single cat
//  U - update (PUT) a single cat
//  D - delete (DELETE) a single cat
//  L - list (GET) all the cats

//   CREATE  - POST /cats

//   UPDATE -  PUT /cats/:id
//   DELETE -  DELETE /cats/:id

app.get('/', function(req, res, next) {
  res.send('Welcome to the Cats API, meow.')
})

//   LIST - GET /cats
app.get('/cats', function(req, res, next) {
  dal.listCats(function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

// READ - GET /cats/:id

app.use(function(err, req, res, next) {
  console.log(req.method, ' ', req.path, ' ', 'error: ', err)
  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, () => console.log('API Running on port:', port))
