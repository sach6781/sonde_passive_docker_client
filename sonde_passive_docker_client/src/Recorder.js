import React from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import { Link, useNavigate } from 'react-router-dom';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

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
            userId: 'SachinSinghChauhans',
            currentAction: null,
            showOtherUserAudio: false,
            showEnrollment: false,
            enrollmentProgress: false,
            user_name: null
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


        fetch('https://teams.dev.sondeservices.com/user/' + this.state.userId + '/docker-enroll', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("Got the response from server for enrollment - ", result)
                this.setState({ enrollmentStatus: true, enrollmentProgress: false })
            })
            .catch(error => console.log('error', error));

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
                // this.enrollUser()
                // this.validateAudio()
                this.getVoiceFeatures()
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
                    setTimeout(this.stopMe, 10000)
                }).catch((e) => console.error(e));
        }
    };

    uploadToS3 = () => {
        console.log("Going to get features for user-id - ", this.state.userId)
        const formData = new FormData();
        formData.append("webmasterfile", this.state.blobData);
        var requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        };

        fetch('https://teams.dev.sondeservices.com/user/' + this.state.userId + '/voice-features', requestOptions)
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
        this.setState({'user_name': event.target.value})
      };

    validateAudio = () => {
        const formData = new FormData();
        formData.append("webmasterfile", this.state.blobData);
        var requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        };
        fetch('https://teams.dev.sondeservices.com/user/' + this.state.userId + '/docker-enroll', requestOptions)
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

    render() {
        return (
            <div>
                <h1>
                    This is Recorder File.
                </h1>
                <Link to="/dashboard">Go to Dashboard Component</Link>
                <br>
                </br>
                <Link to="/home">Go to Home Component</Link>
                <br>
                </br>
                <button style={{ backgroundColor: "#00344E", border: "none" }} onClick={this.start}><h3 style={{ color: "#b2dfee" }}>Not enrolled - Enroll now </h3>  </button>
                <br>
                </br>
                <br>
                </br>
                <button style={{ backgroundColor: "#00344E", border: "none" }} onClick={this.getUserHistory}><h3 style={{ color: "#b2dfee" }}>Get User History </h3>  </button>
                <input
                    type="text"
                    value={this.state.user_name}
                    onChange={this.handleInputChange}
                />
                <p>You typed: {this.state.user_name}</p>

            </div>
        )

    }
}

export default Recorder;
