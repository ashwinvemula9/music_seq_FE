import { useRef, useEffect } from 'react';

export function useAudioContext() {
  const audioContext = useRef<AudioContext | null>(null);
  const oscillators = useRef<Map<string, OscillatorNode>>(new Map());

  useEffect(() => {
    audioContext.current = new AudioContext();
    return () => {
      audioContext.current?.close();
    };
  }, []);

  const playNote = (frequency: number, duration: number) => {
    if (!audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.current.currentTime);

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);
    oscillator.stop(audioContext.current.currentTime + duration);
  };

  return { playNote };
}