import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import reducer from "./reducer";

const store = createStore(reducer);

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const Display = (props) => <h1>{props.text}</h1>;

const Statistic = ({ name, val, percent = "" }) => {
  return (
    <p>
      {name} {val} {percent}
    </p>
  );
};

const Statistics = ({ stateInfo }) => {
  let check = stateInfo.some((item) => item !== 0);

  if (check) {
    const sum = stateInfo.reduce((a, b) => a + b, 0);
    const avg = (stateInfo[0] - stateInfo[2]) / sum;
    const posP = (stateInfo[0] / sum) * 100;

    return (
      <table>
        <tbody>
          <Statistic name={"good"} val={stateInfo[0]}></Statistic>
          <Statistic name={"neutral"} val={stateInfo[1]}></Statistic>
          <Statistic name={"bad"} val={stateInfo[2]}></Statistic>
          <Statistic name={"all"} val={sum}></Statistic>
          <Statistic name={"average"} val={avg.toFixed(1)}></Statistic>
          <Statistic name={"positive"} val={posP.toFixed(1)} percent={"%"}></Statistic>
        </tbody>
      </table>
    );
  } else {
    return <p>No feedback given</p>;
  }
};

const App = () => {
  const action = (type) => {
    return () => {
      store.dispatch({
        type,
      });
    };
  };
  return (
    <div>
      <Display text={"give feedback"}></Display>
      <Button handleClick={action("GOOD")} text={"good"}></Button>
      <Button handleClick={action("OK")} text={"neutral"}></Button>
      <Button handleClick={action("BAD")} text={"bad"}></Button>
      <Button handleClick={action("ZERO")} text={"reset stats"}></Button>
      <Display text={"statistics"}></Display>
      <Statistics stateInfo={Object.values(store.getState())}></Statistics>
    </div>
  );
};

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

renderApp();
store.subscribe(renderApp);
