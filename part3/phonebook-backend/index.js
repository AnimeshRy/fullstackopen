const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json()); // json-parser

let phoneBook = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-64565',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-32434512',
  },
];

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
  response.json(phoneBook);
});

app.get('/info', (request, response) => {
  response.send(`
  <div><p>PhoneBook has ${phoneBook.length} people currently</p></div>
  <p>${new Date()}</p>
  `);
});

app.get('/api/persons/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const record = phoneBook.find((record) => record.id === id);

  if (record) {
    response.json(record);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = parseInt(request.params.id);
  // Check if record available
  if (phoneBook.some((record) => record.id === id)) {
    phoneBook = phoneBook.filter((note) => note.id !== id);
    response.status(204).end();
  } else {
    response.status(410).send({ error: 'Item not available in the server' });
  }
});

const generateId = () => {
  const allIds = phoneBook.map((record) => record.id);
  let id = 1;
  // find unique id
  while (allIds.indexOf(id) !== -1) {
    id = Math.floor(Math.random() * 10000);
  }
  return id;
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or Number missing',
    });
  }

  const newName = body.name;
  if (phoneBook.some((person) => person.name === newName)) {
    return response.status(409).send({ error: 'Name should be unique' });
  }

  const record = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  phoneBook = phoneBook.concat(record);

  response.json(phoneBook);
});

// unknown endpoint middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
