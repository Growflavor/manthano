import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import Workspace from './components/Workspace';
import Loader from 'react-loader-spinner';
import Popup from 'reactjs-popup';
import Button from 'react-bootstrap/Button';

// connection "enum" for connecting to a robot
const connection = {
  UNKNOWN: 1,
  UNUSCCESSFUL: 2,
  SUCCESSFUL: 3
}

// session ID generator
// TODO: check if good practice to just write this function here
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

class App extends Component {
  state = {
    sessionId: "",
    isLoaded: false,
    connectionLoading: false,
    ip: "",
    user: "",
    pw: "",
    connected: connection.UNKNOWN,
    showPopup: false,
    correctFormat: false,
    robotCSVList: [],
    robotCSVContent: [],
    CSVDelimiterList: [],
  }

  // Handles the IP address input field. Checks if IP has valid pattern
  handleChangeIp = (event) => {
    this.setState({ ip: event.target.value })
    if(event.target.value.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      this.setState({
        correctIpFormat: true
      });
    } else {
      this.setState({
        correctIpFormat: false
      });
    }
  }

  // Handles the user input field
  handleChangeUser = (event) => {
    this.setState({
      user: event.target.value
    })
  }

  // Handles the password input field
  handleChangePw = (event) => {
    this.setState({
      pw: event.target.value
    })
  }

  // Handles Submission of connection form.
  handleSubmit = () => {
    // Backend checks if it can create a SFTP connection to robot
    // TODO What happends if connection is lost in between? User won't have any feedback about lost connection. Could reconnect to robot every minute or so?
    this.setState({ connectionLoading: true, error: ""}, () => {
      axios.get('http://'  + window.location.hostname + ':80/api/connect/' + this.state.ip + '/' + this.state.user  + '/' + this.state.pw)
      .then(res => {
        console.log(res.data);
        this.setState({
          robotCSVList: res.data[1],
          robotCSVContent: res.data[2],
          CSVDelimiterList: res.data[3],
          connected: (res.data[0] ? connection.SUCCESSFUL : connection.UNUSCCESSFUL),
          connectionLoading: false,
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          connectionLoading: false,
        });
      });
    });
  }

  componentDidMount() {
    // Generate session ID and store it in local storage if not existent
    if(localStorage.getItem('sessionID') != null) {
      this.setState({
        sessionId: localStorage.getItem('sessionID'),
        isLoaded: true
      });
    } else {
      var guid = guidGenerator();
      console.log(guid);
      localStorage.setItem('sessionID', guid);
      this.setState({
        sessionId: guid,
        isLoaded: true
      });
    }
  }

  render() {
    // ev3Connect gives user feedback if the Connection to the robot was successfull
    console.log(this.state)
    let ev3Connect;
    switch(this.state.connected) {
      case connection.UNKNOWN:
      ev3Connect = <span></span>
      break;
      case connection.UNUSCCESSFUL:
      ev3Connect = <span style={{color: 'red'}}>Connection refused. Please re-check your robot's IP and try again.</span>
      break;
      case connection.SUCCESSFUL:
      ev3Connect = <span style={{color: 'green'}}>Connection successful. You are connected to the robot with the IP address {this.state.ip}</span>
      break;
      default:
      ev3Connect = <span>Something's wrong</span>
      break;
    }

    // isLoaded is false if session ID hasn't been generated yet. Returns loading spinner if false
    const isLoaded = this.state.isLoaded;
    console.log(isLoaded);
    if (!isLoaded) {
      return(
        <div><Loader type="Oval" color="#somecolor" height={80} width={80} /></div>
      );
    } else {
      // Returns app heading, the connection button which opens a popup form and the workspace component
      return(
      <div>
        <div>
          <h1 style={{ fontFamily: 'Liu Jian Mao Cao', fontSize: '80px'}}>&mu;anth&aacute;n&#333;</h1>
          <Popup
            trigger={<Button variant="light">Connect to EV3</Button>}
            modal
            closeOnDocumentClick
            >
            {close => (
              <div>
                <form>
                  <label>
                    IP address:
                    <input type="text" value={this.state.ip} onChange={this.handleChangeIp}/>
                  </label>
                  <label>
                    User:
                    <input type="text" value={this.state.user} onChange={this.handleChangeUser}/>
                  </label>
                  <label>
                    Password:
                    <input type="text" value={this.state.pw} onChange={this.handleChangePw}/>
                  </label>
                  <Button onClick={() => {
                      close();
                      this.handleSubmit();
                    }} disabled={!(this.state.correctIpFormat && (this.state.user.length > 0) && (this.state.pw.length > 0))} variant="light">Connect</Button>
                  </form>
                  { this.state.correctIpFormat
                    ? <span style={{color: 'green'}}>Valid IP address</span>
                    : <span style={{color: 'red'}}>You need to enter a IP address</span>
                }
              </div>
            )}
          </Popup>
          { this.state.connectionLoading ? <Loader type="Oval" color="#a8a8a8" height={80} width={80} /> : ev3Connect}
        </div>
        <div>
          <Workspace session={this.state.sessionId} connection={this.state.connected} csvList={this.state.robotCSVList} csvContents={this.state.robotCSVContent} delimiters={this.state.CSVDelimiterList}/>
        </div>
      </div>
    );
  }
}
}

export default App;
