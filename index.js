const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

let persons = [
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
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.use(cors());
app.use(express.json());

morgan.token('body', (request, response) => {
  return JSON.stringify(request.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  response.send(`<div>
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date().toUTCString()}</p>
  </div>`);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;

  if (!name) {
    return response.status(400).json({ error: 'name must not be empty' });
  }

  if (!number) {
    return response.status(400).json({ error: 'number must not be empty' });
  }

  const existingPerson = persons.find((person) => person.name === name);

  if (existingPerson) {
    return response.status(400).json({ error: 'name must be unique' });
  } else {
    const person = {
      name,
      number,
      id: generateId(),
    };

    persons = persons.concat(person);
    return response.json(person);
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
