import React, { useState, useEffect } from 'react'
import RecordRTC from 'recordrtc'

const RecordAudio = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [recordRTC, setRecordRTC] = useState(null)

  useEffect(() => {
    const initRecordRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        })
        const recorder = RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/wav',
          recorderType: RecordRTC.StereoAudioRecorder,
          numberOfAudioChannels: 1
        })
        setRecordRTC(recorder)
      } catch (error) {
        console.error('Error accessing microphone:', error)
      }
    }

    initRecordRTC()
  }, [])

  const startRecording = () => {
    if (recordRTC) {
      recordRTC.startRecording()
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (recordRTC) {
      recordRTC.stopRecording(() => {
        const blob = recordRTC.getBlob()
        setAudioBlob(blob)
        setIsRecording(false)
      })
    }
  }

  const saveRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display: none'
      a.href = url
      a.download = 'recordedAudio.wav'
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <button onClick={saveRecording} disabled={!audioBlob}>
        Save Recording
      </button>
      {audioBlob && (
        <div>
          <audio controls>
            <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
          </audio>
        </div>
      )}
    </div>
  )
}

export default RecordAudio
