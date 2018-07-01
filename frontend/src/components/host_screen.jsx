import React from 'react';
import { withRouter } from 'react-router-dom';
//need to bind with component
import {graphql, compose} from 'react-apollo';

import { UpdateStatusMutation } from '../gql/gql_mutation';

import { FindRoomQuery } from '../gql/gql_query';
import { findRoomOptions } from '../gql_actions/query_actions';

import {
  subscribeToRoomStatus
} from '../gql_actions/subscription_actions';

import {
  showPlayers
} from '../util/util';

class HostScreen extends React.Component {

  componentDidMount() {
    this.clock();
    let {code} = this.props.match.params;
    subscribeToRoomStatus(this.props.findRoomQuery, code)
  }

  componentWillUnmount() {
    clearInterval(this.clock);
  }

  componentDidUpdate() {
    this.updateProgress();
  }
  
  updateStatus = (options) => {
    let code = this.room.code;
    this.props.updateStatus({
      variables: {
        code,
        options
      }
    });
  }

  clock = () => {
    this.clock = setInterval(() => {
      this.updateStatus({ timer: this.room.status.timer - 1 });
    }, 1000);
  }


  updateProgress = () => {
    let { 
      currentRound, 
      timer, 
      answerPhase,
      votePhase,
    } = this.room.status;

    if (timer === 0) {
      if (answerPhase) this.allAnswered();
      if (votePhase) this.allVoted();
    }

    if (currentRound > this.room.numRounds) {
      this.updateStatus({ 
        gameOver: true, 
        gameStarted: false 
      });

      this.props.history.push('/');
    }
  }

  allVoted = () => {
    if (this.room.status.votePhase) {
      this.updateStatus({
        votePhase: false,
        answerPhase: true,
        currentRound: this.room.status.currentRound + 1,
        timer: 60,
      });
    }
  }

  allAnswered = () => {
    if (this.room.status.answerPhase) {
      this.updateStatus({
        answerPhase: false,
        votePhase: true,
        timer: 15,
      }); 
    }
  }
  
  render() {

    this.room = this.props.findRoomQuery.findRoom;
    if (!this.room) {
      return null;
    }
    // debugger;

    let {  
      currentRound, 
      timer,
    } = this.room.status;
    
    return (
      <div>
        <h3>Current Round: {currentRound} / {this.room.numRounds} </h3>
        <h3>Timer: {timer}s</h3>
        <button onClick={this.allAnswered}>
          All Answered
        </button>
        <button onClick={this.allVoted}>
          All Voted
        </button>
        {showPlayers(this.room.players)}
      </div>
    );
  }
}

export default compose (
  graphql(FindRoomQuery, findRoomOptions()),
  graphql(UpdateStatusMutation, {name: 'updateStatus'}),
)(withRouter(HostScreen));
