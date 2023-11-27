import React, { useEffect } from 'react'
import MicRecorder from 'mic-recorder-to-mp3'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

const Mp3Recorder = new MicRecorder({ bitRate: 128 })

class DockerClient extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      historyOn: false,
      showRedError: false,
      gotFirstRecord: false,
      tempData: [
        { name: 'Smoothness', score: '99' },
        { name: 'Liveliness', score: '0.45' },
        { name: 'Control', score: '98' },
        { name: 'Energy Range', score: '13' },
        { name: 'Clarity', score: '0.21' },
        { name: 'Crispness', score: '134' },
        { name: 'Speech Rate', score: '31' },
        { name: 'Pause Duration', score: '0.88' }
      ],
      scoreId: '1234',
      firstRecordPresent: false,
      dateToday: 'Current Date',
      showReset: false,
      aggScore: 48,
      data: [
        { name: 'Smoothness', score: '99' },
        { name: 'Liveliness', score: '0.45' },
        { name: 'Control', score: '98' },
        { name: 'Energy Range', score: '13' },
        { name: 'Clarity', score: '0.21' },
        { name: 'Crispness', score: '134' },
        { name: 'Speech Rate', score: '31' },
        { name: 'Pause Duration', score: '0.88' }
      ],
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
      historyData: [],
      mappingData: [],
      currentSessionCount: 'Session-0',
      enrollmentStatus: false,
      userIdentifier: null,
      userId: null,
      currentAction: null,
      showOtherUserAudio: false,
      showEnrollment: false,
      enrollmentProgress: false
    }
  }

  componentDidMount () {}

  initiateCheckIn = () => {
    this.startValidate()
    setInterval(this.startValidate, 15000)
  }

  validateAudio = () => {
    const formData = new FormData()
    formData.append('webmasterfile', this.state.blobData)
    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    }
    fetch(
      'https://teams.dev.sondeservices.com/user/' +
        this.state.userId +
        '/verification',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('Got the response from server for verification - ', result)
        const prob = result.prod
        if (prob >= 0.99999) {
          this.uploadToS3()
        } else {
          console.log('Audio file is of some other user, can not score!')
          this.updateHistory(false, 2)
          this.setState({
            showOtherUserAudio: true,
            gotFirstRecord: true,
            isRecording: true
          })
        }
      })
      .catch((error) => console.log('error', error))
  }

  updateHistory = (cond, num) => {
    const idData = this.state.scoreId
    const count = this.state.historyData.length
    const session_count = this.state.historyData.length + 1
    this.setState({
      currentSessionCount: 'Session-' + session_count,
      dateToday: new Date().toLocaleString()
    })
    if (cond) {
      this.setState({
        historyData: this.state.historyData.concat([
          { [idData]: this.state.data }
        ]),
        mappingData: this.state.mappingData.concat({
          id: idData,
          seq: '_' + count,
          score: this.state.aggScore,
          name: 'Session-' + session_count,
          inferred_at: new Date().toLocaleString(),
          color: 'green',
          enable: true
        })
      })
    } else {
      if (num == 1) {
        this.setState({
          historyData: this.state.historyData.concat([
            { [idData]: this.state.data }
          ]),
          mappingData: this.state.mappingData.concat({
            id: idData,
            seq: '_' + count,
            score: 'Insufficient user audio',
            name: 'Session-' + session_count,
            inferred_at: new Date().toLocaleString(),
            color: 'red',
            enable: 'none'
          })
        })
      } else {
        this.setState({
          historyData: this.state.historyData.concat([
            { [idData]: this.state.data }
          ]),
          mappingData: this.state.mappingData.concat({
            id: idData,
            seq: '_' + count,
            score: 'Verification failed',
            name: 'Session-' + session_count,
            inferred_at: new Date().toLocaleString(),
            color: 'red',
            enable: 'none'
          })
        })
      }
    }
    // console.log("updated data - ", this.state.historyData, ' - mapping data - ', this.state.mappingData)
  }

  stopMe = () => {
    console.log('i got end invoked')
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)
        this.setState({ blobURL, blobData: blob })
        console.log('Current State Action - ', this.state.currentAction)
        if (this.state.currentAction == 'ENROLL') {
          this.enrollUser()
        } else {
          this.validateAudio()
        }
        // this.uploadToS3()
        // this.enrollUser()
        // this.validateAudio()
        console.log(this.state.blobData, ' - This is the blob data')
      })
      .catch((e) => console.log(e))
  }

  start = () => {
    this.setState({ currentAction: 'ENROLL', enrollmentProgress: true })
    console.log('Start the Enrollment Process!')
    if (this.state.isBlocked) {
      console.log('Permission Denied')
    } else {
      Mp3Recorder.start()
        .then(() => {
          setTimeout(this.stopMe, 31000)
        })
        .catch((e) => console.error(e))
    }
  }

  startValidate = () => {
    this.setState({ currentAction: 'VALIDATE' })
    console.log('Start the Validation Process!')
    if (this.state.isBlocked) {
      console.log('Permission Denied')
    } else {
      Mp3Recorder.start()
        .then(() => {
          // this.setState({ isRecording: true, showTimer: true });
          setTimeout(this.stopMe, 10000)
        })
        .catch((e) => console.error(e))
    }
  }

  checkEnrollmentStatus = (user_var) => {
    fetch(
      'https://teams.dev.sondeservices.com/user/' + user_var + '/enrollment'
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.setState({
          enrollmentStatus: data.enrolled,
          userId: user_var,
          showEnrollment: true
        })
      })
  }

  setUserIdentifier = (user_var) => {
    console.log('while calling this method - ', user_var)
    fetch('https://teams.dev.sondeservices.com/user/' + user_var)
      .then((response) => response.json())
      .then((data) => this.setState({ userIdentifier: data.userIdentifier }))
  }

  enrollUser = () => {
    const formData = new FormData()
    formData.append('webmasterfile', this.state.blobData)
    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    }
    fetch(
      'https://teams.dev.sondeservices.com/user/' +
        this.state.userId +
        '/enrollment',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('Got the response from server for enrollment - ', result)
        this.setState({ enrollmentStatus: true, enrollmentProgress: false })
      })
      .catch((error) => console.log('error', error))
  }

  uploadToS3 = () => {
    console.log(
      'Going to get features for user-id - ',
      this.state.userIdentifier
    )
    const formData = new FormData()
    formData.append('webmasterfile', this.state.blobData)
    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    }

    fetch(
      'https://teams.dev.sondeservices.com/user/' +
        this.state.userIdentifier +
        '/voice-features',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result, ' -  Final Data ')
        // console.log(result.score.inference[0].score, ' - Agg Score')
        // this.setState({ finalScore: { isLoading: false, isData: true, recording: false } })
        this.setState({
          finalScore: { isData: true },
          showOtherUserAudio: false
        })
        this.setState({
          data: result.score.inference[0].voiceFeatures,
          aggScore: result.score.inference[0].score.value,
          scoreId: result.score.id,
          dateToday: new Date().toLocaleString()
        })
        this.setState({ showReset: true, gotFirstRecord: true })
        const speech_rate = result.score.inference[0].voiceFeatures[7].score
        if (speech_rate >= 5) {
          this.updateHistory(true, 0)
          this.setState({
            showRedError: false
          })
        } else {
          this.updateHistory(false, 1)
          this.setState({
            showRedError: true
          })
        }
      })
      .catch((error) => console.log('error', error))
  }

  resetEverything = () => {
    this.setState({
      showReset: false,
      aggScore: 48,
      data: [
        { name: 'Smoothness', score: '99' },
        { name: 'Liveliness', score: '0.45' },
        { name: 'Control', score: '98' },
        { name: 'Energy Range', score: '13' },
        { name: 'Clarity', score: '0.21' },
        { name: 'Crispness', score: '134' },
        { name: 'Speech Rate', score: '31' },
        { name: 'Pause Duration', score: '0.88' }
      ],
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

  handleReset () {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0
      }
    }
    this.setState({ audioDetails: reset })
  }

  clickMe = (event) => {
    this.setState({
      historyOn: false,
      showRedError: false
    })
    const id = event.currentTarget.id
    const id_array = id.split('_')
    console.log(id, ' - Got the Id')
    this.setState({
      tempData: this.state.historyData[id_array[1]][id_array[0]],
      historyOn: true,
      aggScore: this.state.mappingData[id_array[1]].score,
      dateToday: this.state.mappingData[id_array[1]].inferred_at,
      currentSessionCount: this.state.mappingData[id_array[1]].name
    })
  }

  render () {
    return (
      <div style={{ backgroundColor: '#00344E' }}>
        <div
          style={{ backgroundColor: '#00344E', width: '100%', height: '100%' }}
        >
          <div
            hidden={this.state.isRecording || this.state.finalScore.isLoading}
          >
            <div
              hidden={this.state.finalScore.isData}
              style={{
                border: '1.5px solid #30A7FF',
                position: 'absolute',
                top: '21%',
                right: '25%',
                width: '50%',
                height: '40%',
                backgroundColor: '#00344E',
                borderRadius: '15px',
                padding: '13px',
                color: '#b2dfee'
              }}
            >
              <h1>
                Welcome to Sonde Mental Fitness Tracker App for TEAMS! We'll
                analyze ONLY your voice and share the scores ONLY with you.
              </h1>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DockerClient
