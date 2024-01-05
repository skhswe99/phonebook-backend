require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors()) // used to enable cors
// app.use(express.static('dist')) // serve static file from backend; for vite
app.use(express.static('build')) // serve static file from backend; for create-react-app
const PORT = process.env.PORT

const Person = require('./models/person')
const morgan = require('morgan')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) }) // creates custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const errorHandler = (err, req, res, next) => {   
    console.error(err.message)
    if (err.name === 'CastError') {
        return res.status(400).send({error: 'malformatted id'})
    }

    next(err)
}


app.get('/info', (req, res) => {
    Person.find({})
        .then(results => {
            res.send(`<p>Phoneboook has info for ${results.length} people</p>${new Date().toString()}`)
        })
})

app.get('/api/persons', (req, res) => {
    Person.find({})
            .then(results => {
                res.json(results)
            })
            .catch(error => {
                console.log(error.message)
            })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
            .then(person => {
                if (person) {
                    res.json(person)
                } else {
                    res.status(404).end()
                }                
            })
            .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
            .then(result => {
                res.status(204).end()
            })
            .catch(error => {
                console.log(error)
            })
})

app.post('/api/persons', (req, res) => { 
    const body = req.body
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
             .then(result => {
                console.log(result)  
             })
             .catch(error => {
                console.log(error)
             })
})



app.use(errorHandler) // use error handler here

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})