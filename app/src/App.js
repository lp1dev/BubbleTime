import React, { Component } from 'react';
import Board from './Board/Board.js';
import './App.css';

class App extends Component {
    render() {
        return (
                <div className="App">
                <div className="App-container">
                <div id="hackbit-vote-widget"></div>
                <Board/>
                </div>
                </div>
        );
    }
}

export default App;
