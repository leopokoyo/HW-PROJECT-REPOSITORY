import React, { useEffect, useState } from 'react';

interface FetchDataProps {
  id: number;
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

const FetchData: React.FC<FetchDataProps> = ({ id, trigger, setTrigger }) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (trigger) {
      // Fetch data from the dummy API using the specified ID
      fetch(`http://localhost:3000/users/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setData(data);
          setTrigger(false); // Reset trigger after fetching data
        })
        .catch(error => {
          setError(error.message);
        });
    }
  }, [id, trigger, setTrigger]); // Add trigger and setTrigger to the dependency array

  return (
    <div className="data-container">
      <h1>Fetch Data by ID</h1>
      {error && <p>Error: {error}</p>}
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FetchData;