import './css/App.css';
import React from 'react';
import FetchData from './FetchData';
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";

const App: React.FC = () => {
  return (
    <div className="App container">
      <FetchData />
    </div>
  );
};

polyfillCountryFlagEmojis();
export default App;
