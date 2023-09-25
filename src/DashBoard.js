import React, { useEffect } from "react";
import MicRecorder from 'mic-recorder-to-mp3';
import { Link, useNavigate } from 'react-router-dom';
import ScoreSlider from "./ScoreSlider";
import Header from "./Header";

// const Mp3Recorder = new MicRecorder({ bitRate: 128 });

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
            isRecording: false,
            blobURL: '',
            timer: 0, // Elapsed recording time in seconds
            verified_user: '',
            unverified: false
        };
        this.timer = null;
        this.micRecorder = new MicRecorder({ bitRate: 128 });


    }

    componentDidMount() {
        this.getUserScoreHistory()
        this.intervalId = setInterval(() => {
            console.log('This function is invoked every 5 seconds.');
            this.getUserScoreHistory()
        }, 10000);
    }

    startRecording = () => {
        this.setState({ isRecording: true });
        console.log('Recording started!')
        this.micRecorder.start().then(() => {
            this.recordTimer = setInterval(() => {
                this.setState((prevState) => ({ timer: prevState.timer + 1 }));
                if (this.state.timer % 3.5 === 0) {
                    this.micRecorder
                        .stop()
                        .getMp3()
                        .then(([buffer, blob]) => {
                            console.log('Start audio file saved!')
                            const blobURL = URL.createObjectURL(blob);
                            this.setState({ blobURL });
                            this.generateVoiceFeatures(blob);
                        });
                    this.micRecorder.start(); // Resume recording
                }
            }, 500);
        });
    }

    stopRecording = () => {
        console.log('Recording stopped!')
        this.setState({ isRecording: false });
        clearInterval(this.recordTimer);
        this.micRecorder.stop().getMp3().then(([buffer, blob]) => {
            // Handle the recorded blob data and send it to the server
            console.log('Stop audio file saved!')
            const blobURL = URL.createObjectURL(blob);
            this.setState({ blobURL });
            this.generateVoiceFeatures(blob);
        });
    }

    getUserScoreHistory = () => {
        fetch('https://teams.dev.sondeservices.com/api/user-management/users-history')
            .then(response => response.json())
            .then(result => {
                console.log('User - history ', result)
                this.setState({ userHistory: result })
            });
    }

    generateVoiceFeatures = (recorded_data) => {
        console.log('Invoking server to get the voice feature response for recorded_data - ', recorded_data)
        const formData = new FormData();
        formData.append("webmasterfile", recorded_data);
        var requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        };


        fetch('https://teams.dev.sondeservices.com/docker-voice-features', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("Got the response from server for voice features - ", result)
                if (result.hasOwnProperty('code')) {
                    this.setState({ unverified: true })
                }
                if (Array.isArray(result) && result.length > 0 && result[0].hasOwnProperty('chunks') && result[0].chunks === 1) {
                    this.setState({unverified: false, verified_user: result[0].user_identifier})
                }

                this.setState({ enrollmentStatus: true, enrollmentProgress: false })
            })
            .catch(error => console.log('error', error));

        this.setState({ blobData: null })
    }

    handleClick = () => {
        if (!this.state.isRunning) {
            this.start();
            this.timer = setInterval(this.start, 3000);
        } else {
            clearInterval(this.timer);
        }

        // Toggle the state
        this.setState((prevState) => ({
            isRunning: !prevState.isRunning,
        }));
    };

    // initiate = () => {
    //     Mp3Recorder
    //         .stop()
    //         .getMp3()
    //         .then(([buffer, blob]) => {
    //             const blobURL = URL.createObjectURL(blob)
    //             this.setState({ blobURL, blobData: blob });
    //             console.log(this.state.blobData, ' - Initialize data')
    //         }).catch((e) => console.log(e));
    // };

    // stopMe = () => {
    //     console.log("Stop invoked!")
    //     Mp3Recorder
    //         .stop()
    //         .getMp3()
    //         .then(([buffer, blob]) => {
    //             const blobURL = URL.createObjectURL(blob)
    //             this.setState({ blobURL, blobData: blob });
    //             console.log(this.state.blobData, ' - This is the blob data')
    //             this.generateVoiceFeatures()
    //         }).catch((e) => console.log(e));
    // };

    // start = () => {
    //     console.log("Start the Enrollment Process - blob data - ", this.state.blobData)
    //     if (this.state.isBlocked) {
    //         console.log('Permission Denied');
    //     } else {
    //         Mp3Recorder
    //             .start()
    //             .then(() => {
    //                 setTimeout(this.stopMe, 7000)
    //             }).catch((e) => console.error(e));
    //     }
    // };

    render() {
        return (<div>
            <Header />
            <ScoreSlider data={this.state.userHistory} />
            <button style={{ border: "1.5px solid #30A7FF", position: 'absolute', left: '25%', bottom: "5%", width: "50%", backgroundColor: "#00344E", borderRadius: "15px", padding: "13px", color: "#b2dfee", fontSize: '15px' }} onClick={this.state.isRecording ? this.stopRecording : this.startRecording}>
                {this.state.isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {/* {this.state.blobURL && (
                <audio controls src={this.state.blobURL} />
            )} */}
            <div style={{ bottom: "0%" }} hidden={!this.state.isRecording}>
                <h3>
                    Please keep talking (on any topic)</h3>
                <img src={process.env.PUBLIC_URL + '/recorder.gif'} alt="My Image" />
            </div>
            <div hidden={!this.state.isRecording}>
                {this.state.unverified ? <h1> SEGMENT VERIFIED - UNVERIFIED</h1> : <h1>
                SEGMENT VERIFIED - {this.state.verified_user} </h1>}
            </div>


        </div>
        )
    }
}

export default DashBoard
