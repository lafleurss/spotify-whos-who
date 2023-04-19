import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import styled from "styled-components"
import { Howl, Howler } from "howler"
import Background from "../Background.jsx"
import Button from "../Button.jsx"

const StyledGame = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #fff;
  opacity: 0.6;
  border: 5px solid black;
  border-radius: 30px;
  width: 70%;
  padding: 30px 0px 50px 0px;
`

const PlayButton = styled.button`
  background: rgb(182, 67, 29);
  box-shadow: inset 0px 0px 0px 3px#E3744F;
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
  border: 3px solid black;
  border-radius: 7px;

  margin: 20px;
`

const ArtistContainer = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-around;
  margin: 40px;
`

const Artist = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 230px;
  width: 200px;
  display: flex;
  flex-direction: column;
  border: 3px solid black;
  border-radius: 7px;
  margin: 5px;
  cursor: pointer;
  & img {
  }
  & span {
    width: 100%;
    text-align: center;
  }
`

const ImgContainer = styled.div`
  width: 95%;
  height: 80%;
  background: url(${({ image }) => image});
  background-size: contain;
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
  const [isCorrect, setIsCorrect] = useState(false)
  const [isIncorrect, setIsIncorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [showFinalScore, setShowFinalScore] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState(null)
  const [nextAction, setNextAction] = useState("Next Song")
  const [showNextAction, setShowNextAction] = useState(false)
  const [clickedIndices, setClickedIndices] = useState([])

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
    //Reset clicked indices
    setClickedIndices([])

    //Stop playing the song if next button is clicked
    if (currentSong) {
      currentSong.stop()
    }
    setCurrentSong(null)
    setIsPlaying(false)
    setShowNextAction(false)
    setIsCorrect(false)
    setIsIncorrect(false)

    //Checking to see when the next button is to be disabled
    if (gameRound === guessData.length - 1) {
      setShowFinalScore(true)
    } else if (gameRound === guessData.length - 2) {
      setNextAction("Results")
      setGameRound(gameRound + 1)
    } else {
      //else increment gameRound to get next Song and Choices
      setGameRound(gameRound + 1)
    }
  }

  const startNewGame = () => {
    history.push("/")
  }

  const submitArtistChoice = (choice, index) => {
    if (!clickedIndices.includes(index)) {
      setClickedIndices([...clickedIndices, index])
      console.log(clickedIndices)
      setShowNextAction(true)
      //check if the choice is correct
      if (choice.name === guessData[gameRound].artist) {
        setIsCorrect(true)
        setIsIncorrect(false)
        setScore(score + 1)
        // handleNextRound()
      } else {
        setIsCorrect(false)
        setIsIncorrect(true)
        // handleNextRound()
      }
    }
  }

  return (
    <Background>
      <StyledGame>
        {!showFinalScore && (
          <>
            <h1>Round {gameRound + 1}</h1>
            <Song>
              <h4>Song:</h4>
              <h2>{guessData[gameRound].name}</h2>
              <PlayButton onClick={() => playOrPauseSong()}>
                {isPlaying ? "Pause" : "Play"}
              </PlayButton>
            </Song>
            <ArtistContainer>
              {guessData[gameRound].choices.map((choice, index) => (
                <Artist
                  key={index}
                  onClick={() => submitArtistChoice(choice, index)}
                  disabled={clickedIndices.includes(index)}
                >
                  <ImgContainer image={choice.imgUrl} />
                  <span>{choice.name}</span>
                </Artist>
              ))}
            </ArtistContainer>
            <div>Current Score: {score}</div>

            {isCorrect === true && <p>Correct!</p>}
            {isIncorrect === true && <p>Incorrect!</p>}
            {isIncorrect === true && (
              <p>Correct Answer: {guessData[gameRound].artist}</p>
            )}
            {showNextAction && (
              <Button onClick={handleNextRound}>{nextAction}</Button>
            )}
          </>
        )}
        {showFinalScore && (
          <FinalScore>
            {" "}
            <h2>
              Final Score: {score} out of {guessData.length}{" "}
            </h2>
            <Button onClick={startNewGame}>New Game</Button>
          </FinalScore>
        )}
      </StyledGame>
    </Background>
  )
}

export default Game
