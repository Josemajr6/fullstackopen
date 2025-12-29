const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// Datos iniciales (Ejercicio 3.1)
let persons = [
  { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

// Helper para generar ID (Ejercicio 3.5)
const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

// Ruta principal
app.get('/', (request, response) => {
  response.send('<h1>Phonebook Backend</h1>')
})

// Ejercicio 3.2: Info page
app.get('/info', (request, response) => {
  const date = new Date()
  const count = persons.length
  
  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `)
})

// Ejercicio 3.1: GET all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Ejercicio 3.3: GET single person
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Ejercicio 3.4: DELETE person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  
  response.status(204).end()
})

// Ejercicio 3.5-3.6: POST new person
app.post('/api/persons', (request, response) => {
  const body = request.body
  
  // Ejercicio 3.6: Validación
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }
  
  // Verificar si el nombre ya existe
  const nameExists = persons.some(person => 
    person.name.toLowerCase() === body.name.toLowerCase()
  )
  
  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  
  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})