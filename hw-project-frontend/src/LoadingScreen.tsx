import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from './assets/Loading.json';  // Replace with the path to your Lottie JSON file
import './css/LoadingScreen.css';
import withFadeTransition from './withFadeTransition';

const LoadingScreen: React.FC = () => {
  const text = "Race ongoing..";

  return (
    <div className="loading-screen d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 className="mt-3 text-warning loading-text">
        {text.split("").map((char, index) => (
          <span key={index}>{char === " " ? "\u00A0" : char}</span>
        ))}
      </h1>

      <Player
        autoplay
        loop
        src={loadingAnimation}
        style={{height: '800px', width: '800px'}}
      />
    </div>
  );
};

export default withFadeTransition(LoadingScreen);
