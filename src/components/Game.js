import React, { useEffect, useState } from "react"
import styled from "styled-components"

const Game = (props) => {
  console.log(props)
  const guessData = props.location.state.guessDataComplete

  console.log(guessData)

  return (
    <div>
      <h1>Guess Data:</h1>
      <ul>
        {Object.keys(guessData).map((key) => (
          <li key={key}>
            <strong>{key}: </strong>
            {JSON.stringify(guessData[key])}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Game
