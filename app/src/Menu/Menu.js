import React, { Component } from 'react';
import logo from '../svg/Logo.png';
import soundon from '../svg/soundon.png'
import soundoff from '../svg/soundoff.png'
import './Menu.css';

class Menu extends Component {
    render() {
        return (
                <div className="App-menu" style={{display: this.props.display ? '' : 'none'}}>
                <img className={this.props.sound ? "soundSwitch on" : "soundSwitch"}
            src={this.props.sound ? soundon : soundoff}
            onClick={() => this.props.onSoundSwitch()}/>
                <img className="rotating" src={logo}/>
                <div className="menu-box">
                <h3>Hello peeps, and welcome to Bubble Time!</h3>
                <p>You're about to discover a world full of funky bubbles to pop.</p>
                <p>This game was designed with care during the React Riot 48h hackathon of June 2017. Credit goes to the inventors as much as to peanut butter, 60's to 90's rock music and obviously bubblewrap.<br/>We couldn't have done it without you.</p>
                </div>
                <div className="menu-box levels">
                {this.props.levels.map((level, index) => {
                    return (<div key={index}
                            className={"box-level" + ((this.props.level < index) ? ' locked' : '')}
                            onClick={() => {this.props.onLevelSelect(index)}}>{index + 1}
                            </div>);
                })}
                </div>
                <div className="menu-footer">
                <div
            onClick={() => {this.props.onModalClick({
                text: "<h3>Pop all of the bubblewrap!</h3><p>Be resilient, some bubbles will be tougher than others.</p><p>Beware of the wicked pink bubbles. Don't touch them or else you'll die. They will only disappear if you get them nicely aligned.",
                button: 'Got it!',
                onDone: this.props.closeModal
            })}}
            className="footer-entry">- Rules -</div>
                <div className="footer-entry"
            onClick={() => {this.props.onModalClick({
                text: '<h3>Credits</h3><p>DEVELOPMENT, PROGRAMMING, DRINKING COFFEE<br/>- Jeremie Amsellem -</p><p>LOGO & GRAPHICAL CHARTER, UX, UI, DANCING ALONG<br/>- Chloé Spaleniec -<p style="font-size:10px"><a href="https://twitter.com/BubbleTimeGame">Follow @BubbleTimeGame</a></p><p style="font-size:1.4vh">Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> are licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a> and SVG Icons - svgicons.sparkk.fr</p>',
                button: 'Back',
                onDone: this.props.closeModal
            })}}
            >- Credits -</div>
                </div>
                </div>
        );
  }
}

export default Menu;
