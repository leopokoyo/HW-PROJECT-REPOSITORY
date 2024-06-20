import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from './assets/Loading.json';  // Replace with the path to your Lottie JSON file

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen d-flex flex-column justify-content-center align-items-center min-vh-100">
      <Player
        autoplay
        loop
        src={loadingAnimation}
        style={{ height: '300px', width: '300px' }}
      />
      <h1 className="mt-3 text-warning">Race going on...</h1>
    </div>
  );
};

export default LoadingScreen;
