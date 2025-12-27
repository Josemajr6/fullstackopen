const Header = ({ name }) => {
  return <h2>{name}</h2>
}

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Total = ({ parts }) => {
  // Ejercicio 2.3: usando reduce
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  
  return (
    <p style={{ fontWeight: 'bold' }}>
      total of {total} exercises
    </p>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course