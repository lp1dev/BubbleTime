import React, { Component } from 'react';
import './PauseModal.css';
import soundon from '../svg/soundon.png'
import soundoff from '../svg/soundoff.png'

class PauseModal extends Component {
    render() {
        return (<div className="App-pause-modal"
                style={{display: this.props.display ? '' : 'none'}}>
                <div className="App-pause-modal-card">
                <h2 className="card-p">Pause</h2>
                <p className="card-p">This game has been built during the React Riot 48h Hackathon</p>
                <button className="card-button" onClick={() => {this.props.onResume()}}>
                Resume
                </button>
                <button className="card-button" onClick={() => {this.props.onRestart()}}>
                Restart
                </button>
                <button className="card-button" onClick={() => {this.props.onMenu()}}>
                Back to menu
                </button>
                <div className="sound-switch"  onClick={() => {this.props.onSwitch()}}>
                <img className={this.props.sound ? "switch-picto on" : "switch-picto"}
                src={this.props.sound ? soundon : soundoff}/>
                </div>
                </div>
                </div>
        );
  }
}

export default PauseModal;
