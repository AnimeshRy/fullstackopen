import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./utils/store";

ReactDOM.render(
  // pass redux store to App component
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
