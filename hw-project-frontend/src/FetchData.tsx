import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import emojiData from './emojis.json';
import CountrySelection from './CountrySelection';
import LoadingScreen from './LoadingScreen';
import ResultsScreen from './ResultsScreen';
import BettingPage from './BettingPage';
import Countdown from './Countdown';
import { Country, Player, RaceResult } from './types';

const players: Player[] = [
  { id: 0, name: 'Player 1', color: 'primary' },
  { id: 1, name: 'Player 2', color: 'danger' },
  { id: 2, name: 'Player 3', color: 'success' },
  { id: 3, name: 'Player 4', color: 'warning' },
];

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const FetchData: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [displayedCountries, setDisplayedCountries] = useState<Country[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<{ [key: string]: number }>({});
  const [availablePlayers, setAvailablePlayers] = useState<number[]>([0, 1, 2, 3]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<RaceResult | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [showBetting, setShowBetting] = useState<boolean>(false);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);

  useEffect(() => {
    console.log('Fetching countries...');
    fetch('http://192.168.0.3:3000/api/countries')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched countries:', data);
        setCountries(data);
        setDisplayedCountries(selectRandomCountries(data, 16)); // Select 16 random countries to display
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
        setError(error.message);
      });
  }, []);

  const selectRandomCountries = (countries: Country[], count: number) => {
    return shuffleArray([...countries]).slice(0, count);
  };

  const handleSelectCountry = (country: Country) => {
    const currentPlayerIndex = availablePlayers[0];
    const countryId = country.id;

    if (selectedCountries[countryId] !== undefined) {
      const previousPlayerIndex = selectedCountries[countryId];
      delete selectedCountries[countryId];

      setSelectedCountries({ ...selectedCountries });
      setAvailablePlayers([previousPlayerIndex, ...availablePlayers.filter((id) => id !== previousPlayerIndex)]);
    } else {
      setSelectedCountries({ ...selectedCountries, [countryId]: currentPlayerIndex });
      setAvailablePlayers(availablePlayers.slice(1));
    }
  };

  const handleConfirmSelection = () => {
    setShowBetting(true); // Show betting page after country selection
  };

  const handlePlaceBets = () => {
    setShowCountdown(true); // Show countdown after placing the bets
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setLoading(true); // Show loading screen after countdown

    const countryIds = players.map((player) => {
      const countryId = Object.keys(selectedCountries).find((key) => selectedCountries[key] === player.id);
      return countryId || 'null';
    });

    const newSeed = generateRandomSeed();
    setSeed(newSeed);

    const url = `http://192.168.0.3:3000/api/temp/participants/${countryIds.join('/')}/${newSeed}`;

    fetch(url, {
      method: 'PUT',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Data sent to server:', data);
        // Start polling for race results with the generated seed
        const interval = setInterval(() => {
          fetch('http://192.168.0.3:3000/api/races')
            .then((response) => response.json())
            .then((races) => {
              const race = races.find((race: RaceResult) => race.id === newSeed.toString());
              if (race) {
                setResults(race);
                setLoading(false);
                clearInterval(interval); // Stop polling when the correct race is found
              }
            })
            .catch((error) => {
              console.error('Error polling for races:', error);
              setError(error.message);
              setLoading(false);
              clearInterval(interval); // Stop polling on error
            });
        }, 5000); // Poll every 5 seconds
      })
      .catch((error) => {
        console.error('Error sending data to server:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  const handleRestart = () => {
    setCountries([]);
    setDisplayedCountries([]);
    setSelectedCountries({});
    setAvailablePlayers([0, 1, 2, 3]);
    setError(null);
    setLoading(false);
    setResults(null);
    setSeed(null);
    setShowBetting(false);
    setShowCountdown(false);

    fetch('http://192.168.0.3:3000/api/countries')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCountries(data);
        setDisplayedCountries(selectRandomCountries(data, 16)); // Select 16 random countries to display
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const generateRandomSeed = () => {
    return Math.floor(Math.random() * 2 ** 32); // Generate a random 32-bit integer
  };

  const getEmojiForCountry = (countryId: number) => {
    const countryEmoji = emojiData.find((emoji) => emoji.id == countryId);
    return countryEmoji ? countryEmoji.emoticon_code : null;
  };

  const getCountryNameById = (countryId: string) => {
    const country = countries.find((country) => country.id === countryId);
    return country ? country.name : '';
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (results) {
    return <ResultsScreen results={results} handleRestart={handleRestart} getEmojiForCountry={getEmojiForCountry} getCountryNameById={getCountryNameById} />;
  }

  if (showCountdown) {
    return <Countdown onCountdownComplete={handleCountdownComplete} />;
  }

  if (showBetting) {
    const playerInfo = players.map((player) => {
      const countryId = Object.keys(selectedCountries).find((key) => selectedCountries[key] === player.id);
      return {
        name: player.name,
        country: countryId ? getCountryNameById(countryId) : 'None',
        flag: countryId ? getEmojiForCountry(Number(countryId)) : '',
      };
    });
    return <BettingPage onPlaceBets={handlePlaceBets} playerInfo={playerInfo} />;
  }

  return (
    <CountrySelection
      countries={displayedCountries}
      selectedCountries={selectedCountries}
      availablePlayers={availablePlayers}
      onSelectCountry={handleSelectCountry}
      onConfirmSelection={handleConfirmSelection}
      getEmojiForCountry={getEmojiForCountry}
      getCountryNameById={getCountryNameById}
      error={error}
    />
  );
};

export default FetchData;
