import { useCallback, useRef, useEffect } from 'react';

interface SoundOptions {
  volume?: number;
  loop?: boolean;
}

export const useSound = () => {
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);
  const messageAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    alarmAudioRef.current = new Audio('/audios/Alarma.mp3');
    messageAudioRef.current = new Audio('/audios/MensajesNuevos.mp3');
    
    return () => {
      alarmAudioRef.current?.pause();
      messageAudioRef.current?.pause();
    };
  }, []);

  const playAlarm = useCallback((options?: SoundOptions) => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.currentTime = 0;
      alarmAudioRef.current.volume = options?.volume ?? 0.8;
      alarmAudioRef.current.loop = options?.loop ?? false;
      alarmAudioRef.current.play().catch(console.error);
    }
  }, []);

  const playMessageSound = useCallback((options?: SoundOptions) => {
    if (messageAudioRef.current) {
      messageAudioRef.current.currentTime = 0;
      messageAudioRef.current.volume = options?.volume ?? 0.6;
      messageAudioRef.current.play().catch(console.error);
    }
  }, []);

  const stopAlarm = useCallback(() => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause();
      alarmAudioRef.current.currentTime = 0;
    }
  }, []);

  const stopMessageSound = useCallback(() => {
    if (messageAudioRef.current) {
      messageAudioRef.current.pause();
      messageAudioRef.current.currentTime = 0;
    }
  }, []);

  return {
    playAlarm,
    playMessageSound,
    stopAlarm,
    stopMessageSound,
  };
};

export const playAlarm = (options?: SoundOptions) => {
  const audio = new Audio('/audios/Alarma.mp3');
  audio.volume = options?.volume ?? 0.8;
  audio.loop = options?.loop ?? false;
  audio.play().catch(console.error);
  return audio;
};

export const playMessageSound = (options?: SoundOptions) => {
  const audio = new Audio('/audios/MensajesNuevos.mp3');
  audio.volume = options?.volume ?? 0.6;
  audio.play().catch(console.error);
  return audio;
};