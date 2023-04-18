import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Howl, Howler } from "howler";

const PlayButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Song = styled.div`
  height: 60px;
  width: 200px;
  border: 2px solid black;
`;

const Artist = styled.div`
  height: 180px;
  width: 150px;
  display: flex;
  flex-direction: column;
  border: 2px solid black;
`;

const ArtistContainer = styled.div`
  display: flex;
  justify-content: space-around;
`

const Game = (props) => {
  const [gameRound, setGameRound] = useState(0);

  console.log(props);
  const guessData = props.location.state.guessDataComplete;

  console.log(guessData);
  console.log(guessData[gameRound].preview_url);

  const songPreview = new Howl({
    src: [guessData[gameRound].preview_url],
    html5: true,
    autoplay: true,
    onplayerror: () => {
      console.log("player error");
    },
    onPlay: () => {
      console.log("playing sound");
    },
    onend: function () {
      console.log("sound finished");
    },
  });

  // const localSound = new Howl({ src: ["/sample.mp3"] });

  const playOrPauseSong = (howl) => {
    howl.playing() ? howl.pause() : howl.play();
  };

  const submitArtistChoice = (choice) => {
    console.log("artist choice: ", choice);
    //check if the choice is correct
    //save to list or adjust score if we have multiple rounds
  };

  return (
    <div>
      <Song>
        <PlayButton onClick={() => playOrPauseSong(songPreview)}>
          Play
        </PlayButton>
        Song title
      </Song>
      <ArtistContainer>
        {guessData[gameRound].choices.map((choice) => (
          <Artist onClick={() => submitArtistChoice(choice)}>
            <img></img>
            <span>{choice}</span>
          </Artist>
        ))}
      </ArtistContainer>

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
  );
};

export default Game;
