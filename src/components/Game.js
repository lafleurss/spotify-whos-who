import React, { useEffect, useState } from "react"
import styled from "styled-components"

const Game = (props) => {
  console.log(props)
  const guessData = props.location.state.guessDataComplete

  console.log(guessData)

  return (
    <div>
      <h1>Guess Data:</h1>
    </div>
  )
}

export default Game
