import React from 'react';

interface RaceResult {
  id: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  type: string;
}

interface Props {
  results: RaceResult;
  handleRestart: () => void;
  getEmojiForCountry: (countryId: number) => string | null;
  getCountryNameById: (countryId: string) => string;
}

const ResultsScreen: React.FC<Props> = ({
  results,
  handleRestart,
  getEmojiForCountry,
  getCountryNameById,
}) => {
  return (
    <div className="results-screen d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 className="TitleResult">Results</h1>
      <div className="result-item mt-5">
        <h2>1st: {getEmojiForCountry(Number(results.p1))} {getCountryNameById(results.p1)}</h2>
      </div>
      <div className="result-item">
        <h2>2nd: {getEmojiForCountry(Number(results.p2))} {getCountryNameById(results.p2)}</h2>
      </div>
      <div className="result-item">
        <h2>3rd: {getEmojiForCountry(Number(results.p3))} {getCountryNameById(results.p3)}</h2>
      </div>
      <div className="result-item">
        <h2>4th: {getEmojiForCountry(Number(results.p4))} {getCountryNameById(results.p4)}</h2>
      </div>
      <button className="btn btn-warning btn-lg mt-3" onClick={handleRestart}>
        Restart
      </button>
    </div>
  );
};

export default ResultsScreen;
