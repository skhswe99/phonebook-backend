const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const password = process.argv[2] // get password from input
const url = `mongodb+srv://fullstack:${password}@cluster0.kctgxlw.mongodb.net/phoneApp?retryWrites=true&w=majority` // use phoneApp as db name
mongoose.connect(url) // connect to the database
        .catch(err => console.log(err))

// defien Schema and Model
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema)

// indicate correct usage
if (process.argv.length < 3) {
    console.log('Usage: node mongo.js <yourpassword> [<name> <number>]')
    process.exit(1)
} 

// retrieve phonebook entries
if (process.argv.length === 3) {
    Person.find({})
        .then(persons => {
            console.log('phoneboook:')
            persons.forEach(person => {console.log(person.name + ' ' + person.number)})
            // console.log(persons)
            mongoose.connection.close() // must close connection
        })
        .catch(err => { console.log(err) })
}

// add entries to phoneboook
if (process.argv.length === 5) {
    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    newPerson.save()
            .then(result => {
                console.log('newPerson = ', result)
                mongoose.connection.close() // must close connection
            })
            .catch(err => { console.log(err) })
}