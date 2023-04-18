import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Howl, Howler } from "howler";

const StyledGame = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const PlayButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
`;

const Song = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 40%;
  border: 2px solid black;
  margin: 20px;
`;

const ArtistContainer = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-around;
  margin: 40px;
`;

const Artist = styled.div`
  height: 180px;
  width: 150px;
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  cursor: pointer;
`;

const Game = (props) => {
  const [gameRound, setGameRound] = useState(0);

  console.log(props);
  const guessData = props.location.state.guessDataComplete;

  console.log(guessData);
  console.log(guessData[gameRound].preview_url);

  // const localSound = new Howl({ src: ["/sample.mp3"] });

  //plays preview of the song in the guessData array at the gameRound index
  const songPreview = new Howl({
    src: [guessData[gameRound].preview_url],
    html5: true,
    autoplay: true,
  });

  // toggles the song preview on or off
  const playOrPauseSong = (howl) => {
    howl.playing() ? howl.pause() : howl.play();
    // add functionality to change button icon from play to pause
  };

  // runs when user clicks on an artist.
  const submitArtistChoice = (choice) => {
    console.log("artist choice: ", choice);
    // TODO: add styling to distinguish which artist was chosen

    //check if the choice is correct
    // TODO: convert to ternary
    if (choice === guessData[gameRound].Artist) {
      // TODO: show 'Correct' on screen
    } else {
      // TODO: show 'Sorry, that's incorrect' on screen
    }
    // TODO: save to list or adjust score if we have multiple rounds

    // TODO: go to next round or show results screen
  };

  return (
    <StyledGame>
      <Song>
        <h4>Song:</h4>
        <h2>{guessData[gameRound].name}</h2>
        <PlayButton onClick={() => playOrPauseSong(songPreview)}>
          Play
        </PlayButton>
      </Song>
      <ArtistContainer>
        {guessData[gameRound].choices.map((choice) => (
          <Artist onClick={() => submitArtistChoice(choice)}>
            <img></img>
            <span>{choice}</span>
          </Artist>
        ))}
      </ArtistContainer>

      <h1 style={{marginTop: '200px'}}>Guess Data:</h1>
      <ul>
        {Object.keys(guessData).map((key) => (
          <li key={key}>
            <strong>{key}: </strong>
            {JSON.stringify(guessData[key])}
          </li>
        ))}
      </ul>
    </StyledGame>
  );
};

export default Game;
