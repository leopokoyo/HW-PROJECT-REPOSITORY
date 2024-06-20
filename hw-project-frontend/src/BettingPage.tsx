import React, { useState, useEffect } from 'react';
import './css/BettingPage.css';
import withFadeTransition from './withFadeTransition';

interface BettingPageProps {
  onPlaceBets: () => void;
  playerInfo: { name: string, country: string, flag: string }[];
  onFadeOut: () => void;
}

const BettingPage: React.FC<BettingPageProps> = ({ onPlaceBets, playerInfo, onFadeOut }) => {
  const [bets, setBets] = useState({
    player1: 5,
    player2: 5,
    player3: 5,
    player4: 5,
  });
  const [shaking, setShaking] = useState<{ [key: string]: boolean }>({
    player1: false,
    player2: false,
    player3: false,
    player4: false,
  });

  const handleBetChange = (player: string, value: number) => {
    setBets({ ...bets, [player]: value });
    setSliderValue(player, value);
    triggerShake(player);
  };

  const setSliderValue = (player: string, value: number) => {
    const slider = document.querySelector(`.slider.${player}`) as HTMLElement;
    if (slider) {
      slider.style.setProperty('--value', `${(value / 10) * 100}%`);
    }
  };

  const triggerShake = (player: string) => {
    setShaking((prevState) => ({ ...prevState, [player]: true }));
  };

  const stopShake = (player: string) => {
    setShaking((prevState) => ({ ...prevState, [player]: false }));
  };

  useEffect(() => {
    Object.keys(bets).forEach(player => {
      setSliderValue(player, bets[player]);
    });
  }, [bets]);

  const placeBets = () => {
    onFadeOut();
    setTimeout(() => {
      const bettingAmounts = [
        bets.player1,
        bets.player2,
        bets.player3,
        bets.player4
      ];

      const url = `http://192.168.0.3:3000/api/temp/betting/${bettingAmounts.join('/')}`;

      fetch(url, {
        method: 'PUT',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Bets placed successfully:', data);
          onPlaceBets(); // Show countdown after placing the bets
        })
        .catch(error => {
          console.error('Error placing bets:', error);
        });
    }, 500); // Match the fade-out duration
  };

  return (
    <div className="betting-page">
      <h1 className="Title">Place Your Bets</h1>
      <div className="slider-container">
        {playerInfo.map((player, index) => (
          <div key={index} className="slider-wrapper">
            <div className="player-info">
              <p className="player-name">{player.name}</p>
              <p>{player.country} {player.flag}</p>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.01"
              value={bets[`player${index + 1}`]}
              className={`slider player${index + 1}`}
              onMouseDown={() => triggerShake(`player${index + 1}`)}
              onMouseUp={() => stopShake(`player${index + 1}`)}
              onTouchStart={() => triggerShake(`player${index + 1}`)}
              onTouchEnd={() => stopShake(`player${index + 1}`)}
              onChange={(e) => handleBetChange(`player${index + 1}`, parseFloat(e.target.value))}
            />
            <div className={`bet-amount ${shaking[`player${index + 1}`] ? 'shake' : ''}`}>
              €{bets[`player${index + 1}`].toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <button className="orderButton" onClick={placeBets}>
        Order Now
      </button>
    </div>
  );
};

export default withFadeTransition(BettingPage);
