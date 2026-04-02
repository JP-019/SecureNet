import React, { useState, useRef, useEffect } from 'react';

interface VoiceRecorderProps {
  onSendAudio: (url: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSendAudio }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      console.log('Solicitando permiso de micrófono...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Micrófono obtenido:', stream);
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      console.log('MimeType:', mimeType);

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        console.log('Datos disponibles:', e.data.size);
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        console.log('Grabación detenida. Chunks:', audioChunksRef.current.length);
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          console.log('Audio URL:', url);
          onSendAudio(url);
        }

        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        setRecordingTime(0);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (e) {
      console.error('Error al acceder al micrófono:', e);
      alert('No se pudo acceder al micrófono. Verifica los permisos del navegador.');
    }
  };

  const stopRecording = () => {
    console.log('Deteniendo grabación...');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  if (!isRecording) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 12px',
      background: '#DCF8C6',
      borderRadius: 20,
      marginBottom: 10,
    }}>
      <button
        onClick={toggleRecording}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: 'none',
          background: '#E74C3C',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <i className="fas fa-microphone" style={{ color: 'white', fontSize: 16 }} />
      </button>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#E74C3C',
          animation: 'pulse 1s infinite',
        }} />
        <span style={{ color: '#333', fontSize: 14, fontWeight: 500 }}>
          {formatTime(recordingTime * 1000)}
        </span>
      </div>

      <button
        onClick={stopRecording}
        style={{
          padding: '8px 16px',
          borderRadius: 20,
          border: 'none',
          background: '#25D366',
          cursor: 'pointer',
          color: 'white',
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        <i className="fas fa-paper-plane" style={{ marginRight: 6 }} />
        Enviar
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
};