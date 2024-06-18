import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Country {
  id: string;
  name: string;
  min_wage: string;
  bm_price: string;
  nr_monthly_bm: string;
  emoticon_code: string | null;
}

const FetchData: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://145.126.60.8:3000/api/countries')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCountries(data);
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleBack = () => {
    setSelectedCountry(null);
  };

  if (selectedCountry) {
    return (
      <div className="country-info">
        <button onClick={handleBack} className="btn btn-warning mb-4">Back</button>
        <div className="card text-center">
          <div className="card-body">
            <h1>{selectedCountry.emoticon_code || '🌍'} {selectedCountry.name}</h1>
            <ul className="list-group mt-3">
              <li className="list-group-item">Minimum Wage: {selectedCountry.min_wage === '0' ? 'N/A' : selectedCountry.min_wage}</li>
              <li className="list-group-item">Big Mac Price: ${parseFloat(selectedCountry.bm_price).toFixed(2)}</li>
              <li className="list-group-item">Big Macs per Month: {selectedCountry.nr_monthly_bm}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="country-grid text-center">
      <h1 className="mb-4 mt-3">Select a Country</h1>
      {error && <p className="text-danger">Error: {error}</p>}
      <div className="row justify-content-center">
        {countries.map((country, index) => (
          <div key={index} className="col-4 col-sm-3 col-md-2 mb-4">
            <button className="country-button btn btn-outline-secondary" onClick={() => handleSelectCountry(country)}>
              {country.emoticon_code || '🌍'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FetchData;
