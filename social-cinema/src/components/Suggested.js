import "./Suggested.scss"

import React, { useState } from "react";
import axios from "axios";
// import './App.css';

export default function Suggested(props) {
  const [suggestedMovie, setSuggestedMovie] = useState("");
  const [suggested, setSuggested] = useState("hide")

  const newMovie = () => {
    setSuggested("waiting")
    let group;
    if (props.theme) {
      group = [];
    } else {
      group = props.group;
    }
    axios.post(`/suggestion`, { userGenrePreferences: props.userGenres, group, recentSuggestions: props.recentSuggestions, minimumRuntime: props.minimumRuntime, maximumRuntime: props.maximumRuntime })
      .then(response => {
        setSuggested("show")
        setSuggestedMovie({
          "title": response.data.title,
          "description": response.data.description,
          "poster": response.data.poster,
          "releaseDate": response.data.release_date,
          "tmdbId": response.data.tmdb_id,
          "imdb_link": response.data.imdb_link,
          "runtime" : response.data.runtime,
          "error": response.data.error,
          "rating": response.data.rating
        });
        props.getRecentSuggestions(response.data);
      })
      .catch(error => {console.log(error)})
  };

  const saveToLaterList = (userName, suggestedMovie) => {
    axios.post(`/api/${userName}/latermovies`, { suggestedMovie })
    .then(response => {
      props.setLaterMovies(response.data.later_movies)
    })
    .catch(error => {console.log(error)})
  };

  let runtime;

  if (suggestedMovie.runtime) {
    runtime = suggestedMovie.runtime + ' minutes'
  }

  let error = ""
  if(suggestedMovie.error === "group") {
    error = "As a group, you hate all movie genres. To receive a curated movie suggestion, try setting a theme night. Otherwise, we suggest you watch Bob Ross! No one hates Bob Ross."
  } else if(suggestedMovie.error === "solo") {
    error = "You currently hate all movie genres. Update your preferences to receive a curated movie suggestion. Otherwise, we suggest you watch Bob Ross! No one hates Bob Ross."
  }

  return (
    <section className="suggested-container">
      {suggested === "hide" &&
        <section className="click-suggest" onClick={() => {newMovie()}}>
          <img src="images/spinner2.png" height="300px" alt="click to generate a suggestion!"/>
          <h1>{props.user.name}</h1>
          <h1>Click to Generate Your First Movie Suggestion</h1>
        </section>
      }
      {suggested === "waiting" &&
      <>
        <h1>Looking 4 Ur Movie</h1>
        <img className="spinner" src="images/spinner2.png" height="300px" alt="spinning film wheel"/>
      </>
      }
      {suggested === "show" && 
        <>
          <section className="suggestion">
            <header>
              <h5>{error}</h5>
              <h2 className="movie-title">{suggestedMovie.title}</h2>
            </header>
            <main className="suggestion-info">
              <img alt={suggestedMovie.title} src={suggestedMovie.poster} className="movie-poster"></img>
              <article>
                <h4>{suggestedMovie.releaseDate}</h4>
                <p>{suggestedMovie.description}</p>
                <span>{suggestedMovie.rating}</span>
                <span>{runtime}</span>
                <a href={suggestedMovie.imdb_link} target="_blank" rel="noopener noreferrer">Learn more at IMDB</a>
                <footer className="suggestion-buttons">
                {props.user.name && <button type="button" onClick={()=>{saveToLaterList(props.user.name, suggestedMovie)}}>Add This to Later List</button>}
                <button type="button" onClick={()=>newMovie()}>Suggest a Different Movie</button>
                </footer>
              </article>
            </main>
          </section>
        </>
      }
    </section>
  );
}