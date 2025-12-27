const Persons = ({ persons, filter }) => {
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      {filteredPersons.map(person => 
        <div key={person.id}>{person.name} {person.number}</div>
      )}
    </div>
  )
}

export default Persons