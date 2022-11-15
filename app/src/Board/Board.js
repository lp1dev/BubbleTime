import React, { Component } from 'react'
import Modal from '../Modal/Modal'
import PauseModal from '../PauseModal/PauseModal.js'
import pauseButton from '../svg/pause.svg'
import closeButton from '../svg/close.png'
import Menu from '../Menu/Menu'
import sound1 from "../sounds/sound1.ogg"
import sound2 from "../sounds/sound2.ogg"
import sound3 from "../sounds/sound3.ogg"
import "./Board.css"

class Board extends Component {
    componentDidMount() {
        this.sound1 = new Audio(sound1);
        this.sound1.mediaGroup = 'bubbleTime';
        this.sound2 = new Audio(sound2);
        this.sound2.mediaGroup = 'bubbleTime';
        this.sound3 = new Audio(sound3);
        this.sound3.mediaGroup = 'bubbleTime';
    }
    constructor() {
        super();
        this.levels = [{
            timer: 15,
            newLines: 5000,
            redDensity: 10,
            speed: 500
        },{
            timer: 15,
            newLines: 4000,
            redDensity: 8,
            speed: 500
        },{
            timer: 20,
            newLines: 4000,
            redDensity: 5,
            speed: 500
        },{
            timer: 20,
            newLines: 800,
            redDensity: 4,
            speed: 300
        },{
            timer: 22,
            newLines: 800,
            redDensity: 3,
            speed: 300
        },{
            timer: 22,
            newLines: 700,
            redDensity: 3,
            speed: 250
        },{
            timer: 25,
            newLines: 700,
            redDensity: 2,
            speed: 200
        },{
            timer: 30,
            newLines: 1200,
            redDensity: 2,
            speed: 100
        }]

        this.storageKey = 'reactRiotGame42'
        this.state = {
            sound: true,
            menu: true,
            lines: this.initBoard(8),
            timeout: this.levels[this.loadLevel()].speed,
            period: 0,
            status: 0,
            level: this.loadLevel(),
            modal: {
                text: this.loadLevel() === 0 ? "<h3>Pop all of the bubblewrap!</h3><p>Be resilient, some\
 bubbles will be tougher than others</p><p>Beware of the wicked pink bubbles. D\
on't touch then or else you'll die. They will only disappear if you get them ni\
cely aligned" : '',
                button: 'Got it!',
                onDone: () => {this.resetModal()}
            }
        }
    }
    loadLevel() {
        if (undefined === localStorage[this.storageKey])
            return 0;
        let save = JSON.parse(localStorage[this.storageKey]);
        return save.level;
    }
    newGame() {
        this.setState({lines: this.initBoard(8)}, () => {
            this.setState(
                {
                    period: 0,
                    status: 0,
                    newLines: 2200,
//                    level: this.loadLevel(),
                    modal: {text: '<h2>SAD!</h2><br/><br/>You loose this time, but hey, suckin\' at something is the first step towards being sorta good at something!',
                            button: 'Try again',
                            onDone: () => {this.resetModal();this.setState({lines: this.initBoard(8)}, this.start)}
                           }
                }
            );
        });
        clearInterval(this.interval);
    }
    createBox(type) {
        let box = {type: type, className: 'App-' + type, style: {}};
        if (type === 'box') {
            console.log(this.levels[this.state.level].redDensity);
            box['boxType'] = (Math.floor((Math.random() * 10) + 1)) % this.levels[this.state.level].redDensity ? 1 : 4;
            box['className'] += box['boxType'] + ' App-box';
        }
        return box;
    }
    initBoard(lines) {
        let board = []
        for (let i = 0; i < lines; i++) {
            board.push(this.generateLine('empty'));
        }
        return board
    }
    generateLine(type) {
        var line = []
        for (let j = 0; j < 5; j++) {
            line.push(this.createBox(type));
        }
        return line
    }
    removeRedOnlyLines(self, lines){
        let concurrent;
        
        for (let i = 0; i < lines.length; i++) {
            concurrent = 0;
            for (let j = 0; j < lines[i].length; j++) {
                if (lines[i][j].type === 'box' && lines[i][j].boxType === 4) {
                    concurrent++;
                }
            }
            if (concurrent === lines[i].length) {
                lines[i] = self.generateLine('empty');
            }
        }
        return lines
    }
    isTotallyEmpty(line) {
        for (let i = 0; i < line.length; i++) {
            if (line[i].type !== 'empty') {
                return false;
            }
        }
        return true;
    }    
    updateBoard(self) {        
        var lines = self.state.lines;

        for (let i = lines.length - 1; i >= 0; i--){
            if (!self.isTotallyEmpty(lines[i])) {
                if (i + 1 < lines.length) {
                    for (let j = 0; j < lines[i + 1].length; j++){
                        if (lines[i + 1][j].type === 'empty' &&
                            lines[i][j] !== 'empty') {
                            lines[i + 1][j] = lines[i][j];
                            lines[i][j] = self.createBox('empty');
                        }
                    }
                }
            }
        }
        if (self.state.period % self.levels[self.state.level].newLines === 0) {
            lines[0] = self.generateLine('box')
        }
        self.setState({lines: lines, period: self.state.period += self.state.timeout});
        lines = self.removeRedOnlyLines(self, lines);
    }
    handleClick(x, y) {
        if (this.state.status) {            
            console.log('Board :: onClick', x, y);
            let lines = this.state.lines;
            if (lines[y][x].type === 'box') {
                switch (lines[y][x].boxType){
                default:
                    let trap = Math.random() >= 0.5;
                    if (trap && lines[y][x]['boxType'] < 3) {
                        if (this.state.sound)
                            this.sound2.play();
                        lines[y][x]['boxType']++;
                        lines[y][x]['className'] = 'App-box' + lines[y][x]['boxType'] + ' App-box';
                    }
                    else {
                        if (this.state.sound)
                            this.sound1.play()
                        lines[y][x] = this.createBox('empty');
                    }
                    break;
                case 4:
                    if (this.state.sound)
                        this.sound3.play();
                    this.newGame();
                    break;
                }
            }
            this.setState({lines: lines});
        }
    }
    resetModal() {
        this.setState({modal: {
                text: '',
                button: '',
                onDone: () => {}
        }});

    }
    checkVictory(self) {
        if (self.getRemainingTime() <= 0) {
            if ((this.state.level + 1) < this.levels.length) {
                this.setState(
                    {
                        lines: this.initBoard(8),
                        period: 0,
                        status: 0,
                        newLines: 2200,
                        timeout: this.levels[this.state.level + 1].speed,
                        level: this.state.level + 1,
                        modal: {text: '<h2>Bravo, you win!</h2><br/><br/>You can now move on to more popping, more fun, more cute and challenging bubbles.',
                                button: 'Keep on poppin\'',
                                onDone: () => {this.resetModal(); this.start()}
                               }
                    }
                );
                clearInterval(this.interval);
                this.saveGame();
            }
            else {
                this.setState(
                    {
                        lines: this.initBoard(8),
                        period: 0,
                        status: 0,
                        newLines: 2200,
                        level: this.state.level,
                        modal: {text: '<h2>You\'re a champ!</h2><br/><br/>Congratulations, you finished the game! If you want more of it, tweet us at <a href="https://twitter.com/BubbleTimeGame">@BubbleTimeGame</a>, we\'d love to hear from you. Thanks!',
                                button: 'Play again',
                                onDone: () => {this.resetModal(); this.start()}
                               }
                    }
                );
                clearInterval(this.interval);
                this.saveGame();               
            }
        }
    }
    saveGame() {
        let localStorage = window.localStorage;
        let save = {level: this.state.level}
        localStorage[this.storageKey] = JSON.stringify(save);
    }
    checkLoss(self) {
        let check1 = true;
        let check2 = false;
        let lines = self.state.lines;
        
        for (let i = 0; i < lines[0].length && check1; i++) {
            if (i + 1 < lines[0].length &&
                lines[0][i].type !== lines[0][i + 1].type) {
                check1 = false;
            }
        }

        for (let i = 0; i < lines.length && !check2; i++) {
            for (let j = 0; j < lines[i].length; j++) {
                if (lines[i][j].type === 'empty'){
                    check2 = true;
                }
            }
        }

        if (!(check1 && check2)) {
            self.setState({lines: self.initBoard(8)}, self.newGame);
        }
        return check1 && check2;
    }
    start() {
        let self = this;

        clearInterval(this.interval);
        if (!this.state.status) {
            this.interval = setInterval(function() {
                self.updateBoard(self);
                self.checkLoss(self);
                self.checkVictory(self);
            }, this.state.timeout);
        }
        this.setState({status: this.state.status === 0 ? 1 : 0})
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    getRemainingTime() {
        return this.levels[this.state.level].timer - ((1000 - this.state.timeout) * (this.state.period)/1000000)
    }
    onLevelselect(index) {
        if (index <= this.loadLevel()) {
            this.setState({
                lines : this.initBoard(8),
                period: 0,
                level: index,
                menu: false,
                timeout: this.levels[index].speed
            }, () => {this.start()});
        }
    }
    switchSound() {
        console.log('Switchsound called');
        this.setState({sound:!this.state.sound});
    }
    render() {
        return (<div>
                <Menu display={this.state.menu} levels={this.levels}
                onLevelSelect={(index) => {this.onLevelselect(index)}}
                onModalClick={(modal) => {this.setState({modal: modal})}}
                onSoundSwitch={() => this.switchSound()}
                sound={this.state.sound}
                closeModal={() => {this.resetModal()}}
                level={this.loadLevel()}/>
                <PauseModal
                onSwitch={() => this.switchSound()}
                onResume={() => {this.start()}} 
                onRestart={() => {this.setState({lines: this.initBoard(8), period: 0}, this.start())}}
                onMenu={() => {this.setState({menu: true})}}
                sound={this.state.sound}
                display={this.state.status === 0}/>
                <Modal onDone={this.state.modal.onDone}
                text={this.state.modal.text}
                button={this.state.modal.button}/>
                <div className="App-header">
                <div className="App-level">Level {this.state.level + 1}</div>
                <div className="App-timer">
                {Math.round(this.getRemainingTime(), 1)} s
                </div>
                <img src={this.state.status ? pauseButton : closeButton} className="App-play" onClick={() => this.start()}/>
                </div>
                <div className="App-board">
                {this.state.lines.map((line, y) => {
                    return line.map((item, x) => {
                        return (<div key={x + ':' + y}
                                className={item.className}
                                onClick={() => this.handleClick(x, y)}
                                style={item.style}>
                                </div>);
                    });
                })}
                </div>
                </div>                
        );
  }
}

export default Board;
