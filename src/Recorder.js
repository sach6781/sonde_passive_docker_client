import React from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import { Link } from 'react-router-dom';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

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
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
    padding: '20px',
    textAlign: 'center',
    position: 'relative',
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
    }


    enrollUser = () => {
        const formData = new FormData();
        formData.append("webmasterfile", this.state.blobData);
        var requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        };


        fetch('https://teams.dev.sondeservices.com/user/' + this.state.user_name + '/docker-enroll', requestOptions)
            .then((response) => {
                if (response.status === 200) {

                    this.setState({ showPopup: true })
                    return response.json();
                } else if (response.status === 400) {
                    return response.json().then((data) => {
                        console.error('Bad Request:', data);

                    });
                } else {
                    console.error('HTTP Error:', response.status);
                }
            })
            .catch((error) => {
                console.error('Fetch Error:', error);
                // Handle network errors or other exceptions
            });


    }

    getVoiceFeatures = () => {
        console.log('Invoking server to get the voice feature response')
        const formData = new FormData();
        formData.append("webmasterfile", this.state.blobData);
        var requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        };


        fetch('https://teams.dev.sondeservices.com/docker-voice-features', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("Got the response from server for voice features - ", result)
                this.setState({ enrollmentStatus: true, enrollmentProgress: false })
            })
            .catch(error => console.log('error', error));



    }

    getUserHistory = () => {
        fetch('http://44.199.95.17:8080/api/user-management/user/' + this.state.user_name + '/scoring-history')
            .then(response => response.json())
            .then(result => {
                console.log('User - history ', result)
            });
    }

    stopMe = () => {
        console.log("Stop Recording Invoked!")
        Mp3Recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const blobURL = URL.createObjectURL(blob)
                this.setState({ blobURL, blobData: blob });

                // console.log("Current State Action - ", this.state.currentAction)
                // if (this.state.currentAction == 'ENROLL') {
                //     this.enrollUser()
                // } else {
                //     this.validateAudio()
                // }
                // this.uploadToS3()
                // this.enrollUser()

                console.log(this.state.blobData, ' - This is the blob data')

                // this.testEnroll()
                this.enrollUser()
                // this.validateAudio()
                // this.getVoiceFeatures()
            }).catch((e) => console.log(e));
    };

    start = () => {

        console.log("Start the Enrollment Process!")
        if (this.state.isBlocked) {
            console.log('Permission Denied');
        } else {
            Mp3Recorder
                .start()
                .then(() => {
                    setTimeout(this.stopMe, 5000)
                }).catch((e) => console.error(e));
        }
    };

    uploadToS3 = () => {
        console.log("Going to get features for user-id - ", this.state.user_name)
        const formData = new FormData();
        formData.append("webmasterfile", this.state.blobData);
        var requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        };

        fetch('https://teams.dev.sondeservices.com/user/' + this.state.user_name + '/voice-features', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result, ' -  Final Data ')
                console.log(result.score.inference[0].score, ' - Agg Score')
                this.setState({ finalScore: { isLoading: false, isData: true, recording: false } })
                this.setState({ finalScore: { isData: true }, showOtherUserAudio: false })
                this.setState({ data: result.score.inference[0].voiceFeatures, aggScore: result.score.inference[0].score.value, scoreId: result.score.id, dateToday: new Date().toLocaleString() })
                this.setState({ showReset: true, gotFirstRecord: true })
                var speech_rate = result.score.inference[0].voiceFeatures[7].score
                if (speech_rate >= 5) {
                    // this.updateHistory(true, 0)
                    this.setState({
                        showRedError: false
                    })
                } else {
                    // this.updateHistory(false, 1)
                    this.setState({
                        showRedError: true
                    })
                }
            })
            .catch(error => console.log('error', error));
    }


    handleInputChange = (event) => {
        this.setState({ 'user_name': event.target.value })
    };

    validateAudio = () => {
        const formData = new FormData();
        formData.append("webmasterfile", this.state.blobData);
        var requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        };
        fetch('https://teams.dev.sondeservices.com/user/' + this.state.user_name + '/docker-enroll', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("Got the response from server for verification - ", result)
                let prob = result.prod;
                if (prob >= 0.999990) {
                    this.uploadToS3()
                } else {
                    console.log("Audio file is of some other user, can not score!")
                    // this.updateHistory(false, 2)
                    this.setState({
                        showOtherUserAudio: true, gotFirstRecord: true, isRecording: true
                    })
                }
            })
            .catch(error => console.log('error', error));
    }

    handleContinueClick = () => {
        this.setState({ showPopup: false })
    }


    render() {
        return (
            <div>
                <h1>
                    This is Recorder File.
                </h1>



                Name - <input style={{ margin: '5px' }}
                    type="text"
                    placeholder="User Name"
                    value={this.state.user_name}
                    onChange={this.handleInputChange}
                />
                {/* <p>You typed: {this.state.user_name}</p> */}
                <br>
                </br>
                <button style={{ backgroundColor: "#00344E", border: "none" }} onClick={this.start}><h3 style={{ color: "#b2dfee" }}> Enroll now </h3> </button> {this.state.user_name}
                <br>
                </br>
                <br>
                </br>





                {/* <button style={{ backgroundColor: "#00344E", border: "none" }} onClick={this.getUserHistory}><h3 style={{ color: "#b2dfee" }}>Enroll New User</h3>  </button> */}

                <br>
                </br>
                <Link to="/enrollment">Enrollment Screen</Link>
                <br>
                </br>
                <Link to="/home">Go to Home Component</Link>
                <br>
                </br>



                <div>
                    {this.state.showPopup && (
                        <div style={popupStyle}>
                            <div style={popupContentStyle}>
                                <p>This is a nice-looking popup!</p>
                                <button style={closeButtonStyle} onClick={this.handleContinueClick}>

                                    <Link style={{ textDecoration: 'none', color: 'black' }} to="/enrollment"> Continue </Link>
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
