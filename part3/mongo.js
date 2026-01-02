const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
// URL con el nombre de la base de datos phonebook
const url = `mongodb+srv://fullstack:${password}@cluster0.svu7kr3.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

console.log('Connecting to:', url.replace(password, '***'))

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
    
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    })
    
    const Person = mongoose.model('Person', personSchema)
    
    // Si solo se da password, mostrar todos
    if (process.argv.length === 3) {
      Person.find({}).then(persons => {
        console.log('phonebook:')
        if (persons.length === 0) {
          console.log('Phonebook is empty')
        } else {
          persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
          })
        }
        mongoose.connection.close()
      }).catch(err => {
        console.error('Error fetching persons:', err)
        mongoose.connection.close()
      })
    } 
    else if (process.argv.length === 5) {
      const name = process.argv[3]
      const number = process.argv[4]
      
      const person = new Person({ name, number })
      
      person.save().then(() => {
        console.log(`Added ${name} (${number}) to phonebook`)
        mongoose.connection.close()
      }).catch(err => {
        console.error('Error saving person:', err)
        mongoose.connection.close()
      })
    } 
    else {
      console.log('Invalid number of arguments')
      console.log('Usage:')
      console.log('  To list all:    node mongo.js <password>')
      console.log('  To add new:     node mongo.js <password> <name> <number>')
      mongoose.connection.close()
    }
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  })