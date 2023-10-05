import React from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import ScoreSlider from './ScoreSlider';
import Header from './Header';

class MentalFitness extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isRecording: false,
            verified_user: '',
            timer: 0,
            userHistory: [],
            enrollmentStatus: false,
            enrollmentProgress: false,
            remainingChunks: 0
        }
        this.micRecorder = new MicRecorder({ bitRate: 128 });
    }

    componentDidMount() {
        this.fetchAgentHistory()
        this.getRemainingChunks()
        this.intervalId = setInterval(() => {
            console.log('This function is invoked every 5 seconds.');
            this.fetchAgentHistory()
        }, 10000);
    }

    getRemainingChunks = (name) => {
        fetch('https://teams.dev.sondeservices.com/api/user-management/user/Agent1/chunks')
            .then(response => response.json())
            .then(result => {
                this.setState({ remainingChunks: result.chunks * 3 })
                console.log("chunks are - ", result.chunks * 3)
            });
    }

    startRecording = () => {
        this.setState({ isRecording: true, verified_user: '' });
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
            }, 700);
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

    generateVoiceFeatures = (recorded_data) => {
        this.setState({ unverified: false, verified_user: '' })
        console.log('Invoking server to get the voice feature response for recorded_data - ', recorded_data)
        const formData = new FormData();
        formData.append("webmasterfile", recorded_data);
        var requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        };


        fetch('https://teams.dev.sondeservices.com/docker-voice-features?identifier=Agent1', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("Got the response from server for voice features - ", result)
                if (result.hasOwnProperty('code')) {
                    this.setState({ unverified: true })
                }
                if (Array.isArray(result) && result.length > 0 && result[0].hasOwnProperty('chunks') && result[0].chunks === 1) {
                    this.setState({ unverified: false, verified_user: result[0].user_identifier })
                    this.setState(prevState => ({
                        remainingChunks: prevState.remainingChunks + result[0].chunks * 3
                    }));
                    if (this.state.remainingChunks >= 30) {
                        this.setState({ remainingChunks: 0 })
                    }
                }
                this.setState({ enrollmentStatus: true, enrollmentProgress: false })
            })
            .catch(error => console.log('error', error));

        this.setState({ blobData: null })
    }

    fetchAgentHistory = () => {
        fetch('https://teams.dev.sondeservices.com/api/user-management/user/Agent1/scoring-history')
            .then(response => response.json())
            .then(result => {
                const transformedData = {};
                const finalData = result.slice(0, 10);
                finalData.forEach(item => {
                    const { user_identifier, calculated_at, id, score } = item;

                    if (!transformedData[user_identifier]) {
                        transformedData[user_identifier] = [];
                    }

                    transformedData[user_identifier].push({ calculated_at, id, score });
                });
                this.setState({ userHistory: transformedData })
            });
    }

    render() {
        return (
            <div>
                <Header />
                <h1>
                    Mental Fitness App
                </h1>
                <ScoreSlider data={this.state.userHistory} />
                <button style={{ border: "1.5px solid #30A7FF", position: 'absolute', left: '25%', bottom: "5%", width: "50%", backgroundColor: "#00344E", borderRadius: "15px", padding: "13px", color: "#b2dfee", fontSize: '15px' }} onClick={this.state.isRecording ? this.stopRecording : this.startRecording}>
                    {this.state.isRecording ? 'Stop Analyzing' : 'Start Analyzing'}
                </button>

                <div style={{ border: "1.5px solid #30A7FF", position: 'absolute', left: '45%', bottom: "25%", width: "10%", borderRadius: "15px", padding: "13px", fontSize: '20px' }}>
                {this.state.remainingChunks} Secs / 30 Secs
                </div>

            </div>)
    }

}

export default MentalFitness