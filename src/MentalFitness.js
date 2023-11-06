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
            remainingChunks: '',
            noActiveVoice: false,
            statusToShow: '',
            chunksMap: { 'Guests': 10 },
            totalBoxes: 100,
            users: [
                { id: 1, color: 'red' },
                { id: 2, color: 'blue' },
                { id: 3, color: 'green' },
                { id: 4, color: 'yellow' }
                // Add more users with different colors as needed
            ],
            colorMap: {
                Guests: 'green',
                Sachin: 'yellow'
            },
            boxes: Array(100).fill('gray')
        }
        this.micRecorder = new MicRecorder({ bitRate: 128 });
    }


    componentDidMount() {
        // this.interval = setInterval(this.updateUserAction, 3000);
        this.fetchAgentHistory()
        setTimeout(() => {
            this.getRemainingChunks();
        }, 1000);
        this.intervalId = setInterval(() => {
            console.log('This function is invoked every 5 seconds.');
            this.fetchAgentHistory()
            this.getRemainingChunks()
        }, 10000);
    }

    getRemainingChunks = (name) => {
        fetch('https://teams.dev.sondeservices.com/api/user-management/user/Guests/chunks')
            .then(response => response.json())
            .then(result => {
                this.setState({ remainingChunks: result.chunks * 3 })
                console.log("chunks are - ", result.chunks * 3)
            });
    }

    startRecording = () => {
        this.setState({ isRecording: true, statusToShow: '' });
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


        fetch('https://teams.dev.sondeservices.com/docker-voice-features?identifier=Guests', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("Got the response from server for voice features - ", result)
                if (result.hasOwnProperty('code')) {
                    this.setState({ statusToShow: 'Silence detected' })
                    this.updateUserAction('red');
                }
                if (Array.isArray(result) && result.length > 0 && result[0].hasOwnProperty('chunks') && result[0].chunks === 1) {
                    const user = result[0].user_identifier
                    console.log('Identified User - ', user)
                    const { colorMap } = this.state;
                    const colorForGuests = colorMap[user];
                    this.updateUserAction(colorForGuests);
                    this.setState({ statusToShow: 'Voice detected', verified_user: result[0].user_identifier })
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
        fetch('https://teams.dev.sondeservices.com/api/user-management/user/Guests/scoring-history')
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

    renderBoxes = (chunk_map) => {
        const totalBoxes = 100;
        const filledRed = chunk_map;
        const remainingGray = totalBoxes - filledRed;

        const boxes = [];

        for (let i = 0; i < totalBoxes; i++) {
            const color = i < filledRed ? 'green' : 'gray';

            boxes.push(
                <span
                    key={i}
                    style={{
                        border: '1px solid #000',
                        width: '13px',
                        height: '2px',
                        display: 'inline-block',
                        padding: '4px',
                        transition: 'background-color 0.5s, transform 0.3s',
                        backgroundColor: color
                    }}
                >
                </span>
            );
        }

        return boxes;
    };

    updateUserAction = (color_resp) => {
        const { users, boxes } = this.state;
        const color = color_resp

        const updatedBoxes = [...boxes];
        const nextIndex = updatedBoxes.findIndex(box => box === 'gray');
        if (nextIndex !== -1) {
            updatedBoxes[nextIndex] = color;
        }

        this.setState({ boxes: updatedBoxes });
    };

    render() {
        const { boxes } = this.state;
        return (
            <div>
                <Header />
                <h1>
                    Mental Fitness
                </h1>
                <ScoreSlider data={this.state.userHistory} name_chunks_map={10000} />
                <button style={{ border: "1.5px solid #30A7FF", position: 'absolute', left: '25%', bottom: "5%", width: "50%", backgroundColor: "#00344E", borderRadius: "15px", padding: "13px", color: "#b2dfee", fontSize: '15px' }} onClick={this.state.isRecording ? this.stopRecording : this.startRecording}>
                    {this.state.isRecording ? 'Stop Analyzing' : 'Start Analyzing'}
                </button>

                <div style={{ border: "1.5px solid #30A7FF", position: 'absolute', left: '32%', bottom: "18%", width: "30%", borderRadius: "15px", padding: "13px", fontSize: '20px' }}>
                    {this.state.remainingChunks} / 30 sec.
                </div>

                <div style={{ bottom: "0%" }} hidden={!this.state.isRecording}>
                    <h3>
                        Score history </h3>
                    <img src={process.env.PUBLIC_URL + '/recorder.gif'} alt="My Image" />
                    <h5>
                        30 sec. voice sample needed
                    </h5>
                </div>
                <div hidden={!this.state.isRecording}>
                    <h3>
                        {this.state.statusToShow}
                    </h3>
                </div>

                {/* <div style={{ position: 'fixed', bottom: '100', width: '100%', padding: '20px' }}>
                    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        {this.renderBoxes(10)}

                    </div>
                </div> */}

                <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    {boxes.map((color, index) => (
                        <div
                            key={index}
                            style={{
                                border: '1px solid #000',
                                width: '13px',
                                height: '2px',
                                display: 'inline-block',
                                padding: '4px',
                                transition: 'background-color 0.5s, transform 0.3s',
                                backgroundColor: color,
                            }}
                        />
                    ))}
                </div>

            </div>)
    }

}

export default MentalFitness