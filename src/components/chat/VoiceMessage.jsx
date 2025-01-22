import React, { useState, useEffect } from 'react';
import { Mic, Send, X } from 'lucide-react';

const VoiceMessage = ({ onSend }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => interval && clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      // You might want to show an error message to the user here
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    setAudioBlob(null);
    setRecordingTime(0);
    setAudioChunks([]);
  };

  const handleSend = async () => {
    if (audioBlob && onSend) {
      await onSend(audioBlob);
      // Reset state after sending
      setAudioBlob(null);
      setRecordingTime(0);
      setAudioChunks([]);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2">
      {!audioBlob ? (
        <button 
          onClick={() => isRecording ? stopRecording() : startRecording()}
          className={`p-2 rounded-full ${
            isRecording ? 'bg-red-500' : 'bg-gray-100'
          }`}
          aria-label={isRecording ? "Stop Recording" : "Start Recording"}
        >
          <Mic className={`h-5 w-5 ${isRecording ? 'text-white' : 'text-gray-500'}`} />
        </button>
      ) : null}

      {isRecording && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
          </span>
          <button
            onClick={cancelRecording}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Cancel Recording"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      )}

      {audioBlob && !isRecording && (
        <div className="flex items-center gap-2">
          <audio controls src={URL.createObjectURL(audioBlob)} className="h-8" />
          <button
            onClick={handleSend}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600"
            aria-label="Send Voice Message"
          >
            <Send className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={cancelRecording}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Cancel Recording"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceMessage;