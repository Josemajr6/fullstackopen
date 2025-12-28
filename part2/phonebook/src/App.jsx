import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ 
    message: null, 
    type: null 
  })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const updatePerson = (id, updatedPerson) => {
    personService
      .update(id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => 
          person.id !== id ? person : returnedPerson
        ))
        showNotification(`Updated ${updatedPerson.name}'s number`, 'success')
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          showNotification(
            `Information of ${updatedPerson.name} has already been removed from server`,
            'error'
          )
          setPersons(persons.filter(person => person.id !== id))
        }
        setNewName('')
        setNewNumber('')
      })
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          showNotification(`Deleted ${name}`, 'success')
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            showNotification(
              `Information of ${name} has already been removed from server`,
              'error'
            )
            setPersons(persons.filter(person => person.id !== id))
          }
        })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    if (!newName.trim() || !newNumber.trim()) {
      showNotification('Name and number are required', 'error')
      return
    }
    
    const existingPerson = persons.find(person => 
      person.name.toLowerCase() === newName.toLowerCase()
    )
    
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
      } else {
        setNewName('')
        setNewNumber('')
      }
      return
    }
    
    const newPerson = {
      name: newName,
      number: newNumber
    }
    
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        showNotification(`Added ${newName}`, 'success')
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        showNotification(`Error adding ${newName}: ${error.message}`, 'error')
        setNewName('')
        setNewNumber('')
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Notification 
        message={notification.message} 
        type={notification.type} 
      />
      
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