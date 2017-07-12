require('dotenv').config()

const express = require('express')
const app = express()
const dal = require('./dal.js')
const port = process.env.PORT || 4000
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const { pathOr, keys, difference, path } = require('ramda')

const checkRequiredFields = require('./lib/check-required-fields')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Cats API, meow.')
})

/////////////////////////
///   CATS, CATS, CATS!
////////////////////////

//   CREATE  - POST /cats
app.post('/cats', function(req, res, next) {
  const arrFieldsFailedValidation = checkRequiredFields(
    ['type', 'name', 'ownerId'],
    req.body
  )

  if (arrFieldsFailedValidation.length > 0) {
    return next(
      new HTTPError(400, 'Missing Required Fields', {
        fields: arrFieldsFailedValidation
      })
    )
  }

  if (path(['body', 'type'], req) != 'cat') {
    return next(new HTTPError(400, "'type' field value must be equal to 'cat'"))
  }

  dal.addCat(req.body, function(err, data) {
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

  if (requestBodyCat === 'no body') {
    return next(new HTTPError(400, 'Missing cat json in request body.'))
  }

  const arrFieldsFailedValidation = checkRequiredFields(
    ['_id', '_rev', 'type', 'name', 'ownerId'],
    requestBodyCat
  )

  if (arrFieldsFailedValidation.length > 0) {
    return next(
      new HTTPError(400, 'Missing Required Fields', {
        fields: arrFieldsFailedValidation
      })
    )
  }

  if (requestBodyCat.type != 'cat') {
    return next(new HTTPError(400, "'type' field value must be equal to 'cat'"))
  }

  if (catId != requestBodyCat._id) {
    return next(
      new HTTPError(
        400,
        'The cat id in the path must match the cat id in the request body'
      )
    )
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
// CREATE - POST /breeds  (Hint: need a req.body)
app.post('/breeds', function(req, res, next) {
  const arrFieldsFailedValidation = checkRequiredFields(
    ['type', 'breed', 'desc'],
    req.body
  )

  if (arrFieldsFailedValidation.length > 0) {
    return next(
      new HTTPError(
        400,
        `Missing Required Fields. Provide a valid breed json document in the request body.  Example: {'type': 'breed','breed': 'persian','desc': 'The Persian cat is a long-haired breed of cat characterized by its round face and short muzzle. It is also known as the Persian Longhair.'}`,
        {
          fields: arrFieldsFailedValidation
        }
      )
    )
  }

  if (path(['body', 'type'], req) != 'breed') {
    return next(
      new HTTPError(
        400,
        `'type' field value must be equal to 'breed'. Provide a valid breed json document in the request body.  Example: {'type': 'breed','breed': 'persian','desc': 'The Persian cat is a long-haired breed of cat characterized by its round face and short muzzle. It is also known as the Persian Longhair.'}`
      )
    )
  }

  dal.addBreed(req.body, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

// READ - GET /breeds/:id
app.get('/breeds/:id', function(req, res, next) {
  dal.getBreed(req.params.id, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    if (data) {
      res.status(200).send(data)
    } else {
      next(new HTTPError(404, 'Not Found', { path: req.path }))
    }
  })
})
// UPDATE - PUT /breeds/:id   (Hint: need a req.body)

app.put('/breeds/:id', function(req, res, next) {
  const breedId = req.params.id
  const requestBodyBreed = pathOr('no body', ['body'], req)

  if (requestBodyBreed === 'no body') {
    return next(new HTTPError(400, 'Missing breed json in request body.'))
  }

  const arrFieldsFailedValidation = checkRequiredFields(
    ['_id', '_rev', 'type', 'breed', 'desc'],
    requestBodyBreed
  )

  if (arrFieldsFailedValidation.length > 0) {
    return next(
      new HTTPError(400, 'Missing Required Fields', {
        fields: arrFieldsFailedValidation
      })
    )
  }

  if (requestBodyBreed.type != 'breed') {
    return next(
      new HTTPError(400, "'type' field value must be equal to 'breed'")
    )
  }

  if (breedId != requestBodyBreed._id) {
    return next(
      new HTTPError(
        400,
        'The breed id in the path must match the breed id in the request body'
      )
    )
  }

  dal.updateBreed(requestBodyBreed, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

// DELETE - DELETE /breeds/:id
app.delete('/breeds/:id', function(req, res, next) {
  const id = req.params.id
  dal.deleteBreed(id, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))

    res.status(200).send(data)
  })
})

//  LIST - GET /breeds
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
