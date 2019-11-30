import React from "react";
import UserDisplay from "./UserDisplay"
import './lists/styles.scss'

export default function FriendList(props) {
  let friends = props.friends.map((friend) => {
    return <UserDisplay key={friend.id} friend={friend} useMovieNight={props.useMovieNight} group={props.group} action={props.action}/>
  });
  
  return (
    <article>
      {friends.length>0? <h4>{props.type}</h4>: ""}
      <div className={props.classname}>
        {friends}
      </div>
    </article>
  )
}