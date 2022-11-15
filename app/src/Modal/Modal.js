import React, { Component } from 'react';
import './Modal.css';

class Modal extends Component {
    onClick() {
        this.props.onDone();
    }
    render() {
        return (<div className="App-modal"
                style={{display: this.props.text.length > 0 ? '' : 'none'}}>
                <div className="App-modal-card">
                <p className="card-p" dangerouslySetInnerHTML={{__html:this.props.text}}></p>
                <button className="card-button" onClick={() => this.onClick()}>{this.props.button}</button>
                </div>
                </div>
        );
  }
}

export default Modal;
