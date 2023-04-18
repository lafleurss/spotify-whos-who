import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import styled from "styled-components"
import { Howl, Howler } from "howler"

const StyledGame = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const PlayButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
`

const Song = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 40%;
  border: 2px solid black;
  margin: 20px;
`

const ArtistContainer = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-around;
  margin: 40px;
`

const Artist = styled.div`
  height: 190px;
  width: 150px;
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  cursor: pointer;
`

const FinalScore = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 40%;
  border: 2px solid black;
  margin: 20px;
`

const Game = (props) => {
  const history = useHistory()
  const [gameRound, setGameRound] = useState(0)
  const [disableNextButton, setDisableNextButton] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isIncorrect, setIsIncorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [showFinalScore, setShowFinalScore] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState(null)

  console.log(props)
  const guessData = props.location.state.guessDataComplete

  // toggles the song play or pause and the IsPlaying state
  const toggleSong = (currentSong) => {
    if (currentSong.playing()) {
      currentSong.pause()
      setIsPlaying(false)
    } else {
      currentSong.play()
      setIsPlaying(true)
    }
  }

  const playOrPauseSong = () => {
    //if song exists
    if (currentSong) {
      toggleSong(currentSong)
    } else {
      //if song not exists
      const newSong = new Howl({
        src: [guessData[gameRound].preview_url],
        html5: true,
        autoplay: true,
      })
      setCurrentSong(newSong)
      toggleSong(newSong)
    }
  }

  const handleNextRound = () => {
    //Stop playing the song if next button is clicked
    if (currentSong) {
      currentSong.stop()
    }
    setCurrentSong(null)
    setIsPlaying(false)

    //Checking to see when the next button is to be disabled
    if (gameRound === guessData.length - 1) {
      setDisableNextButton(true)
      setShowFinalScore(true)
    } else {
      //else increment gameRound to get next Song and Choices
      setGameRound(gameRound + 1)
    }
  }

  const startNewGame = () => {
    history.push("/")
  }

  const submitArtistChoice = (choice) => {
    console.log("artist choice: ", choice)
    // TODO: add styling to distinguish which artist was chosen

    //check if the choice is correct
    if (choice.name === guessData[gameRound].artist) {
      // alert("Correct!")
      setIsCorrect(true)
      setIsIncorrect(false)
      setScore(score + 1)
      handleNextRound()
    } else {
      // alert("Incorrect!")
      setIsCorrect(false)
      setIsIncorrect(true)
      handleNextRound()
    }
  }

  return (
    <StyledGame>
      {!showFinalScore && (
        <>
          <Song>
            <h4>Song:</h4>
            <h2>{guessData[gameRound].name}</h2>
            <PlayButton onClick={() => playOrPauseSong()}>
              {isPlaying ? "Pause" : "Play"}
            </PlayButton>
          </Song>
          <ArtistContainer>
            {guessData[gameRound].choices.map((choice, index) => (
              <Artist key={index} onClick={() => submitArtistChoice(choice)}>
                <img src={choice.imgUrl} />
                <span>{choice.name}</span>
              </Artist>
            ))}
          </ArtistContainer>
          <button disabled={disableNextButton} onClick={handleNextRound}>
            Next Song
          </button>
          {isCorrect === true && <p>Correct!</p>}
          {isCorrect === false && <p>Incorrect!</p>}
          <div>Current Score: {score}</div>
        </>
      )}
      {showFinalScore && (
        <FinalScore>
          {" "}
          <h2>
            Final Score: {score} out of {guessData.length}{" "}
          </h2>
          <button onClick={startNewGame}>New Game</button>
        </FinalScore>
      )}
    </StyledGame>
  )
}

export default Game
