import React from 'react';

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

interface Props {
  countries: Country[];
  selectedCountries: { [key: string]: number };
  players: Player[];
  currentPlayer: Player;
  allPlayersSelected: boolean;
  handleSelectCountry: (country: Country) => void;
  handleConfirmSelection: () => void;
  error: string | null;
  getEmojiForCountry: (countryId: number) => string | null;
}

const CountrySelection: React.FC<Props> = ({
  countries,
  selectedCountries,
  players,
  currentPlayer,
  allPlayersSelected,
  handleSelectCountry,
  handleConfirmSelection,
  error,
  getEmojiForCountry,
}) => {

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
                onClick={() => !allPlayersSelected || selectedPlayerIndex !== undefined ? handleSelectCountry(country) : null}
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
        <button className="orderButton" onClick={handleConfirmSelection}>
          Order Now
        </button>
      )}
    </div>
  );
};

export default CountrySelection;
