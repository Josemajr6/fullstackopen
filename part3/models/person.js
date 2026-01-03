const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('Connecting to MongoDB...')
mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(error => console.error('❌ Error connecting to MongoDB:', error.message))

const phoneNumberValidator = (v) => {
  const phoneRegex = /^\d{2,3}-\d{6,}$/
  return phoneRegex.test(v)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters long'],
    required: [true, 'Name is required'],
    unique: true
  },
  number: {
    type: String,
    minLength: [8, 'Phone number must be at least 8 characters long'],
    required: [true, 'Phone number is required'],
    validate: {
      validator: phoneNumberValidator,
      message: props => `${props.value} is not a valid phone number! Format: XX-XXXXXX or XXX-XXXXXXX`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person