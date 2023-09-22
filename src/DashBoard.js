import React, { useEffect } from "react";
import MicRecorder from 'mic-recorder-to-mp3';
import { Link, useNavigate } from 'react-router-dom';
import ScoreSlider from "./ScoreSlider";
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class DashBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userHistory: {},
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
            userId: null,
            currentAction: null,
            showOtherUserAudio: false,
            showEnrollment: false,
            enrollmentProgress: false,
            isRunning: false,
        };
        this.timer = null;
    }

    componentDidMount() {
        this.getUserScoreHistory()
        this.intervalId = setInterval(() => {
            console.log('This function is invoked every 5 seconds.');
            this.getUserScoreHistory()
            // Perform any actions you want here
        }, 5000);
    }

    componentWillUnmount() {
        // Clear the interval when the component unmounts to avoid memory leaks
        clearInterval(this.intervalId);
    }

    validateAudio = () => {
        const formData = new FormData();
        formData.append("webmasterfile", this.state.blobData);
        var requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        };
        fetch('https://teams.dev.sondeservices.com/user/' + this.state.userId + '/verification', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("Got the response from server for verification - ", result)
                let prob = result.prod;
                if (prob >= 0.999990) {
                    this.uploadToS3()
                } else {
                    console.log("Audio file is of some other user, can not score!")
                    this.updateHistory(false, 2)
                    this.setState({
                        showOtherUserAudio: true, gotFirstRecord: true, isRecording: true
                    })
                }
            })
            .catch(error => console.log('error', error));
    }

    getUserScoreHistory = () => {

        fetch('https://teams.dev.sondeservices.com/api/user-management/users-history')
          .then(response => response.json())
          .then(result => {
            console.log('User - history ', result)
            this.setState({ userHistory: result })
          });
      }

    generateVoiceFeatures = () => {
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

    updateHistory = (cond, num) => {
        var idData = this.state.scoreId
        var count = this.state.historyData.length
        var session_count = this.state.historyData.length + 1
        this.setState({ currentSessionCount: 'Session-' + session_count, dateToday: new Date().toLocaleString() })
        if (cond) {
            this.setState({
                historyData: this.state.historyData.concat([{ [idData]: this.state.data }]), mappingData: this.state.mappingData.concat(
                    {
                        "id": idData,
                        "seq": "_" + count,
                        "score": this.state.aggScore,
                        "name": "Session-" + session_count,
                        "inferred_at": new Date().toLocaleString(),
                        "color": "green",
                        "enable": true
                    }
                )
            })

        } else {
            if (num == 1) {
                this.setState({
                    historyData: this.state.historyData.concat([{ [idData]: this.state.data }]), mappingData: this.state.mappingData.concat(
                        {
                            "id": idData,
                            "seq": "_" + count,
                            "score": "Insufficient user audio",
                            "name": "Session-" + session_count,
                            "inferred_at": new Date().toLocaleString(),
                            "color": "red",
                            "enable": "none"
                        }
                    )
                })
            } else {
                this.setState({
                    historyData: this.state.historyData.concat([{ [idData]: this.state.data }]), mappingData: this.state.mappingData.concat(
                        {
                            "id": idData,
                            "seq": "_" + count,
                            "score": "Verification failed",
                            "name": "Session-" + session_count,
                            "inferred_at": new Date().toLocaleString(),
                            "color": "red",
                            "enable": "none"
                        }
                    )
                })
            }

        }
        // console.log("updated data - ", this.state.historyData, ' - mapping data - ', this.state.mappingData)
    }

    handleClick = () => {
        if (!this.state.isRunning) {
            this.start();
            this.timer = setInterval(this.start, 7000);
        } else {
            clearInterval(this.timer);
        }

        // Toggle the state
        this.setState((prevState) => ({
            isRunning: !prevState.isRunning,
        }));
    };

    stopMe = () => {
        console.log("Stop invoked!")
        Mp3Recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const blobURL = URL.createObjectURL(blob)
                this.setState({ blobURL, blobData: blob });
                console.log(this.state.blobData, ' - This is the blob data')
                this.generateVoiceFeatures()
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
                    setTimeout(this.stopMe, 6000)
                }).catch((e) => console.error(e));
        }
    };



    resetEverything = () => {
        this.setState({
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
            timeUnit: 30
        })
    }
    handleReset() {
        const reset = {
            url: null,
            blob: null,
            chunks: null,
            duration: {
                h: 0,
                m: 0,
                s: 0
            }
        };
        this.setState({ audioDetails: reset });
    }
    render() {
        return (<div>
            <div>

                {/* <div hidden={this.state.isRecording || this.state.finalScore.isLoading}>
                    <div hidden={this.state.finalScore.isData} style={{ border: "1.5px solid #30A7FF", position: 'absolute', top: '70%', right: "25%", width: "50%", height: "40%", backgroundColor: "#00344E", borderRadius: "15px", padding: "13px", color: "#b2dfee" }}>
                        <h1>
                            Welcome to Dashboard!
                        </h1>

                    </div>

                </div> */}
            </div>
            <br>
            </br>
            <Link to="/home">Go to Home Component</Link>
            <br>
            </br>
            <br>
            </br>
            <br>
            </br>

            <button onClick={this.handleClick}>
                {this.state.isRunning ? 'Stop Timer' : 'Start Timer'}
            </button>

            <ScoreSlider data={this.state.userHistory}/>

            <Link to="/enrollment">Go to enrollment Component</Link>
            <br>
            </br>


        </div>
        )
    }
}

export default DashBoard
