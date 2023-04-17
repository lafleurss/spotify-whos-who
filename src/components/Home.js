import React, { useEffect, useState } from "react"
import fetchFromSpotify, { request } from "../services/api"
import styled from "styled-components"
import { Link, useHistory } from "react-router-dom"

import Game from "./Game"

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token"
const TOKEN_KEY = "whos-who-access-token"

const HomeContainer = styled.div`
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const GameConfig = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const GameConfigItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 10px 10px 10px;
`

const Home = () => {
  //Using history to conditionally redirect to Game if all validations pass
  const history = useHistory()
  const [guessDataComplete, setGuessDataComplete] = useState([])

  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState("")
  //Added two states to capture number of Songs and Artists config
  const [numSongs, setNumSongs] = useState(1)
  const [numArtists, setNumArtists] = useState(2)

  const [authLoading, setAuthLoading] = useState(false)
  const [configLoading, setConfigLoading] = useState(false)
  const [token, setToken] = useState("")

  const loadGenres = async (t) => {
    setConfigLoading(true)
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    })
    console.log(response)
    setGenres(response.genres)
    setConfigLoading(false)
  }

  const validateConfig = () => {
    if (!selectedGenre) {
      alert("Choose a genre!")
      return false
    }
    return true
  }
  const fetchGameData = async (t) => {
    if (validateConfig()) {
      //Fetch tracks by genre
      let tracksForGuessing = await fetchTracksByGenre(
        t,
        selectedGenre,
        numSongs
      )

      //fetch artists by genre
      let artistsForGuessing = await fetchRandomArtistsByGenre(
        t,
        selectedGenre,
        numArtists
      )

      //using the tracks and artists build the guessing game data
      buildGuessData(tracksForGuessing, artistsForGuessing)
    }
  }

  const fetchTracksByGenre = async (t, genre, numSongs) => {
    //Fetching 50 to allow some randomization of tracks
    console.log("Entering fetchTracksByGenre")
    const endpoint = `search?q=${selectedGenre}&type=track&limit=50`
    const response = await fetchFromSpotify({
      token: t,
      endpoint: endpoint,
    })
    const tracks = response.tracks.items
    const randomizedTracks = tracks.sort(() => 0.5 - Math.random())

    return randomizedTracks.slice(0, numSongs)
  }

  const fetchRandomArtistsByGenre = async (t, genre, numArtists) => {
    //Fetching 50 to allow some randomization of tracks
    console.log("Entering fetchRandomArtistsByGenre")
    const endpoint = `search?q=${selectedGenre}&type=artist&limit=50`
    const response = await fetchFromSpotify({
      token: t,
      endpoint: endpoint,
    })
    const artists = response.artists.items

    return artists
  }

  const buildGuessData = async (tracksForGuessing, artistsForGuessing) => {
    console.log("Entering buildGuessData")
    let artistChoicesArr = artistsForGuessing.map((artist) => artist.name) // create an array of artist names from artistsForGuessing

    //for each track build a new newGuessData object with track name, preview_url, artist name and an array of choice options
    const guessDataBuild = tracksForGuessing.reduce((acc, guessData) => {
      //Randomize artists for choices
      const shuffledArtistChoicesArr = artistChoicesArr.sort(
        () => 0.5 - Math.random()
      )
      // Pick random artist choice from the shuffledChoices based on numArtist minus 1 (for the correct choice)
      const pickedArtistChoices = shuffledArtistChoicesArr.slice(
        0,
        numArtists - 1
      )
      //Insert correct artist choice
      pickedArtistChoices.push(guessData.artists[0].name)

      const newGuessData = {
        name: guessData.name,
        preview_url: guessData.preview_url,
        artist: guessData.artists[0].name, //picking the first artist in case there are multiple ones
        choices: pickedArtistChoices,
      }

      return [...acc, newGuessData] // Append newGuessData to accumulator array
    }, [])

    console.log("Guess Data from buildGuessData: ")
    console.log(guessDataBuild)
    setGuessDataComplete(guessDataBuild)
  }

  //Pass control to Game component only after guessDataComplete is populated
  useEffect(() => {
    if (guessDataComplete.length > 0) {
      history.push("/Game", { guessDataComplete })
    }
  }, [guessDataComplete, history])

  useEffect(() => {
    setAuthLoading(true)

    const storedTokenString = localStorage.getItem(TOKEN_KEY)
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString)
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage")
        setAuthLoading(false)
        setToken(storedToken.value)
        loadGenres(storedToken.value)
        return
      }
    }
    console.log("Sending request to AWS endpoint")
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      }
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken))
      setAuthLoading(false)
      setToken(newToken.value)
      loadGenres(newToken.value)
    })
  }, [])

  if (authLoading || configLoading) {
    return <div>Loading...</div>
  }

  return (
    <HomeContainer>
      <h1>Who's Who</h1>
      <GameConfig>
        <GameConfigItem>
          Genre:
          <select
            value={selectedGenre}
            onChange={(event) => setSelectedGenre(event.target.value)}
          >
            <option value="">Select Genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </GameConfigItem>
        <GameConfigItem>
          # of Songs in Game
          <input
            type="number"
            min="1"
            max="5"
            inputMode="numeric"
            value={numSongs}
            onChange={(event) => {
              const inputVal = event.target.value
              // Use regular expression to remove any non-numeric characters
              const numericVal = event.target.value.replace(/[^0-9]/g, "")
              setNumSongs(numericVal)
            }}
          />
        </GameConfigItem>
        <GameConfigItem>
          # of Artists in Choice
          <input
            type="number"
            min="1"
            max="5"
            inputMode="numeric"
            value={numArtists}
            onChange={(event) => {
              const inputVal = event.target.value
              // Use regular expression to remove any non-numeric characters
              const numericVal = event.target.value.replace(/[^0-9]/g, "")
              setNumArtists(numericVal)
            }}
          />
        </GameConfigItem>
        <GameConfigItem>
          {/* <Link to="/Game"> */}
          <button
            value="Start"
            onClick={() => {
              console.log("Button clicked")
              console.log("Genre: " + selectedGenre)
              console.log("Num Songs: " + numSongs)
              console.log("Num Artists: " + numArtists)

              fetchGameData(token)
              //Fetch x songs based on genre
              //For each song build array of artists - 1 correct + n-1 random
            }}
          >
            Start
          </button>
          {/* </Link> */}
        </GameConfigItem>
      </GameConfig>
    </HomeContainer>
  )
}

export default Home
