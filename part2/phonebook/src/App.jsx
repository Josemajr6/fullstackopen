import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  // Ejercicio 2.11: useEffect para obtener datos iniciales
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  console.log('render', persons.length, 'persons')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    const personExists = persons.some(person => 
      person.name.toLowerCase() === newName.toLowerCase()
    )
    
    if (personExists) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    
    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length > 0 ? persons[persons.length - 1].id + 1 : 1
    }
    
    // Guardar en el servidor
    axios
      .post('http://localhost:3001/persons', newPerson)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter 
        filter={filter} 
        handleFilterChange={handleFilterChange} 
      />
      
      <h3>Add a new</h3>
      
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      
      <h3>Numbers</h3>
      
      <Persons persons={persons} filter={filter} />
    </div>
  )
}

export default App