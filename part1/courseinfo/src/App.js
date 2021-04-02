import React from 'react'

const Header = (props) => (
    <h1>{props.course}</h1>
  )

const Part = (props) => {
  return (
    <p>{props.content.name} {props.content.exercises}</p>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part content={props.parts[0]}></Part>
      <Part content={props.parts[1]}></Part>
      <Part content={props.parts[2]}></Part>
    </div>
  )
}

const Total = (props) => {
  let tot = props.parts.reduce((acc, obj) => acc + obj.exercises, 0)
  return (
  <p>Number of excercises {tot}</p>
  )
}

const App = () => {
  const course = {
    name:'Half Stack application development',
    parts:[
      {
        name:'Fundamentals of React',
        exercises: 10
      },
      {
        name:'Using props to pass data',
        exercises: 7
      },
      {
        name:'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name}></Header>
      <Content parts={course.parts}></Content>
      <Total parts={course.parts}></Total>
    </div>
  )
}

export default App