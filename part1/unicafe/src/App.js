import React, { useState } from 'react'

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const Display = (props) => <h1>{props.text}</h1>

const Statistic = ({name, val, percent=''}) => {
  return (
    <tr>
      <td>{name} {val} {percent}</td>
    </tr>
  )
}

const Statistics = ({stateInfo}) => {

  // stateinfo = [good, neutal, bad]

  let check = stateInfo.some(item => item !== 0)  

  if (check) {
    const sum = stateInfo.reduce((a, b) => a + b, 0);
    const avg = (stateInfo[0] - stateInfo[2]) / sum;
    const posP = (stateInfo[0]/sum)*100
    
      return ( 
        <table>
          <tbody>
            <Statistic name={'good'} val={stateInfo[0]}></Statistic>
            <Statistic name={'neutral'} val={stateInfo[1]}></Statistic>
            <Statistic name={'bad'} val={stateInfo[2]}></Statistic>
            <Statistic name={'all'} val={sum}></Statistic>
            <Statistic name={'average'} val={avg.toFixed(1)}></Statistic>
            <Statistic name={'positive'} val={posP.toFixed(1)} percent={'%'}></Statistic>
            </tbody>
          </table>
      )
  } 
  else {
    return (
      <p>No feedback given</p>
    )
  }

}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Display text={'give feedback'}></Display>
      <Button handleClick={() => setGood(good + 1)} text={'good'}></Button>
      <Button handleClick={() => setNeutral(neutral + 1)} text={'neutral'}></Button>
      <Button handleClick={() => setBad(bad + 1)} text={'bad'}></Button>
      <Display text={'statistics'}></Display>
        <Statistics stateInfo={[good,neutral,bad]}></Statistics>
    </div>
  )
}

export default App

