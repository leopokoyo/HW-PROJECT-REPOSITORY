import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import emojiData from './emojis.json';  // Import the JSON file
import CountrySelection from './CountrySelection';
import LoadingScreen from './LoadingScreen';
import ResultsScreen from './ResultsScreen';

interface Country {
  id: string;
  name: string;
  avg_income: string;
  bm_price: string;
  nr_monthly_bm: string;
  emoticon_code: string | null;
}

interface Player {
  id: number;
  name: string;
  color: string;
}

interface RaceResult {
  id: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  type: string;
}

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

  useEffect(() => {
    fetch('http://192.168.0.3:3000/api/countries')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCountries(data);
        setDisplayedCountries(selectRandomCountries(data, 16)); // Select 16 random countries to display
      })
      .catch(error => {
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
      setAvailablePlayers([previousPlayerIndex, ...availablePlayers.filter(id => id !== previousPlayerIndex)]);
    } else {
      setSelectedCountries({ ...selectedCountries, [countryId]: currentPlayerIndex });
      setAvailablePlayers(availablePlayers.slice(1));
    }
  };

  const handleConfirmSelection = () => {
    if (availablePlayers.length === 0) {
      setLoading(true);

      const countryIds = players.map(player => {
        const countryId = Object.keys(selectedCountries).find(
          key => selectedCountries[key] === player.id
        );
        return countryId || 'null';
      });

      const url = `http://192.168.0.3:3000/api/temp/${countryIds.join('/')}`;

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
          // Simulate waiting for race results
          setTimeout(() => {
            fetch('http://192.168.0.3:3000/api/races')
              .then(response => response.json())
              .then(races => {
                const latestRace = races[races.length - 1];
                setResults(latestRace);
                setLoading(false);
              });
          }, 6000); // Simulate a delay
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }
  };

  const handleRestart = () => {
    setSelectedCountries({});
    setAvailablePlayers([0, 1, 2, 3]);
    setError(null);
    setLoading(false);
    setResults(null);
    setDisplayedCountries(selectRandomCountries(countries, 16)); // Select 16 random countries to display
  };

  const currentPlayerIndex = availablePlayers[0];
  const currentPlayer = players[currentPlayerIndex];
  const allPlayersSelected = availablePlayers.length === 0;

  const getEmojiForCountry = (countryId: number) => {
    const countryEmoji = emojiData.find(emoji => emoji.id == countryId);
    return countryEmoji ? countryEmoji.emoticon_code : null;
  };

  const getCountryNameById = (countryId: string) => {
    const country = countries.find(country => country.id === countryId);
    return country ? country.name : '';
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (results) {
    return <ResultsScreen results={results} handleRestart={handleRestart} getEmojiForCountry={getEmojiForCountry} getCountryNameById={getCountryNameById} />;
  }

  return (
    <CountrySelection
      countries={displayedCountries}
      selectedCountries={selectedCountries}
      players={players}
      currentPlayer={currentPlayer}
      allPlayersSelected={allPlayersSelected}
      handleSelectCountry={handleSelectCountry}
      handleConfirmSelection={handleConfirmSelection}
      error={error}
      getEmojiForCountry={getEmojiForCountry}
    />
  );
};

export default FetchData;
