import React from "react";
import { updateVote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";
import { connect } from "react-redux";

const Anecdote = ({ anecdote, updateVote, setNotification }) => {
  const voteHandler = () => {
    updateVote(anecdote);
    setNotification(`You voted for '${anecdote.content}'`, 5);
  };
  return (
    <li>
      {anecdote.content} has {anecdote.votes} votes
      <button onClick={voteHandler}>vote</button>
    </li>
  );
};

const AnecdoteList = (props) => {
  return (
    <ul>
      {props.anecdotes.map((anecdote) => (
        <Anecdote key={anecdote.id} anecdote={anecdote} updateVote={props.updateVote} setNotification={props.setNotification} />
      ))}
    </ul>
  );
};

const mapDispatchToProps = {
  updateVote,
  setNotification,
};

const mapStateToProps = (state) => {
  if (state.filter === null) {
    return { anecdotes: state.anecdotes };
  }
  const regex = new RegExp(state.filter, "i");
  return state.anecdotes.filter((anecdote) => anecdote.content.match(regex));
};

const ConnectedAnecdoteList = connect(mapStateToProps, mapDispatchToProps)(AnecdoteList);
export default ConnectedAnecdoteList;
