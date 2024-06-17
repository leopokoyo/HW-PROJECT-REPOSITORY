import './css/App.css';
import React, {useState} from 'react';
import HelloWorld from './HelloWorld';
import FetchData from './FetchData';

const App: React.FC = () => {
  const [id, setId] = useState<number>(1);
  const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(Number(event.target.value));
  };

  const handleFetch = () => {
    setFetchTrigger(true); // Set fetchTrigger to true to trigger data fetch
  };

  return (
    <div className="App">
      <HelloWorld />
      <h1>Specify ID to Fetch Data</h1>
      <div className="input-group">
        <input
          type="number"
          value={id}
          onChange={handleChange}
          min="0"
          max="99"
        />
        <button onClick={handleFetch}>Fetch</button>
      </div>
      <FetchData id={id} trigger={fetchTrigger} setTrigger={setFetchTrigger} />
    </div>
  );
};

export default App;