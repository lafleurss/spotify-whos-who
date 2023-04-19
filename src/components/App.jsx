import React from "react"
import { Route } from "react-router-dom"

import Home from "./Screens/Home.jsx"
import Game from "./Screens/Game.jsx"

const App = () => (
  <>
    <Route exact path="/" component={Home} />
    <Route path="/Game" component={Game} />
  </>
)

export default App
