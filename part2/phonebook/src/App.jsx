import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  // Ejercicio 2.12: Obtener datos del backend
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error('Error fetching persons:', error)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  // Ejercicio 2.15: Actualizar número existente
  const updatePerson = (id, updatedPerson) => {
    personService
      .update(id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => 
          person.id !== id ? person : returnedPerson
        ))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.error('Error updating person:', error)
        alert(`Person '${updatedPerson.name}' was already removed from server`)
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  // Ejercicio 2.14: Eliminar persona
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.error('Error deleting person:', error)
          alert(`Person '${name}' was already removed from server`)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    const existingPerson = persons.find(person => 
      person.name.toLowerCase() === newName.toLowerCase()
    )
    
    // Ejercicio 2.15: Si existe, preguntar si actualizar
    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      
      if (confirmUpdate) {
        const updatedPerson = {
          ...existingPerson,
          number: newNumber
        }
        updatePerson(existingPerson.id, updatedPerson)
      }
      return
    }
    
    const newPerson = {
      name: newName,
      number: newNumber
    }
    
    // Ejercicio 2.12: Guardar en backend
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.error('Error creating person:', error)
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
      
      <Persons 
        persons={persons} 
        filter={filter}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App