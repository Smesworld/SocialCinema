import React from "react";

export default function MovieBox(props) {
  return (
    <div className="movie_box">
       <img src={props.img} height="100px" alt={props.title}/>
       <p> {props.title} </p>
       
    </div>
  );
}