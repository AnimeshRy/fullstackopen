require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const process = require('process');
const Person = require('./models/Person');
const app = express();

app.use(express.static('build')); //use static react spa

// middlewares
app.use(cors()); //cors
app.use(express.json()); // json-parser

// morgan custom token
morgan.token('postData', (request) => {
  if (request.method == 'POST') return ' ' + JSON.stringify(request.body);
  else return ' ';
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postData'
  )
);

app.get('/api/persons', (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get('/info', (request, response) => {
  Person.estimatedDocumentCount().then((res) => {
    console.log(res);
    response.send(`
    <div><p>PhoneBook has ${res} people currently</p></div>
    <p>${new Date()}</p>
    `);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((record) => {
      if (record) {
        response.json(record);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  // Check if record available
  Person.findByIdAndRemove(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or Number missing',
    });
  }

  const newName = body.name;
  Person.find({ name: newName }).then((num) => {
    if (num.length !== 0) {
      return response.status(409).json({
        error: 'Name must be unique',
      });
    }

    const record = new Person({
      name: body.name,
      number: body.number,
    });

    record
      .save()
      .then((savedNote) => savedNote.toJSON())
      .then((savedAndFormattedNote) => {
        response.json(savedAndFormattedNote);
      })
      .catch((error) => next(error));
  });
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };
  const id = request.params.id;
  Person.findByIdAndUpdate(id, person, { new: true })
    .then((changedRecord) => {
      response.json(changedRecord);
    })
    .catch((error) => next(error));
});

// unknown endpoint middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({
      error: 'malformatted id',
    });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message,
    });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
