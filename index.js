const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors()) // used to enable cors
const morgan = require('morgan')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) }) // creates custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const PORT = process.env.PORT || 3001

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<p>Phoneboook has info for ${persons.length} people</p>${new Date().toString()}`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const deletedPerson = persons.find(person => person.id === id)
    if (deletedPerson) {
        persons = persons.filter(person => person.id !== id)
        res.status(200).end()
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    
    const id = Math.floor(Math.random() * 13379)
    const newContact = req.body
    if (newContact.name && newContact.number) {
        if(persons.find(person => person.name.toLowerCase() === newContact.name.toLowerCase())) {
            res.status(400).json({error: 'name must be unique'})
        } else {
            newContact.id = id
            persons = [...persons, newContact]
            res.json(newContact)
        }
    } else {
        res.status(400).json({error: 'both name and number are required'})
    }
    
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})