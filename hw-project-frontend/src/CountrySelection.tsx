import React from 'react';
import { FaShoppingCart } from 'react-icons/fa'; // Import the shopping cart icon
import { Country, Player } from './types'; // Make sure to define types in a separate file or inline

interface CountrySelectionProps {
  countries: Country[];
  selectedCountries: { [key: string]: number };
  availablePlayers: number[];
  onSelectCountry: (country: Country) => void;
  onConfirmSelection: () => void;
  getEmojiForCountry: (countryId: number) => string | null;
  getCountryNameById: (countryId: string) => string;
  error: string | null;
}

const players: Player[] = [
  { id: 0, name: 'Player 1', color: 'primary' },
  { id: 1, name: 'Player 2', color: 'danger' },
  { id: 2, name: 'Player 3', color: 'success' },
  { id: 3, name: 'Player 4', color: 'warning' },
];

const CountrySelection: React.FC<CountrySelectionProps> = ({
  countries,
  selectedCountries,
  availablePlayers,
  onSelectCountry,
  onConfirmSelection,
  getEmojiForCountry,
  getCountryNameById,
  error,
}) => {
  console.log("Rendering CountrySelection with countries:", countries);
  const currentPlayerIndex = availablePlayers[0];
  const currentPlayer = players[currentPlayerIndex];
  const allPlayersSelected = availablePlayers.length === 0;

  return (
    <div className="country-grid-kiosk container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 className="Title">
        {allPlayersSelected ? (
          <span className="text-dark">All countries selected</span>
        ) : (
          <>
            <span className={`text-${currentPlayer.color}`}>{currentPlayer.name}:</span>&nbsp;<span className="text-dark">choose your country</span>
          </>
        )}
      </h1>
      {error && <p className="text-danger">Error: {error}</p>}
      <div className="row row-cols-2 row-cols-md-4 g-4">
        {countries.map((country, index) => {
          const selectedPlayerIndex = selectedCountries[country.id];
          const buttonColor = selectedPlayerIndex !== undefined ? players[selectedPlayerIndex].color : 'secondary';
          const emoji = getEmojiForCountry(Number(country.id));

          return (
            <div key={index} className="col">
              <button
                className={`country-button btn btn-${buttonColor} rounded-circle`}
                onClick={() => !allPlayersSelected || selectedPlayerIndex !== undefined ? onSelectCountry(country) : null}
                disabled={allPlayersSelected && selectedPlayerIndex === undefined}
              >
                <span className="country-emoji">{emoji || country.name.slice(0, 2)}</span>
              </button>
              <p className="country-name mt-2">{country.name}</p>
            </div>
          );
        })}
      </div>
      {allPlayersSelected && (
        <button className="orderButton" onClick={onConfirmSelection}>
          <FaShoppingCart /> View Cart
        </button>
      )}
    </div>
  );
};

export default CountrySelection;
