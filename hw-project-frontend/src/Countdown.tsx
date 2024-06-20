import React, { useEffect, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import countdownAnimation from './assets/CountDown.json'; // Path to your Lottie countdown JSON file
import withFadeTransition from './withFadeTransition';

interface CountdownProps {
  onCountdownComplete: () => void;
  onFadeOut: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ onCountdownComplete, onFadeOut }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFadeOut();
      setTimeout(onCountdownComplete, 1000); // Match the fade-out duration
    }, 4500); // Countdown duration in milliseconds

    if (audioRef.current) {
      audioRef.current.play();
    }

    return () => {
      clearTimeout(timer);
    };
  }, [onCountdownComplete, onFadeOut]);

  return (
    <div className="countdown-screen d-flex flex-column justify-content-center align-items-center min-vh-100">
      <audio ref={audioRef} src="/assets/videoplayback.m4a" />
      <Player
        autoplay
        src={countdownAnimation}
        style={{ height: '800px', width: '800px' }}
      />
    </div>
  );
};

export default withFadeTransition(Countdown);
