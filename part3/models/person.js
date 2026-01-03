const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('Connecting to MongoDB...')
mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(error => console.error('❌ Error connecting to MongoDB:', error.message))

// Definir esquema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'Name is required'],
    unique: true  
  },
  number: {
    type: String,
    minLength: 8,
    required: [true, 'Number is required'],
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

// Transformar objeto
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person