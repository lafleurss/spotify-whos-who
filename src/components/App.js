import React from "react"
import { Route } from "react-router-dom"

import Home from "./Home"
import Game from "./Game"

const App = () => (
  <div>
    <Route exact path="/" component={Home} />
    <Route path="/Game" component={Game} />
  </div>
)

export default App
