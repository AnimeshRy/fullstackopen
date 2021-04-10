import React from 'react'

const Header = props => <h2>{props.course}</h2>

const Part = props => <p>{props.name} {props.exercises}</p>

const Content = props => <div>
    {props.parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />)}
</div>

const Total = (props) => {
  let total = props.parts.reduce((acc, obj) => acc + obj.exercises, 0)
  return (
  <b>total of {total} excercises </b>
  )
}

const Course = ({course}) => <div>
    <Header course={course.name}></Header>
    <Content parts={course.parts}></Content>
    <Total parts={course.parts}></Total>
</div>

export default Course