import React from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import { Link } from 'react-router-dom';
import Header from './Header';

const popupStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const popupContentStyle = {
    backgroundColor: '#00344E',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
    padding: '20px',
    textAlign: 'center',
    position: 'absolute',
    color: "#b2dfee",
    borderRadius: "15px",
    border: "1.5px solid #30A7FF",
};

const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
};

class Recorder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            historyOn: false,
            showRedError: false,
            gotFirstRecord: false,
            tempData: [{ "name": "Smoothness", "score": "99" }, { "name": "Liveliness", "score": "0.45" }, { "name": "Control", "score": "98" }, { "name": "Energy Range", "score": "13" }, { "name": "Clarity", "score": "0.21" }, { "name": "Crispness", "score": "134" }, { "name": "Speech Rate", "score": "31" }, { "name": "Pause Duration", "score": "0.88" }],
            scoreId: "1234",
            firstRecordPresent: false,
            dateToday: 'Current Date',
            showReset: false,
            aggScore: 48,
            data: [{ "name": "Smoothness", "score": "99" }, { "name": "Liveliness", "score": "0.45" }, { "name": "Control", "score": "98" }, { "name": "Energy Range", "score": "13" }, { "name": "Clarity", "score": "0.21" }, { "name": "Crispness", "score": "134" }, { "name": "Speech Rate", "score": "31" }, { "name": "Pause Duration", "score": "0.88" }],
            isRecording: false,
            showTimer: false,
            blobURL: '',
            isBlocked: false,
            blobData: null,
            finalScore: {
                aggregatedScore: null,
                isLoading: false,
                isData: false
            },
            timeUnit: 30,
            historyData: [
            ],
            mappingData: [
            ],
            currentSessionCount: 'Session-0',
            enrollmentStatus: false,
            userIdentifier: null,
            currentAction: null,
            showOtherUserAudio: false,
            showEnrollment: false,
            enrollmentProgress: false,
            user_name: null,
            showPopup: false
        };
        this.micRecorder = new MicRecorder({ bitRate: 128 });

    }

    enrollUser = (recorded_blob) => {
        console.log('Enrolling user with blobData - ', recorded_blob)
        const formData = new FormData();
        formData.append("webmasterfile", recorded_blob);
        var requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        };
        fetch('https://teams.dev.sondeservices.com/user/' + this.state.user_name + '/docker-enroll', requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({ showPopup: true,  enrollmentProgress: false })
                    return response.json();
                } else if (response.status === 400) {
                    return response.json().then((data) => {
                        console.error('Bad Request:', data);
                        this.setState({ enrollmentProgress: false })
                    });
                } else {
                    console.error('HTTP Error:', response.status);
                    this.setState({ enrollmentProgress: false })
                }
            })
            .catch((error) => {
                console.error('Fetch Error:', error);
                this.setState({ enrollmentProgress: false })
            });
    }

    stopMe = () => {
        console.log("Stop Recording Invoked!")
        this.micRecorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const blobURL = URL.createObjectURL(blob)
                this.setState({ blobURL });
                this.enrollUser(blob)
            }).catch((e) => console.log(e));
    };

    start = () => {
        this.setState({ currentAction: 'ENROLL', enrollmentProgress: true })
        if (this.state.isBlocked) {
            console.log('Permission Denied');
        } else {
            this.micRecorder.start().then(() => {
                setTimeout(this.stopMe, 30000)
            }).catch((e) => console.error(e));
        }
    };


    handleInputChange = (event) => {
        this.setState({ 'user_name': event.target.value })
    };

    handleContinueClick = () => {
        this.setState({ showPopup: false })
    }


    render() {
        return (
            <div>
                <Header />
                <br>
                </br>
                <h4>Enter Name </h4>  <input style={{ margin: '5px' }}
                    type="text"
                    placeholder="User Name"
                    value={this.state.user_name}
                    onChange={this.handleInputChange}
                />

                <br>
                </br>
                <br>
                </br>
                <button style={{ backgroundColor: "#00344E", border: "none" }} onClick={this.start}><h3 style={{ color: "#b2dfee" }}> Enroll now </h3> </button>
                <br>
                </br>
                <div hidden={!this.state.enrollmentProgress}> Enrolling - Please give 30 seconds of voice sample (on any topic)
                    <br>
                    </br>
                    <img src={process.env.PUBLIC_URL + '/recorder.gif'} alt="My Image" />
                </div>
                <br>
                </br>


                Click to Enroll - {this.state.user_name}
                <br>
                </br>
                <div>
                    {this.state.showPopup && (
                        <div style={popupStyle}>
                            <div style={popupContentStyle}>
                                <p>ENROLLMENT COMPLETED SUCCESSFULLY!</p>
                                <button style={closeButtonStyle} onClick={this.handleContinueClick}>
                                    <Link style={{ textDecoration: 'none', color: 'white' }} to="/enrollment"> CONTINUE </Link>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )

    }
}

export default Recorder;
